import { Link, useLocation, useNavigate } from "react-router";
import { Truck, Menu, X, Phone, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth, type Role } from "../auth/AuthContext";

/**
 * Quem pode ver (e acessar) cada painel interno.
 * Mantenha isto em sincronia com os `roles` das rotas em routes.tsx:
 * um item que aparece aqui para um perfil sem permissão na rota leva a
 * pessoa a clicar num link que só a devolve para "/".
 */
const panelItemsByRole: { path: string; label: string; roles: Role[] }[] = [
  { path: "/cadastro-cargas", label: "Cadastro de cargas", roles: ["admin", "empresa"] },
  { path: "/gestao-lotes", label: "Gestão de lotes", roles: ["admin", "empresa"] },
  { path: "/mapa-operacional", label: "Mapa operacional", roles: ["admin", "empresa", "motorista"] },
  { path: "/painel-esg", label: "Painel ESG", roles: ["admin", "empresa"] },
  { path: "/economia-frete", label: "Economia de frete", roles: ["admin", "empresa"] },
  { path: "/performance", label: "Performance", roles: ["admin", "empresa"] },
  { path: "/admin-documentos", label: "Documentos", roles: ["admin"] },
  { path: "/admin-usuarios", label: "Usuários", roles: ["admin"] },
  { path: "/planos", label: "Planos e faturas", roles: ["empresa"] },
  { path: "/chaves-api", label: "Chaves de API", roles: ["empresa"] },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
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

  /** Só os painéis que o perfil logado pode realmente abrir. */
  const panelItems = user ? panelItemsByRole.filter((item) => item.roles.includes(user.role)) : [];

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

  function handleLogout() {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  }

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

              {panelItems.length > 0 && (
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
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-3 pl-1">
                  <span className="hidden xl:flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                    <UserCircle className="w-4 h-4" />
                    {user?.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 font-semibold text-xs xl:text-sm text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`font-semibold text-xs xl:text-sm 2xl:text-base transition-colors ${
                    isActive("/login") ? "text-orange-600" : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  Entrar
                </Link>
              )}

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
              <div className="border-t mt-2 pt-2">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 py-3 px-4 font-semibold text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair ({user?.name})
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 font-semibold text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors"
                  >
                    Entrar
                  </Link>
                )}
              </div>

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
