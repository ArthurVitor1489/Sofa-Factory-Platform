import { dbService } from '@/services/dbService';
import Image from 'next/image';
import { MapPin, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Portfólio de Projetos | Estofados Arte & Conforto',
  description: 'Conheça nossos móveis em ambientes reais e projetos desenvolvidos por arquitetos parceiros com sofás e marcenaria de nossa fábrica.',
};

export const revalidate = 3600; // Revalidate dynamic content hourly

export default async function ProjectsPage() {
  const projects = await dbService.getProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest block">
          Galeria de Interiores
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Nossos Móveis em Ambientes Reais
        </h1>
        <p className="text-stone-500 text-sm font-light leading-relaxed">
          Inspire-se com projetos residenciais e corporativos de alto padrão entregues e montados com o selo de qualidade Arte & Conforto.
        </p>
        <div className="h-[2px] w-12 bg-primary mx-auto mt-4" />
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                <Image
                  src={proj.capa_url || '/images/hero_banner.png'}
                  alt={proj.titulo}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
                />
                
                {/* Location Badge */}
                {(proj.cidade || proj.estado) && (
                  <div className="absolute top-4 left-4 bg-stone-950/80 backdrop-blur-sm text-white text-xs font-medium py-1.5 px-3 rounded-lg flex items-center space-x-1 border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {proj.cidade} {proj.estado ? `- ${proj.estado}` : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {proj.titulo}
                  </h3>
                  <p className="text-stone-500 text-sm font-light leading-relaxed">
                    {proj.descricao}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-primary font-semibold uppercase tracking-wider">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ambiente Integrado</span>
                  </span>
                  <span className="text-stone-400 group-hover:text-primary transition-colors font-medium">
                    Montagem Própria
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-stone-50 border border-dashed border-border rounded-2xl max-w-lg mx-auto">
          <p className="font-serif text-lg text-foreground font-semibold">
            Portfólio em atualização
          </p>
          <p className="text-stone-500 text-xs mt-1.5 leading-relaxed font-light">
            Estamos fotografando novas residências de clientes. Em breve você verá novas inspirações por aqui.
          </p>
        </div>
      )}
    </div>
  );
}
