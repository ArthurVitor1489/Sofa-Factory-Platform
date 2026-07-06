import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbService } from '@/services/dbService';
import { comparePasswords, signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth';
import { rateLimit, validateHoneypot } from '@/utils/security';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Rate Limiting (Limit to 5 login attempts per minute per IP)
  const rateLimitResult = await rateLimit(ip, 'login', 5, 60);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Muitas tentativas de login. Tente novamente mais tarde.' },
      { status: 429 }
    );
  }

  try {
    // We get either JSON body or Form data depending on how it was sent
    const body = await request.json();

    // 2. Honeypot check (in case user submitted via standard html form)
    // Create a mock FormData object from request keys to validate honeypot
    const mockFormData = new FormData();
    if (body.confirm_email_address) {
      mockFormData.append('confirm_email_address', body.confirm_email_address);
    }
    if (!validateHoneypot(mockFormData)) {
      // If honeypot failed, reject silently but with a success-like delay to throw off bots
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ success: true, user: { email: body.email } });
    }

    // 3. Validation
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // 4. Authenticate user
    const user = await dbService.getUserByEmail(email);

    if (!user) {
      // Uniform error message for safety (prevent username harvesting)
      return NextResponse.json(
        { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' },
        { status: 401 }
      );
    }

    const isMatch = await comparePasswords(password, user.password_hash || '');
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' },
        { status: 401 }
      );
    }

    // 5. Generate and Set Cookies
    const sessionPayload = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
    };

    const accessToken = signAccessToken(sessionPayload);
    const refreshToken = signRefreshToken({ id: user.id });

    await setAuthCookies(accessToken, refreshToken);

    // 6. Log Auditoria
    await dbService.createAuditLog({
      usuario_id: user.id,
      acao: 'LOGIN',
      new_data: { email: user.email, role: user.role },
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro interno de servidor.' },
      { status: 500 }
    );
  }
}
