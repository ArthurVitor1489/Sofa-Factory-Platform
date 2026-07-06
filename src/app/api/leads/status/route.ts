import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/services/dbService';
import { getSession } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  const session = await getSession();

  // Protect API route
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Dados insuficientes.' }, { status: 400 });
    }

    const success = await dbService.updateLeadStatus(id, status);

    if (success) {
      // Create Audit Log
      const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
      await dbService.createAuditLog({
        usuario_id: session.id,
        acao: 'LEAD_STATUS_UPDATE',
        new_data: { leadId: id, newStatus: status },
        ip_address: ip,
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Update lead status error:', error);
    return NextResponse.json({ error: 'Erro interno de servidor.' }, { status: 500 });
  }
}
