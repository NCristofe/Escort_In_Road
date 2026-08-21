import { Link, useLocation } from "react-router";
import { Truck, Menu, X, Phone, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [panelsOpen, setPanelsOpen] = useState(false);
  const panelsRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { path: "/", label: "Início" },
    { path: "/sobre", label: "Sobre" },
    { path: "/servicos", label: "Serviços" },
    { path: "/cobertura", label: "Cobertura" },
    { path: "/rastreamento", label: "Rastreamento" },
    { path: "/contato", label: "Contato" },
  ];

  /** Painéis internos: agrupados para o menu não estourar a largura do header. */
  const panelItems = [
    { path: "/cadastro-cargas", label: "Cadastro de cargas" },
    { path: "/gestao-lotes", label: "Gestão de lotes" },
    { path: "/mapa-operacional", label: "Mapa operacional" },
    { path: "/painel-esg", label: "Painel ESG" },
    { path: "/economia-frete", label: "Economia de frete" },
    { path: "/performance", label: "Performance" },
    { path: "/admin-documentos", label: "Documentos" },
    { path: "/admin-usuarios", label: "Usuários" },
  ];

  const mobileNavItems = [
    ...navItems,
    ...panelItems,
    { path: "/tecnologia", label: "Tecnologia" },
    { path: "/clientes", label: "Clientes" },
    { path: "/faq", label: "FAQ" },
    { path: "/blog", label: "Blog" },
    { path: "/unidades", label: "Unidades" },
    { path: "/trabalhe-conosco", label: "Trabalhe Conosco" },
  ];

  useEffect(() => {
    setPanelsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!panelsOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!panelsRef.current?.contains(event.target as Node)) setPanelsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanelsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [panelsOpen]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-orange-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:08007771234" className="flex items-center gap-2 hover:text-orange-100">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">0800 777 1234</span>
              </a>
            </div>
            <div className="text-xs sm:text-sm">
              Atendimento 24h • 7 dias por semana
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-[2000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-orange-600 p-2.5 rounded-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-gray-900">ESCORT<span className="text-orange-600">in</span>Road</span>
                <span className="text-xs text-orange-600 font-semibold tracking-wide">TRANSPORTE E LOGÍSTICA</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3 2xl:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-semibold text-xs xl:text-sm 2xl:text-base transition-colors ${
                    isActive(item.path)
                      ? "text-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="relative" ref={panelsRef}>
                <button
                  type="button"
                  onClick={() => setPanelsOpen((open) => !open)}
                  aria-expanded={panelsOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1 font-semibold text-xs xl:text-sm 2xl:text-base transition-colors ${
                    panelItems.some((item) => isActive(item.path))
                      ? "text-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  Painéis
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${panelsOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {panelsOpen && (
                  <div className="absolute right-0 mt-3 w-60 rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                    {panelItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setPanelsOpen(false)}
                        className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${
                          isActive(item.path)
                            ? "text-orange-600 bg-orange-50"
                            : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/cotacao"
                className="bg-orange-600 text-white px-3 xl:px-4 2xl:px-6 py-2.5 rounded-lg font-semibold text-xs xl:text-sm 2xl:text-base hover:bg-orange-700 transition-colors"
              >
                Solicitar Cotação
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden py-4 border-t">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 font-semibold transition-colors ${
                    isActive(item.path)
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/cotacao"
                onClick={() => setMobileMenuOpen(false)}
                className="block mx-4 mt-4 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-center"
              >
                Solicitar Cotação
              </Link>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
