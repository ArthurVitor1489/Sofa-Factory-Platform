import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/services/dbService';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const logs = await dbService.getAuditLogs();
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Fetch logs API error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
