/**
 * Cliente para API de Roteirização
 * Fornece tipos TypeScript e métodos para calcular rotas e distâncias
 */

export interface PontoRota {
  id: string;
  latitude: number;
  longitude: number;
  nome: string;
}

export interface DistanciaResponse {
  distanciaKm: number;
  tempoMinutos: number;
  latitudeOrigem: number;
  longitudeOrigem: number;
  latitudeDestino: number;
  longitudeDestino: number;
}

export interface SegmentoRota {
  deId: string;
  paraId: string;
  distanciaKm: number;
  tempoMinutos: number;
}

export interface RotaOtimizadaResponse {
  pontos: PontoRota[];
  distanciaTotal: number;
  segmentos: SegmentoRota[];
}

export interface EstimativaTempoResponse {
  distanciaKm: number;
  tempoMinutos: number;
  tempoComOverheadMinutos: number;
}

export interface ViabilidadeRotaResponse {
  viavel: boolean;
  distanciaKm: number;
  tempoMinutos: number;
  distanciaMaximaPermitida: number;
  tempoMaximoPermitido: number;
  mensagem: string;
}

export interface ValidacaoRotaParams {
  distanciaMaximaKm: number;
  tempoMaximoMinutos: number;
  maximoPontos: number;
  velocidadeMedia: number;
}

export class RoutingClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8081') {
    this.baseUrl = baseUrl;
  }

  /**
   * Calcula distância entre dois pontos usando Haversine
   */
  async calcularDistancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): Promise<DistanciaResponse> {
    const url = `${this.baseUrl}/api/roteirizacao/distancia?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
    return response.json();
  }

  /**
   * Estima tempo de viagem entre dois pontos
   */
  async estimarTempo(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): Promise<EstimativaTempoResponse> {
    const url = `${this.baseUrl}/api/roteirizacao/tempo?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
    return response.json();
  }

  /**
   * Calcula rota otimizada entre múltiplos pontos
   */
  async calcularRotaOtimizada(pontos: PontoRota[]): Promise<RotaOtimizadaResponse> {
    const url = `${this.baseUrl}/api/roteirizacao/otimizar`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pontos),
    });
    if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
    return response.json();
  }

  /**
   * Valida viabilidade de uma rota
   */
  async validarRota(
    rota: RotaOtimizadaResponse,
    params: ValidacaoRotaParams
  ): Promise<ViabilidadeRotaResponse> {
    const url = `${this.baseUrl}/api/roteirizacao/validar`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rota, params }),
    });
    if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
    return response.json();
  }

  /**
   * Formata tempo em minutos para "Xh Ym"
   */
  static formatarTempo(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return horas > 0 ? `${horas}h ${mins}m` : `${mins}m`;
  }

  /**
   * Formata distância com 1 casa decimal
   */
  static formatarDistancia(km: number): string {
    return `${km.toFixed(1)} km`;
  }
}

// Cliente padrão para uso em componentes
export const routingClient = new RoutingClient();
