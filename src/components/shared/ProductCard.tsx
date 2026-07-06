import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Produto } from '@/types';

interface ProductCardProps {
  product: Produto;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.imagens && product.imagens.length > 0
    ? product.imagens[0].url
    : '/images/sofa_retratil.png';

  const categorySlug = product.categoria?.slug || 'produtos';
  const detailLink = `/${categorySlug}/${product.slug}`;

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Panel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <Image
          src={imageUrl}
          alt={product.nome}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        {product.categoria && (
          <span className="absolute top-4 left-4 z-10 text-[10px] uppercase tracking-wider font-semibold bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-md border border-stone-200">
            {product.categoria.nome}
          </span>
        )}

        {/* Warranty Tag */}
        {product.garantia && (
          <div className="absolute bottom-3 right-3 bg-stone-900/85 backdrop-blur-sm text-[#C5A880] text-[10px] font-medium py-1 px-2.5 rounded-md flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Garantia</span>
          </div>
        )}
      </div>

      {/* Body details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link href={detailLink} className="block group-hover:text-primary transition-colors">
            <h3 className="font-serif text-lg font-bold leading-tight tracking-tight text-foreground line-clamp-1">
              {product.nome}
            </h3>
          </Link>
          <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
            {product.descricao}
          </p>
        </div>

        {/* Fabric/Colors previews if available */}
        {product.tecidos && product.tecidos.length > 0 && (
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mr-1">
              Tecidos:
            </span>
            <div className="flex -space-x-1 overflow-hidden">
              {product.tecidos.slice(0, 4).map((tec) => (
                <div
                  key={tec.id}
                  title={tec.nome}
                  className="w-4 h-4 rounded-full border border-white ring-1 ring-stone-200"
                  style={{ backgroundColor: tec.cor_hex || '#CCC' }}
                />
              ))}
              {product.tecidos.length > 4 && (
                <div className="w-4 h-4 rounded-full bg-stone-200 border border-white flex items-center justify-center text-[7px] font-semibold text-stone-600">
                  +{product.tecidos.length - 4}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Link Button */}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Sob Medida
          </span>
          <Link
            href={detailLink}
            className="inline-flex items-center text-xs font-semibold text-foreground group-hover:text-primary transition-colors space-x-1"
          >
            <span>Ver Detalhes</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
