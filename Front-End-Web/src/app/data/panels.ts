/** Painéis internos (rotas protegidas). Usado no menu e nas configurações. */
export const panelItems = [
  { path: "/cadastro-cargas", label: "Cadastro de cargas" },
  { path: "/gestao-lotes", label: "Gestão de lotes" },
  { path: "/mapa-operacional", label: "Mapa operacional" },
  { path: "/painel-esg", label: "Painel ESG" },
  { path: "/economia-frete", label: "Economia de frete" },
  { path: "/performance", label: "Performance" },
  { path: "/admin-documentos", label: "Documentos" },
  { path: "/admin-usuarios", label: "Usuários" },
] as const;

export type PanelPath = (typeof panelItems)[number]["path"];

export const settingsPath = "/configuracoes";
