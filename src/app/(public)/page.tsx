import Link from 'next/link';
import Image from 'next/image';
import { dbService } from '@/services/dbService';
import HeroCarousel from '@/components/shared/HeroCarousel';
import ProductCard from '@/components/shared/ProductCard';
import {
  Shield,
  Heart,
  Ruler,
  Truck,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Award,
  Users
} from 'lucide-react';

export const revalidate = 3600; // Revalidate page cache hourly (ISR)

export default async function HomePage() {
  // Fetch dynamic content
  const banners = await dbService.getBanners();
  const categories = await dbService.getCategories();
  const featuredProducts = await dbService.getDestaques();
  const testimonials = await dbService.getTestimonials();

  const features = [
    {
      icon: Heart,
      title: 'Conforto Ergonômico',
      description: 'Projetamos nossos estofados alinhando estética e densidades pensadas para a ergonomia do seu corpo.'
    },
    {
      icon: Ruler,
      title: 'Sob Medida Real',
      description: 'Adaptamos comprimentos, profundidades, tecidos e espumas para encaixar perfeitamente no seu espaço.'
    },
    {
      icon: Shield,
      title: 'Garantia de Fábrica',
      description: 'Estruturas em madeira tratada de reflorestamento com até 5 anos de garantia certificada.'
    },
    {
      icon: Truck,
      title: 'Entrega Especializada',
      description: 'Frota própria com equipe treinada para içar e montar seus móveis com máximo cuidado.'
    }
  ];

  return (
    <div className="w-full pb-16">
      {/* 1. Hero banner section */}
      <HeroCarousel banners={banners} />

      {/* 2. Categories grid section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-2">
            Portfólio de Produtos
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Explore por Categoria
          </h2>
          <div className="h-[2px] w-12 bg-primary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo?categoria=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border"
            >
              <Image
                src={cat.imagem_url || '/images/sofa_retratil.png'}
                alt={cat.nome}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                <h3 className="font-serif text-base sm:text-lg font-semibold tracking-tight">
                  {cat.nome}
                </h3>
                <span className="inline-flex items-center text-[10px] font-semibold text-[#C5A880] uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver Coleção <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Diferenciais (Why choose us) */}
      <section className="bg-stone-50 border-y border-border py-20 my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image side */}
            <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-xl overflow-hidden shadow-lg border border-border">
              <Image
                src="/images/hero_banner.png"
                alt="Processo produtivo artesanal"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/10" />
            </div>

            {/* Content side */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest block">
                  Qualidade Artesanal
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Desenhado para Durar, Feito para Aconchegar
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed font-light">
                  Acreditamos que o mobiliário não é apenas decoração, mas a base de memórias em família. Combinamos técnicas tradicionais de marcenaria e tapeçaria com materiais tecnológicos de alta performance para entregar peças exclusivas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex space-x-3.5 items-start">
                      <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-primary shrink-0 shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-foreground">
                          {feat.title}
                        </h4>
                        <p className="text-stone-500 text-xs leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured products (Destaques) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest block">
              Destaques da Fábrica
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
              Móveis que Inspiram Conforto
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="text-sm font-semibold text-primary hover:underline inline-flex items-center space-x-1 mt-4 sm:mt-0"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. Client Testimonials (Depoimentos) */}
      <section className="bg-stone-50 border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-2">
              Opinião de quem Compra
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
              Histórias de Aconchego
            </h2>
            <div className="h-[2px] w-12 bg-primary mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-card border border-border p-8 rounded-xl shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < test.nota ? 'text-amber-500 fill-amber-500' : 'text-stone-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-stone-600 text-sm italic leading-relaxed">
                    &ldquo;{test.texto}&rdquo;
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {test.cliente_nome}
                  </h4>
                  {test.cidade_estado && (
                    <span className="text-xs text-muted-foreground">
                      {test.cidade_estado}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-[#1E1B18] text-white rounded-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden border border-[#312E2B] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left z-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Deseja um projeto de estofado sob medida?
            </h2>
            <p className="text-stone-400 text-sm sm:text-base font-light leading-relaxed">
              Fale diretamente com nossa equipe comercial. Enviamos amostras de tecidos para sua residência e montamos o orçamento de acordo com o seu desenho.
            </p>
          </div>
          <div className="shrink-0 z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href="https://wa.me/5519987654321?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento%20para%20um%20sofá%20sob%20medida."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-[#25D366] text-white hover:bg-[#20ba59] px-6 py-4 rounded-xl text-base font-bold shadow-lg shadow-[#25D366]/10 transition-colors w-full sm:w-auto"
            >
              <MessageCircle className="w-5.5 h-5.5 fill-white" />
              <span>Chamar no WhatsApp</span>
            </a>
            <Link
              href="/contato"
              className="inline-flex items-center justify-center space-x-2 border border-stone-600 text-white hover:bg-stone-800 px-6 py-4 rounded-xl text-base font-semibold transition-colors w-full sm:w-auto"
            >
              <span>Preencher Formulário</span>
            </Link>
          </div>

          {/* Decorative shapes */}
          <div className="absolute right-[-10%] top-[-20%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute left-[-5%] bottom-[-10%] w-[250px] h-[250px] rounded-full bg-primary/5 blur-2xl" />
        </div>
      </section>
    </div>
  );
}
