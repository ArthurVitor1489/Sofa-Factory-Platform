import { dbService } from '@/services/dbService';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductDetailPanel from '@/components/shared/ProductDetailPanel';
import ProductCard from '@/components/shared/ProductCard';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface Params {
  category_slug: string;
  product_slug: string;
}

// 1. Generate Dynamic Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await dbService.getProductBySlug(resolvedParams.product_slug);

  if (!product) {
    return {
      title: 'Produto Não Encontrado | Arte & Conforto',
    };
  }

  const imageUrl = product.imagens && product.imagens.length > 0 ? product.imagens[0].url : '/images/sofa_retratil.png';

  return {
    title: `${product.nome} | Estofados Arte & Conforto`,
    description: product.descricao || `Móvel de luxo sob medida fabricado pela Estofados Arte & Conforto.`,
    openGraph: {
      title: `${product.nome} | Arte & Conforto`,
      description: product.descricao,
      images: [{ url: imageUrl }],
    },
  };
}

// 2. Render Product Page
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolvedParams = await params;
  const product = await dbService.getProductBySlug(resolvedParams.product_slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current product)
  const allCategoryProducts = await dbService.getProducts({
    categorySlug: resolvedParams.category_slug,
    onlyActive: true,
  });
  const relatedProducts = allCategoryProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const mainImageUrl = product.imagens && product.imagens.length > 0 ? product.imagens[0].url : '/images/sofa_retratil.png';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Back button and Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link
          href="/catalogo"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors space-x-1.5 self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Catálogo</span>
        </Link>

        {/* Breadcrumb List */}
        <nav className="flex items-center space-x-2 text-xs text-stone-500 font-light overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Início
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <Link href="/catalogo" className="hover:text-primary transition-colors">
            Catálogo
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          {product.categoria && (
            <>
              <Link
                href={`/catalogo?categoria=${product.categoria.slug}`}
                className="hover:text-primary transition-colors"
              >
                {product.categoria.nome}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            </>
          )}
          <span className="text-foreground font-medium truncate max-w-[180px]">
            {product.nome}
          </span>
        </nav>
      </div>

      {/* Product Details Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Image Showcase */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-border bg-stone-50 shadow-sm">
            <Image
              src={mainImageUrl}
              alt={product.nome}
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Secondary Thumbnail gallery indicators */}
          {product.imagens && product.imagens.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.imagens.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                >
                  <Image src={img.url} alt={product.nome} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Interactive Configuration & Forms */}
        <div className="lg:col-span-5 bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm">
          <ProductDetailPanel product={product} />
        </div>
      </div>

      {/* Related products (Quem viu também gostou) */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border mt-20 pt-16 space-y-8">
          <div className="text-center sm:text-left space-y-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest block">
              Sugestões Especiais
            </span>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Quem viu este produto, também gostou:
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
