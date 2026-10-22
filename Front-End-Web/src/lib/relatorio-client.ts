/**
 * Cliente para API de Relatórios
 * Fornece tipos TypeScript e métodos para acessar relatórios
 */

// =====================================================
// INTERFACES COMUNS
// =====================================================

export interface PeriodoDTO {
  inicio: string;
  fim: string;
}

// =====================================================
// RELATÓRIOS DO MOTORISTA
// =====================================================

export interface ResumoReceitaDTO {
  recebidoTotal: number;
  emEscrow: number;
  disponivel: number;
  comissaoGeral: number;
  receitaLiquida: number;
}

export interface DetalheReceitaDiaDTO {
  data: string;
  fretesEntregues: number;
  receita: number;
  comissao: number;
  escrow: number;
}

export interface RelatorioMotoristaDTO {
  periodo: PeriodoDTO;
  resumo: ResumoReceitaDTO;
  detalhes: DetalheReceitaDiaDTO[];
}

export interface MetricasDesempenhoDTO {
  taxaAceitacao: number;
  avaliacaoMedia: number;
  reclamacoes: number;
  fretesEntregues: number;
  fretesRecusados: number;
}

export interface DesempenhoMotoristaDTO {
  periodoMeses: number;
  metricas: MetricasDesempenhoDTO;
  tendencia: any[];
}

export interface RotaFrequenteDTO {
  origem: string;
  destino: string;
  frequencia: number;
  distanciaMedia: number;
  tempoMedio: number;
  receita: number;
}

export interface RotasFrequentesDTO {
  rotas: RotaFrequenteDTO[];
}

export interface MetricasComparativoDTO {
  receita: number;
  receitaMediaMercado: number;
  avaliacao: number;
  avaliacaoMedia: number;
  fretesEntregues: number;
  fretesMediaMercado: number;
}

export interface ComparativoMotoristaDTO {
  motorista: string;
  metricas: MetricasComparativoDTO;
  posicao: string;
}

// =====================================================
// RELATÓRIOS DO EMBARCADOR
// =====================================================

export interface ResumoCustosDTO {
  custoTotal: number;
  mediaFreteKm: number;
  custoPorKm: number;
  fretesPostados: number;
  fretesEntregues: number;
  fretesConcelados: number;
  taxaSucesso: number;
}

export interface DetalheCustoDiaDTO {
  data: string;
  fretesPostados: number;
  custoTotal: number;
  mediaKm: number;
}

export interface RelatorioCustosDTO {
  periodo: PeriodoDTO;
  resumo: ResumoCustosDTO;
  detalhes: DetalheCustoDiaDTO[];
}

export interface FreteDetalheDTO {
  id: number;
  origem: string;
  destino: string;
  peso: number;
  custo: number;
  motorista: string;
  avaliacao: number;
  dataEntrega: string;
  status: string;
}

// =====================================================
// RELATÓRIOS ADMINISTRATIVOS
// =====================================================

export interface KPIsAdminDTO {
  usuariosAtivos: number;
  usuariosNovos: number;
  fretesProcessados: number;
  volumeFinanceiro: number;
  takeRateColetado: number;
  taxaSucesso: number;
  avaliacaoMedia: number;
}

export interface CrescimentoDTO {
  usuarios: string;
  fretes: string;
  receita: string;
}

export interface DashboardAdminDTO {
  dataGeracao: string;
  periodo: string;
  kpis: KPIsAdminDTO;
  crescimento: CrescimentoDTO;
}

export interface ResumoTakeRateDTO {
  volumeBruto: number;
  percentual: number;
  takeRateColetado: number;
  taxaProcessamento: number;
  taxasGateway: number;
  lucroBruto: number;
}

export interface DetalheTakeRateDiaDTO {
  data: string;
  volume: number;
  takeRate: number;
  taxa: number;
}

export interface RelatoriTakeRateDTO {
  periodo: PeriodoDTO;
  resumo: ResumoTakeRateDTO;
  porDia: DetalheTakeRateDiaDTO[];
}

// =====================================================
// CLIENTE API
// =====================================================

export class RelatorioClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8081') {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    };
  }

  // =====================================================
  // RELATÓRIOS DO MOTORISTA
  // =====================================================

  /**
   * Gera relatório de receita para o motorista
   */
  async relatorioReceita(
    inicio: string,
    fim: string
  ): Promise<RelatorioMotoristaDTO> {
    const url = `${this.baseUrl}/api/relatorios/motorista/receita?inicio=${inicio}&fim=${fim}`;
    const response = await fetch(url, { headers: this.getHeaders() });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return response.json();
  }

  /**
   * Gera relatório de desempenho do motorista
   */
  async desempenhoMotorista(): Promise<DesempenhoMotoristaDTO> {
    const url = `${this.baseUrl}/api/relatorios/motorista/desempenho`;
    const response = await fetch(url, { headers: this.getHeaders() });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return response.json();
  }

  /**
   * Retorna rotas mais frequentes do motorista
   */
  async rotasFrequentes(): Promise<RotasFrequentesDTO> {
    const url = `${this.baseUrl}/api/relatorios/motorista/rotas-frequentes`;
    const response = await fetch(url, { headers: this.getHeaders() });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return response.json();
  }

  /**
   * Comparação com pares (outros motoristas)
   */
  async comparativoMotorista(): Promise<ComparativoMotoristaDTO> {
    const url = `${this.baseUrl}/api/relatorios/motorista/comparativo`;
    const response = await fetch(url, { headers: this.getHeaders() });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return response.json();
  }

  /**
   * Exporta relatório de receita
   */
  exportarRelatorioReceita(inicio: string, fim: string, formato: 'pdf' | 'csv' | 'xlsx' = 'pdf'): void {
    const url = `${this.baseUrl}/api/relatorios/motorista/receita/export?inicio=${inicio}&fim=${fim}&formato=${formato}`;
    window.location.href = url;
  }

  // =====================================================
  // RELATÓRIOS DO EMBARCADOR
  // =====================================================

  /**
   * Gera relatório de custos do embarcador
   */
  async relatorioCustos(
    inicio: string,
    fim: string
  ): Promise<RelatorioCustosDTO> {
    const url = `${this.baseUrl}/api/relatorios/embarcador/custos?inicio=${inicio}&fim=${fim}`;
    const response = await fetch(url, { headers: this.getHeaders() });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return response.json();
  }

  /**
   * Lista fretes do embarcador com paginação
   */
  async fretesPorEmbarcador(status: string = 'ENTREGUE', pagina: number = 1): Promise<FreteDetalheDTO[]> {
    const url = `${this.baseUrl}/api/relatorios/embarcador/fretes?status=${status}&pagina=${pagina}`;
    const response = await fetch(url, { headers: this.getHeaders() });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return response.json();
  }

  /**
   * Exporta relatório de custos
   */
  exportarRelatorioCustos(inicio: string, fim: string, formato: 'pdf' | 'csv' = 'pdf'): void {
    const url = `${this.baseUrl}/api/relatorios/embarcador/custos/export?inicio=${inicio}&fim=${fim}&formato=${formato}`;
    window.location.href = url;
  }

  // =====================================================
  // RELATÓRIOS ADMINISTRATIVOS
  // =====================================================

  /**
   * Dashboard executivo para administradores
   */
  async dashboardAdmin(): Promise<DashboardAdminDTO> {
    const url = `${this.baseUrl}/api/relatorios/admin/dashboard`;
    const response = await fetch(url, { headers: this.getHeaders() });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return response.json();
  }

  /**
   * Relatório de take-rate
   */
  async takeRate(inicio: string, fim: string): Promise<RelatoriTakeRateDTO> {
    const url = `${this.baseUrl}/api/relatorios/admin/take-rate?inicio=${inicio}&fim=${fim}`;
    const response = await fetch(url, { headers: this.getHeaders() });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return response.json();
  }

  /**
   * Exporta dashboard
   */
  exportarDashboard(formato: 'csv' | 'xlsx' = 'xlsx'): void {
    const url = `${this.baseUrl}/api/relatorios/admin/dashboard/export?formato=${formato}`;
    window.location.href = url;
  }

  // =====================================================
  // FORMATADORES
  // =====================================================

  /**
   * Formata número como moeda brasileira
   */
  static formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  /**
   * Formata percentual com 1 casa decimal
   */
  static formatarPercentual(valor: number): string {
    return `${valor.toFixed(1)}%`;
  }

  /**
   * Formata data para padrão brasileiro
   */
  static formatarData(data: string | Date): string {
    const d = typeof data === 'string' ? new Date(data) : data;
    return new Intl.DateTimeFormat('pt-BR').format(d);
  }

  /**
   * Formata número com 2 casas decimais
   */
  static formatarNumero(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

// Cliente padrão para uso em componentes
export const relatorioClient = new RelatorioClient();
