import ContactForm from '@/components/forms/ContactForm';
import { Phone, Mail, MapPin, Clock, MessageSquare, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Fale Conosco | Estofados Arte & Conforto',
  description: 'Entre em contato com nossa equipe comercial, envie sua mensagem ou solicite um orçamento de móveis sob medida.',
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest block">
          Canais de Atendimento
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Fale Conosco
        </h1>
        <p className="text-stone-500 text-sm font-light leading-relaxed">
          Tem dúvidas ou gostaria de agendar uma visita ao nosso showroom de fábrica? Envie uma mensagem ou fale conosco em nossos canais.
        </p>
        <div className="h-[2px] w-12 bg-primary mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-4">
        {/* Left Column: Contact Channels and Map */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-stone-50 border border-border p-6 rounded-2xl space-y-6">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Informações de Contato
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm text-stone-600">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Fábrica e Showroom</h4>
                  <p className="font-light mt-0.5 leading-relaxed">
                    Av. Design de Interiores, 1500 - Distrito Industrial, Americana - SP, 13470-000
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm text-stone-600">
                <MessageSquare className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">WhatsApp Vendas</h4>
                  <a
                    href="https://wa.me/5519987654321"
                    target="_blank"
                    rel="noreferrer"
                    className="font-light mt-0.5 hover:text-primary transition-colors block"
                  >
                    (19) 98765-4321
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm text-stone-600">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Telefone Fixo</h4>
                  <p className="font-light mt-0.5">(19) 3456-7890</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm text-stone-600">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">E-mail Comercial</h4>
                  <a
                    href="mailto:contato@arteconforto.com.br"
                    className="font-light mt-0.5 hover:text-primary transition-colors block"
                  >
                    contato@arteconforto.com.br
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm text-stone-600 border-t border-border pt-4">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Horários de Atendimento</h4>
                  <p className="font-light mt-0.5 leading-relaxed text-xs">
                    Segunda a Sexta: 08:00 às 18:00<br />
                    Sábados: 08:00 às 13:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Map Mock */}
          <div className="relative h-60 w-full bg-stone-100 rounded-2xl overflow-hidden border border-border group shadow-sm">
            {/* Visual map representation */}
            <div className="absolute inset-0 bg-stone-200 flex items-center justify-center p-6 text-center space-y-3 flex-col">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <MapPin className="w-5.5 h-5.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">Americana, São Paulo</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-light">
                  Distrito Industrial (Polo Têxtil / Moveleiro)
                </p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-xs bg-white text-stone-700 hover:bg-stone-50 py-1.5 px-3 rounded-lg border border-stone-300 font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <span>Ver no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 transition-all rounded-2xl pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
