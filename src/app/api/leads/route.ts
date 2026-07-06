import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbService } from '@/services/dbService';
import { rateLimit, validateHoneypot, verifyTurnstileToken } from '@/utils/security';

const leadSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  mensagem: z.string().optional(),
  produto_id: z.string().uuid('ID de produto inválido').nullable().optional(),
  turnstileToken: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Rate Limiting: Max 3 leads submissions per hour per IP
  const rateLimitResult = await rateLimit(ip, 'submit_lead', 3, 3600);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Você atingiu o limite de envio de orçamentos. Tente novamente mais tarde.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // 2. Honeypot check
    const mockFormData = new FormData();
    if (body.confirm_email_address) {
      mockFormData.append('confirm_email_address', body.confirm_email_address);
    }
    if (!validateHoneypot(mockFormData)) {
      // Reject bot silently (simulating success)
      return NextResponse.json({ success: true, message: 'Orçamento solicitado com sucesso!' });
    }

    // 3. Cloudflare Turnstile token validation
    if (process.env.TURNSTILE_SECRET_KEY) {
      const isHuman = await verifyTurnstileToken(body.turnstileToken);
      if (!isHuman) {
        return NextResponse.json(
          { error: 'Falha na verificação de segurança (CAPTCHA).' },
          { status: 400 }
        );
      }
    }

    // 4. Input validation
    const validation = leadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados do formulário inválidos', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { nome, telefone, email, mensagem, produto_id } = validation.data;

    // 5. Create Lead in Database
    const newLead = await dbService.createLead({
      nome,
      telefone,
      email: email || undefined,
      mensagem: mensagem || undefined,
      produto_id: produto_id || undefined,
      status: 'novo',
      origem: 'Website',
    });

    return NextResponse.json({
      success: true,
      message: 'Orçamento solicitado com sucesso!',
      lead: { id: newLead.id },
    });
  } catch (error) {
    console.error('Submit Lead API error:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro interno ao processar seu orçamento.' },
      { status: 500 }
    );
  }
}
