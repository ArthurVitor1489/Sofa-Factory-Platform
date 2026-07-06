import { dbService } from '@/services/dbService';
import ProductCard from '@/components/shared/ProductCard';
import Link from 'next/link';
import { Search, SlidersHorizontal, EyeOff, LayoutGrid } from 'lucide-react';

interface SearchParams {
  categoria?: string;
  q?: string;
}

export const dynamic = 'force-dynamic'; // Force dynamic rendering as searchParams are used

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const activeCategorySlug = resolvedParams.categoria || '';
  const searchQuery = resolvedParams.q || '';

  // Fetch data
  const categories = await dbService.getCategories();
  const products = await dbService.getProducts({
    categorySlug: activeCategorySlug || undefined,
    query: searchQuery || undefined,
    onlyActive: true,
  });

  const activeCategory = categories.find((c) => c.slug === activeCategorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* 1. Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-1">
          Nosso Catálogo
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {activeCategory ? activeCategory.nome : 'Mobiliário de Alto Padrão'}
        </h1>
        <p className="text-stone-500 text-sm mt-2 max-w-2xl font-light leading-relaxed">
          {activeCategory
            ? activeCategory.descricao
            : 'Explore nossa coleção completa de sofás, poltronas, mesas e planejados pensados para o seu aconchego e bem-estar.'}
        </p>
      </div>

      {/* 2. Controls & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-foreground flex items-center space-x-2">
              <SlidersHorizontal className="w-4.5 h-4.5 text-primary" />
              <span>Categorias</span>
            </h3>
            <div className="h-[1px] w-full bg-border" />
            <div className="flex flex-col space-y-2.5">
              <Link
                href="/catalogo"
                className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${
                  !activeCategorySlug
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                Todas as Peças
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalogo?categoria=${cat.slug}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                  className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${
                    activeCategorySlug === cat.slug
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat.nome}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side: Product Grid and Mobile Search */}
        <div className="lg:col-span-9 space-y-6">
          {/* Search form */}
          <form method="GET" action="/catalogo" className="w-full flex gap-3">
            {activeCategorySlug && (
              <input type="hidden" name="categoria" value={activeCategorySlug} />
            )}
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Pesquisar por modelo, material, cor..."
                className="w-full h-12 pl-11 pr-4 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/95 px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-md cursor-pointer"
            >
              Pesquisar
            </button>
          </form>

          {/* Mobile Category Filters (Horizontal scroll) */}
          <div className="lg:hidden flex space-x-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none">
            <Link
              href="/catalogo"
              className={`shrink-0 text-xs py-2 px-4 rounded-full border transition-all ${
                !activeCategorySlug
                  ? 'bg-primary text-primary-foreground border-primary font-medium'
                  : 'bg-white text-stone-600 border-border hover:bg-stone-50'
              }`}
            >
              Todas
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo?categoria=${cat.slug}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                className={`shrink-0 text-xs py-2 px-4 rounded-full border transition-all ${
                  activeCategorySlug === cat.slug
                    ? 'bg-primary text-primary-foreground border-primary font-medium'
                    : 'bg-white text-stone-600 border-border hover:bg-stone-50'
                }`}
              >
                {cat.nome}
              </Link>
            ))}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1.5">
            <span className="flex items-center space-x-1.5">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>
                Mostrando {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </span>
            </span>
            {searchQuery && (
              <span>
                Pesquisa para: <strong className="text-foreground">&ldquo;{searchQuery}&rdquo;</strong>
              </span>
            )}
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-stone-50 border border-dashed border-border rounded-xl space-y-4">
              <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto shadow-inner">
                <EyeOff className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Nenhum móvel encontrado
                </h3>
                <p className="text-stone-500 text-xs max-w-sm mx-auto leading-relaxed">
                  Não encontramos produtos correspondentes aos filtros selecionados. Tente remover os termos de busca ou mudar a categoria.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                >
                  Limpar todos os filtros
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
