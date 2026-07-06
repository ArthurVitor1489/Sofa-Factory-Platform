import Image from 'next/image';
import { Award, Compass, HeartHandshake, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Nossa História | Estofados Arte & Conforto',
  description: 'Conheça nossa fábrica e nossa trajetória desde 1998 moldando móveis e sofás sob medida com técnicas tradicionais de tapeçaria e marcenaria.',
};

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Design Autoral',
      description: 'Móveis desenhados com linhas elegantes e atemporais, misturando referências clássicas e contemporâneas.'
    },
    {
      icon: Compass,
      title: 'Precisão Construtiva',
      description: 'Marchetaria, encaixes e costuras inspecionadas individualmente por mestres artesãos de vasta experiência.'
    },
    {
      icon: ShieldCheck,
      title: 'Matéria-Prima Certificada',
      description: 'Madeiras de reflorestamento com tratamento anti-pragas e espumas certificadas pelas normas federais.'
    },
    {
      icon: HeartHandshake,
      title: 'Atendimento Próximo',
      description: 'Tratamos cada cliente, arquiteto e designer de interiores como um parceiro valioso de nossa trajetória.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-20">
      {/* 1. Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest block">
          Quem Somos
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Nossa Trajetória de Design e Conforto
        </h1>
        <div className="h-[2px] w-12 bg-primary mx-auto mt-4" />
      </div>

      {/* 2. Brand Story split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-border">
          <Image
            src="/images/hero_banner.png"
            alt="Ambiente estofados"
            fill
            className="object-cover"
          />
        </div>
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Desde 1998 criando estofados sob medida
          </h2>
          <div className="space-y-4 text-stone-600 text-sm leading-relaxed font-light">
            <p>
              Nossa história começou como uma pequena tapeçaria familiar na região de Americana, interior de São Paulo. Movidos pela paixão de criar móveis duráveis e confortáveis, fomos aprimorando nosso processo de fabricação ao longo das décadas.
            </p>
            <p>
              Hoje, com um parque fabril moderno e equipe qualificada, atendemos revendedores de alto padrão, arquitetos e clientes finais em todo o estado. Nossa especialidade são sofás e poltronas modulares com tecidos refinados, marcenaria interna robusta e espumas soft exclusivas.
            </p>
            <p>
              Diferente da produção industrial em massa, cada peça que sai de nossa fábrica passa por processos manuais de costura, estofamento e ajuste. Esse cuidado garante que seu sofá não seja apenas bonito, mas uma peça durável que fará parte do aconchego da sua família por muitos anos.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Our Values */}
      <section className="bg-stone-50 border border-border p-8 sm:p-12 rounded-2xl space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest block">
            Diretrizes de Qualidade
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Nossos Valores Fundamentais
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="flex space-x-4">
                <div className="w-11 h-11 rounded-xl bg-white border border-border flex items-center justify-center text-primary shrink-0 shadow-sm">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">
                    {val.title}
                  </h4>
                  <p className="text-stone-500 text-xs leading-relaxed font-light">
                    {val.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
