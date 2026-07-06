import Link from 'next/link';
import { Sofa, Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1E1B18] text-[#ECE7DF] border-t border-[#312E2B] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Sofa className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-white block leading-none">
                  ARTE & CONFORTO
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] block font-sans">
                  Fábrica Premium
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#A8A298] leading-relaxed max-w-sm">
              Desde 1998 moldando sonhos em forma de conforto e sofisticação. Produção própria com matéria-prima certificada e design autoral sob medida.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#312E2B] flex items-center justify-center text-[#ECE7DF] hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#312E2B] flex items-center justify-center text-[#ECE7DF] hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C5A880] mb-4">
              Navegação
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-[#A8A298] hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-sm text-[#A8A298] hover:text-white transition-colors">
                  Catálogo de Móveis
                </Link>
              </li>
              <li>
                <Link href="/projetos" className="text-sm text-[#A8A298] hover:text-white transition-colors">
                  Galeria de Projetos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-sm text-[#A8A298] hover:text-white transition-colors">
                  Nossa História
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm text-[#A8A298] hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours & Operations */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C5A880] mb-4">
              Funcionamento
            </h3>
            <ul className="space-y-3 text-sm text-[#A8A298]">
              <li className="flex items-start space-x-2.5">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Segunda a Sexta</p>
                  <p className="text-xs">08:00 às 18:00</p>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Sábado</p>
                  <p className="text-xs">08:00 às 13:00</p>
                </div>
              </li>
              <li className="text-xs text-[#8C8578] pt-2">
                * Atendimento exclusivo para representantes e arquitetos com agendamento prévio.
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C5A880] mb-4">
              Fale Conosco
            </h3>
            <ul className="space-y-3 text-sm text-[#A8A298]">
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>(19) 3456-7890</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href="https://wa.me/5519987654321"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  (19) 98765-4321 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:contato@fabricaarteconforto.com.br" className="hover:text-white transition-colors">
                  contato@arteconforto.com.br
                </a>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span className="leading-relaxed">
                  Av. Design de Interiores, 1500 - Distrito Industrial, Americana - SP, 13470-000
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower row: Copyright and LGPD */}
        <div className="border-t border-[#312E2B] pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#8C8578]">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} Estofados Arte & Conforto Ltda. CNPJ 00.000.000/0001-00. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            <Link href="/politica-de-privacidade" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos-de-uso" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors border-l border-[#312E2B] pl-6">
              Painel Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
