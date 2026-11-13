import type { Role } from "../auth/AuthContext";

/**
 * Painéis internos e quem pode ver (e acessar) cada um.
 * Usado no menu e nas configurações. Mantenha isto em sincronia com os
 * `roles` das rotas em routes.tsx: um item que aparece aqui para um perfil
 * sem permissão na rota leva a pessoa a um link que só a devolve para "/".
 */
export const panelItems = [
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
] as const satisfies readonly { path: string; label: string; roles: readonly Role[] }[];

export type PanelItem = (typeof panelItems)[number];
export type PanelPath = PanelItem["path"];

export const settingsPath = "/configuracoes";

/** Página aberta após o login quando o usuário não escolheu outra nas configurações. */
export const defaultHomeByRole: Record<Role, PanelPath> = {
  admin: "/admin-usuarios",
  empresa: "/cadastro-cargas",
  motorista: "/mapa-operacional",
};

export function panelsForRole(role: Role): PanelItem[] {
  return panelItems.filter((item) => (item.roles as readonly Role[]).includes(role));
}

export function canAccessPanel(role: Role, path: string) {
  return panelsForRole(role).some((item) => item.path === path);
}

/** Página inicial do perfil: a escolhida nas configurações, se o perfil puder abri-la; senão, o padrão. */
export function resolveHomePage(role: Role, preferred: PanelPath | null) {
  return preferred && canAccessPanel(role, preferred) ? preferred : defaultHomeByRole[role];
}
