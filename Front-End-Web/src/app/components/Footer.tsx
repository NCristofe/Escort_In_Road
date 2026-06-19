import { Link } from "react-router";
import { Truck, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-600 p-2.5 rounded-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white">ESCORT<span className="text-orange-400">in</span>Road</span>
                <span className="text-xs text-orange-400 font-semibold tracking-wide">TRANSPORTE E LOGÍSTICA</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Referência em soluções logísticas com excelência em transporte rodoviário de cargas.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-orange-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-orange-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-orange-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-orange-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-orange-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-sm hover:text-orange-400 transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-sm hover:text-orange-400 transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/cobertura" className="text-sm hover:text-orange-400 transition-colors">
                  Cobertura
                </Link>
              </li>
              <li>
                <Link to="/rastreamento" className="text-sm hover:text-orange-400 transition-colors">
                  Rastreamento
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-sm hover:text-orange-400 transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/cotacao" className="text-sm hover:text-orange-400 transition-colors">
                  Cotação
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-4">Serviços</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/servicos/carga-fracionada" className="hover:text-orange-400 transition-colors">Carga Fracionada</Link></li>
              <li><Link to="/servicos/carga-completa" className="hover:text-orange-400 transition-colors">Carga Completa</Link></li>
              <li><Link to="/servicos/armazenagem" className="hover:text-orange-400 transition-colors">Armazenagem</Link></li>
              <li><Link to="/servicos/entregas-expressas" className="hover:text-orange-400 transition-colors">Entregas Expressas</Link></li>
              <li><Link to="/servicos/cargas-especiais" className="hover:text-orange-400 transition-colors">Cargas Especiais</Link></li>
              <li><Link to="/servicos/consultoria-logistica" className="hover:text-orange-400 transition-colors">Consultoria Logística</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-orange-400" />
                <div>
                  <div className="text-sm font-semibold text-white">0800 777 1234</div>
                  <div className="text-xs text-gray-400">Atendimento 24h</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-orange-400" />
                <span className="text-sm">contato@escortinroad.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-orange-400" />
                <span className="text-sm">Av. Logística, 1000<br />São Paulo - SP, 01234-567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2026 ESCORTinRoad Transporte e Logística. Todos os direitos reservados.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/faq" className="hover:text-orange-400 transition-colors">FAQ</Link>
              <Link to="/trabalhe-conosco" className="hover:text-orange-400 transition-colors">Trabalhe Conosco</Link>
              <Link to="/politica-de-privacidade" className="hover:text-orange-400 transition-colors">Política de Privacidade</Link>
              <Link to="/termos-de-uso" className="hover:text-orange-400 transition-colors">Termos de Uso</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
