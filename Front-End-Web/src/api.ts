/**
 * Cliente HTTP da API da ESCORTinRoad.
 *
 * As telas em src/features/ foram escritas contra uma instancia do axios
 * (`response.data` no sucesso, `error.response.data.message` no erro), mas o
 * projeto nao tem axios entre as dependencias. Este modulo entrega a mesma
 * superficie sobre `fetch`, para nao somar um pacote por causa de meia duzia
 * de chamadas.
 *
 * A base vem de VITE_API_URL e cai em localhost:8081, a mesma porta que
 * src/lib/routing-client.ts assume.
 */

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

export type ApiResponse<T> = {
  data: T;
  status: number;
};

/** Erro de resposta no formato que as telas leem: `error.response?.data?.message`. */
export class ApiError extends Error {
  readonly response: { status: number; data: any };

  constructor(status: number, data: any, message: string) {
    super(message);
    this.name = "ApiError";
    this.response = { status, data };
  }
}

/**
 * O tipo de `data` e `any` por padrao de proposito: as telas atribuem o
 * resultado direto a estados ja tipados (`useState([])`, por exemplo), e um
 * `unknown` aqui obrigaria a mexer em cada chamada. Quem quiser garantia de
 * tipo passa o parametro: `api.get<Fatura[]>("/api/faturas/usuario/1")`.
 */
async function request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<ApiResponse<T>> {
  const hasBody = body !== undefined;

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  // 204 e respostas vazias nao tem JSON; erro de servidor costuma vir em HTML.
  const text = await response.text();
  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : (null as T);
  } catch {
    data = text as unknown as T;
  }

  if (!response.ok) {
    const message =
      (data as { message?: string } | null)?.message ?? `${response.status} ${response.statusText}`;
    throw new ApiError(response.status, data, message);
  }

  return { data, status: response.status };
}

export const api = {
  get: <T = any>(path: string) => request<T>("GET", path),
  post: <T = any>(path: string, body?: unknown) => request<T>("POST", path, body),
};
