import { Link, useLocation, useNavigate } from "react-router";
import { Truck, Menu, X, Phone, ChevronDown, LogOut, Moon, Settings as SettingsIcon, Sun, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth, type Role } from "../auth/AuthContext";
import { usePreferences } from "../preferences/PreferencesContext";
import { INLINE_PANEL_LIMIT, panelsForRole } from "../auth/navigation";
import { resolveHomePage, settingsPath } from "../data/panels";
import { useSettings } from "../settings/SettingsContext";

/** Navegacao de quem ainda nao entrou: o site institucional. */
const publicNavItems = [
  { path: "/", label: "Início" },
  { path: "/sobre", label: "Sobre" },
  { path: "/servicos", label: "Serviços" },
  { path: "/cobertura", label: "Cobertura" },
  { path: "/contato", label: "Contato" },
];

const publicExtraItems = [
  { path: "/tecnologia", label: "Tecnologia" },
  { path: "/clientes", label: "Clientes" },
  { path: "/faq", label: "FAQ" },
  { path: "/blog", label: "Blog" },
  { path: "/unidades", label: "Unidades" },
  { path: "/trabalhe-conosco", label: "Trabalhe Conosco" },
];

const roleLabels: Record<Role, string> = {
  admin: "Administrador",
  empresa: "Empresa",
  motorista: "Motorista",
};

/** Ate duas iniciais do nome, para o avatar. */
function initialsOf(name: string | undefined) {
  const initials = (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials || "?";
}

function Avatar({ name, size = "md" }: { name?: string; size?: "md" | "lg" }) {
  const sizeClass = size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
  return (
    <span
      aria-hidden="true"
      className={`${sizeClass} shrink-0 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center`}
    >
      {initialsOf(name)}
    </span>
  );
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { settings } = useSettings();
  const { resolvedTheme, setTheme } = usePreferences();
  const isDark = resolvedTheme === "escuro";
  const themeToggleLabel = isDark ? "Ativar modo claro" : "Ativar modo escuro";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [morePanelsOpen, setMorePanelsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const morePanelsRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  /*
   * Logado, o topo e so a area de trabalho: os paineis que o perfil abre (menos
   * os escondidos em Configuracoes), o rastreamento (que exige sessao) e o menu
   * da conta. As paginas institucionais continuam acessiveis pelo logo e pelo rodape.
   */
  const panels = user
    ? panelsForRole(user.role).filter((item) => !settings.hiddenPanels.includes(item.path))
    : [];
  const inlinePanels = panels.slice(0, INLINE_PANEL_LIMIT);
  const morePanels = panels.slice(INLINE_PANEL_LIMIT);
  const homePath = user ? resolveHomePage(user.role, settings.homePage) : "/";

  useEffect(() => {
    setMorePanelsOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!morePanelsOpen && !userMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!morePanelsRef.current?.contains(target)) setMorePanelsOpen(false);
      if (!userMenuRef.current?.contains(target)) setUserMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMorePanelsOpen(false);
      setUserMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [morePanelsOpen, userMenuOpen]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const linkClass = (path: string) =>
    `font-semibold text-xs xl:text-sm 2xl:text-base transition-colors whitespace-nowrap ${
      isActive(path) ? "text-orange-600" : "text-gray-700 hover:text-orange-600"
    }`;

  const menuItemClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${
      isActive(path)
        ? "text-orange-600 bg-orange-50"
        : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
    }`;

  /** Troca entre claro e escuro; a opcao "Do sistema" fica em Configuracoes. */
  const themeToggle = (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "claro" : "escuro")}
      aria-label={themeToggleLabel}
      title={themeToggleLabel}
      className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-gray-700 hover:text-orange-600 hover:bg-gray-100 transition-colors"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  }

  const mobileItems = isAuthenticated
    ? [{ path: "/rastreamento", label: "Rastreamento" }, ...panels]
    : [...publicNavItems, ...publicExtraItems];

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
          {/*
            Tres colunas: as laterais dividem o espaco igualmente, entao os links
            ficam no centro real do cabecalho, nao no meio do que sobra.
          */}
          <div className="flex lg:grid lg:grid-cols-[1fr_auto_1fr] items-center h-20 gap-4 xl:gap-8">
            {/* Logo: logado leva a area de trabalho, visitante leva a home institucional. */}
            <Link to={homePath} className="flex items-center gap-3 shrink-0 justify-self-start">
              <div className="bg-orange-600 p-2.5 rounded-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-gray-900">ESCORT<span className="text-orange-600">in</span>Road</span>
                <span className="text-xs text-orange-600 font-semibold tracking-wide">TRANSPORTE E LOGÍSTICA</span>
              </div>
            </Link>

            {/* Desktop: links centralizados */}
            <nav className="hidden lg:flex items-center justify-center gap-4 xl:gap-5 2xl:gap-7">
              {isAuthenticated ? (
                <>
                  <Link to="/rastreamento" className={linkClass("/rastreamento")}>
                    Rastreamento
                  </Link>

                  {inlinePanels.map((item) => (
                    <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                      {item.label}
                    </Link>
                  ))}

                  {morePanels.length > 0 && (
                    <div className="relative" ref={morePanelsRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setMorePanelsOpen((open) => !open);
                          setUserMenuOpen(false);
                        }}
                        aria-expanded={morePanelsOpen}
                        aria-haspopup="true"
                        className={`flex items-center gap-1 ${
                          morePanels.some((item) => isActive(item.path))
                            ? "text-orange-600"
                            : "text-gray-700 hover:text-orange-600"
                        } font-semibold text-xs xl:text-sm 2xl:text-base transition-colors`}
                      >
                        Mais
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${morePanelsOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {morePanelsOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-60 rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                          {morePanels.map((item) => (
                            <Link key={item.path} to={item.path} className={menuItemClass(item.path)}>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                publicNavItems.map((item) => (
                  <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                    {item.label}
                  </Link>
                ))
              )}
            </nav>

            {/* Lado direito: tema e conta */}
            <div className="ml-auto lg:ml-0 justify-self-end flex items-center gap-2 xl:gap-3">
              {themeToggle}

              {isAuthenticated ? (
                <div className="relative hidden lg:block" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen((open) => !open);
                      setMorePanelsOpen(false);
                    }}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    aria-label="Menu da conta"
                    className={`flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors ${
                      userMenuOpen ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                  >
                    <Avatar name={user?.name} />
                    <span className="hidden xl:flex flex-col items-start leading-tight text-left">
                      <span className="max-w-[10rem] truncate text-sm font-bold text-gray-900">{user?.name}</span>
                      <span className="text-xs text-gray-500">{user ? roleLabels[user.role] : ""}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-gray-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-72 rounded-xl border border-gray-100 bg-white shadow-xl overflow-hidden">
                      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                        <Avatar name={user?.name} size="lg" />
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 truncate">{user?.name}</div>
                          <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                          <span className="inline-block mt-1 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700">
                            {user ? roleLabels[user.role] : ""}
                          </span>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link to="/perfil" className={menuItemClass("/perfil")}>
                          <UserCircle className="w-4 h-4" />
                          Meu perfil
                        </Link>
                        <Link to={settingsPath} className={menuItemClass(settingsPath)}>
                          <SettingsIcon className="w-4 h-4" />
                          Configurações
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3 xl:gap-4">
                  <Link to="/login" className={linkClass("/login")}>
                    Entrar
                  </Link>
                  <Link
                    to="/cotacao"
                    className="bg-orange-600 text-white px-3 xl:px-4 2xl:px-6 py-2.5 rounded-lg font-semibold text-xs xl:text-sm 2xl:text-base hover:bg-orange-700 transition-colors whitespace-nowrap"
                  >
                    Solicitar Cotação
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-900" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-900" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden py-4 border-t">
              {isAuthenticated && (
                <div className="flex items-center gap-3 px-4 pb-4 mb-2 border-b border-gray-100">
                  <Avatar name={user?.name} size="lg" />
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">{user?.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.email} · {user ? roleLabels[user.role] : ""}
                    </div>
                  </div>
                </div>
              )}

              {mobileItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
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
                  <>
                    <Link to="/perfil" className={`${menuItemClass("/perfil")} py-3`}>
                      <UserCircle className="w-4 h-4" />
                      Meu perfil
                    </Link>
                    <Link to={settingsPath} className={`${menuItemClass(settingsPath)} py-3`}>
                      <SettingsIcon className="w-4 h-4" />
                      Configurações
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 py-3 px-4 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-3 px-4 font-semibold text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors"
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/cotacao"
                      className="block mx-4 mt-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-center"
                    >
                      Solicitar Cotação
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
