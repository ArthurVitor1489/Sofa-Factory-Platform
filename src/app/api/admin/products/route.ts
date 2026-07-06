import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/services/dbService';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || (session.role !== 'admin' && session.role !== 'editor')) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, nome, slug, categoria_id, descricao, dimensoes, garantia, ativo, destaque } = body;

    if (!nome || !slug || !categoria_id) {
      return NextResponse.json({ error: 'Dados obrigatórios ausentes.' }, { status: 400 });
    }

    const savedProduct = await dbService.saveProduct({
      id,
      nome,
      slug,
      categoria_id,
      descricao,
      dimensoes,
      garantia,
      ativo,
      destaque,
    });

    return NextResponse.json({ success: true, product: savedProduct });
  } catch (error) {
    console.error('Save product API error:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar produto.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Apenas administradores podem excluir produtos.' }, { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do produto não informado.' }, { status: 400 });
    }

    const success = await dbService.deleteProduct(id);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Delete product API error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
