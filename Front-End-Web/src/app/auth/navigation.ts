/**
 * Navegacao da area logada. A lista de paineis e a pagina inicial de cada
 * perfil vivem em data/panels.ts; aqui so ficam os ajustes do cabecalho.
 */
export { defaultHomeByRole as homeByRole, panelItems, panelsForRole } from "../data/panels";

/** Quantos paineis aparecem soltos no topo antes de sobrar para o menu "Mais". */
export const INLINE_PANEL_LIMIT = 4;
