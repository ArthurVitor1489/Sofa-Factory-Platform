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
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do produto não informado.' }, { status: 400 });
    }

    // In mock/prod, we retrieve the base product details
    const products = await dbService.getProducts();
    const baseProduct = products.find((p) => p.id === id);

    if (!baseProduct) {
      return NextResponse.json({ error: 'Produto base não encontrado.' }, { status: 404 });
    }

    const timestamp = Date.now();
    const duplicatedProduct = await dbService.saveProduct({
      categoria_id: baseProduct.categoria_id,
      nome: `${baseProduct.nome} (Cópia)`,
      slug: `${baseProduct.slug}-copia-${timestamp}`,
      descricao: baseProduct.descricao,
      dimensoes: baseProduct.dimensoes,
      garantia: baseProduct.garantia,
      ativo: false, // Start as inactive to allow review before publishing
      destaque: false,
    });

    // Create Audit Log
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    await dbService.createAuditLog({
      usuario_id: session.id,
      acao: 'PRODUTO_DUPLICATE',
      new_data: { baseProductId: id, duplicatedProductId: duplicatedProduct.id },
      ip_address: ip,
    });

    return NextResponse.json({ success: true, product: duplicatedProduct });
  } catch (error) {
    console.error('Duplicate product API error:', error);
    return NextResponse.json({ error: 'Erro interno ao duplicar produto.' }, { status: 500 });
  }
}
