/**
 * Modelo de custo total de frete (Frete Comum x Frete Escort).
 *
 * A comparação não olha só a tarifa: o custo por embarque é a soma de frete,
 * seguro, perdas esperadas por sinistro, multas por atraso e gestão. Os
 * parâmetros abaixo são a única fonte de verdade — todo valor exibido no
 * relatório é calculado a partir deles.
 */

export type ModalityId = "comum" | "escort";

export type CostComponentId =
  | "freight"
  | "adValorem"
  | "gris"
  | "losses"
  | "delays"
  | "management";

export type CostComponent = {
  id: CostComponentId;
  label: string;
  description: string;
  color: string;
};

export const costComponents: CostComponent[] = [
  {
    id: "freight",
    label: "Frete e km vazio",
    description: "Tarifa por km rodado, incluindo o percurso improdutivo rateado no embarque.",
    color: "#0f172a",
  },
  {
    id: "adValorem",
    label: "Ad valorem",
    description: "Prêmio de seguro proporcional ao valor da carga transportada.",
    color: "#0ea5e9",
  },
  {
    id: "gris",
    label: "GRIS",
    description: "Gerenciamento de risco cobrado sobre o valor da nota fiscal.",
    color: "#7c3aed",
  },
  {
    id: "losses",
    label: "Perdas por sinistro",
    description: "Perda esperada com roubo e avaria, já descontada a parcela recuperada.",
    color: "#dc2626",
  },
  {
    id: "delays",
    label: "Multas e reentregas",
    description: "Custo esperado de multa contratual por atraso e de reentrega.",
    color: "#ea580c",
  },
  {
    id: "management",
    label: "Gestão e tecnologia",
    description: "Escolta, monitoramento, torre de controle e portal de rastreamento.",
    color: "#059669",
  },
];

export type ModalityParams = {
  id: ModalityId;
  label: string;
  /** Tarifa base por km rodado, em reais. */
  ratePerKm: number;
  /** Percentual de km improdutivo rateado sobre o percurso. */
  emptyKmShare: number;
  /** Alíquota de ad valorem sobre o valor da carga. */
  adValoremRate: number;
  /** Alíquota de GRIS sobre o valor da carga. */
  grisRate: number;
  /** Probabilidade de sinistro por embarque. */
  incidentRate: number;
  /** Parcela do valor recuperada quando há sinistro. */
  incidentRecovery: number;
  /** Probabilidade de atraso com multa contratual por embarque. */
  delayRate: number;
  /** Custo médio de uma ocorrência de atraso, em reais. */
  delayPenalty: number;
  /** Custo fixo de gestão e tecnologia por embarque, em reais. */
  managementFee: number;
};

export const modalities: Record<ModalityId, ModalityParams> = {
  comum: {
    id: "comum",
    label: "Frete Comum",
    ratePerKm: 4.55,
    emptyKmShare: 0.13,
    adValoremRate: 0.0022,
    grisRate: 0.0012,
    incidentRate: 0.0035,
    incidentRecovery: 0.6,
    delayRate: 0.09,
    delayPenalty: 1500,
    managementFee: 60,
  },
  escort: {
    id: "escort",
    label: "Frete Escort",
    ratePerKm: 4.78,
    emptyKmShare: 0.07,
    adValoremRate: 0.0015,
    grisRate: 0.0009,
    incidentRate: 0.0015,
    incidentRecovery: 0.85,
    delayRate: 0.045,
    delayPenalty: 1500,
    managementFee: 140,
  },
};

export const modalityList: ModalityParams[] = [modalities.comum, modalities.escort];

export type Lane = {
  id: string;
  origin: string;
  destination: string;
  distanceKm: number;
  /** Valor médio da carga transportada na rota, em reais. */
  avgCargoValue: number;
  /** Participação da rota no volume total de embarques. */
  volumeShare: number;
};

export const lanes: Lane[] = [
  {
    id: "sp-cwb",
    origin: "São Paulo/SP",
    destination: "Curitiba/PR",
    distanceKm: 408,
    avgCargoValue: 320000,
    volumeShare: 0.22,
  },
  {
    id: "sp-rj",
    origin: "São Paulo/SP",
    destination: "Rio de Janeiro/RJ",
    distanceKm: 430,
    avgCargoValue: 285000,
    volumeShare: 0.18,
  },
  {
    id: "cps-bh",
    origin: "Campinas/SP",
    destination: "Belo Horizonte/MG",
    distanceKm: 590,
    avgCargoValue: 210000,
    volumeShare: 0.15,
  },
  {
    id: "cwb-poa",
    origin: "Curitiba/PR",
    destination: "Porto Alegre/RS",
    distanceKm: 711,
    avgCargoValue: 165000,
    volumeShare: 0.13,
  },
  {
    id: "sp-gyn",
    origin: "São Paulo/SP",
    destination: "Goiânia/GO",
    distanceKm: 926,
    avgCargoValue: 140000,
    volumeShare: 0.12,
  },
  {
    id: "gru-ssa",
    origin: "Guarulhos/SP",
    destination: "Salvador/BA",
    distanceKm: 1962,
    avgCargoValue: 95000,
    volumeShare: 0.11,
  },
  {
    id: "sts-rp",
    origin: "Santos/SP",
    destination: "Ribeirão Preto/SP",
    distanceKm: 400,
    avgCargoValue: 88000,
    volumeShare: 0.09,
  },
];

export type FreightMonth = {
  key: string;
  label: string;
  shipments: number;
};

/** Volume embarcado por mês, no mesmo calendário do painel ESG. */
export const freightMonths: FreightMonth[] = [
  { key: "2025-09", label: "Set/25", shipments: 1180 },
  { key: "2025-10", label: "Out/25", shipments: 1225 },
  { key: "2025-11", label: "Nov/25", shipments: 1290 },
  { key: "2025-12", label: "Dez/25", shipments: 1355 },
  { key: "2026-01", label: "Jan/26", shipments: 1130 },
  { key: "2026-02", label: "Fev/26", shipments: 1165 },
  { key: "2026-03", label: "Mar/26", shipments: 1280 },
  { key: "2026-04", label: "Abr/26", shipments: 1310 },
  { key: "2026-05", label: "Mai/26", shipments: 1345 },
  { key: "2026-06", label: "Jun/26", shipments: 1370 },
  { key: "2026-07", label: "Jul/26", shipments: 1420 },
  { key: "2026-08", label: "Ago/26", shipments: 1325 },
];

export type CostBreakdown = Record<CostComponentId, number> & { total: number };

export type ShipmentProfile = {
  distanceKm: number;
  cargoValue: number;
};

/** Custo por embarque, componente a componente, para uma modalidade. */
export function breakdownFor(profile: ShipmentProfile, modality: ModalityParams): CostBreakdown {
  const freight = modality.ratePerKm * profile.distanceKm * (1 + modality.emptyKmShare);
  const adValorem = profile.cargoValue * modality.adValoremRate;
  const gris = profile.cargoValue * modality.grisRate;
  const losses =
    profile.cargoValue * modality.incidentRate * (1 - modality.incidentRecovery);
  const delays = modality.delayRate * modality.delayPenalty;
  const management = modality.managementFee;

  return {
    freight,
    adValorem,
    gris,
    losses,
    delays,
    management,
    total: freight + adValorem + gris + losses + delays + management,
  };
}

export type LaneComparison = {
  lane: Lane;
  comum: CostBreakdown;
  escort: CostBreakdown;
  /** Economia por embarque, em reais. */
  savingsPerShipment: number;
  /** Economia sobre o custo do frete comum, de 0 a 1. */
  savingsRate: number;
  /** Custo por km rodado em cada modalidade. */
  comumCostPerKm: number;
  escortCostPerKm: number;
};

export function compareLane(lane: Lane): LaneComparison {
  const profile: ShipmentProfile = {
    distanceKm: lane.distanceKm,
    cargoValue: lane.avgCargoValue,
  };
  const comum = breakdownFor(profile, modalities.comum);
  const escort = breakdownFor(profile, modalities.escort);
  const savingsPerShipment = comum.total - escort.total;

  return {
    lane,
    comum,
    escort,
    savingsPerShipment,
    savingsRate: comum.total ? savingsPerShipment / comum.total : 0,
    comumCostPerKm: comum.total / lane.distanceKm,
    escortCostPerKm: escort.total / lane.distanceKm,
  };
}

export const laneComparisons: LaneComparison[] = lanes.map(compareLane);

/** Embarques de uma rota em um mês, rateados pela participação no volume. */
export function shipmentsOnLane(month: FreightMonth, lane: Lane) {
  return Math.round(month.shipments * lane.volumeShare);
}

export type MonthlyResult = FreightMonth & {
  /** Soma dos embarques após o rateio por rota, base de todos os custos do mês. */
  allocatedShipments: number;
  comumCost: number;
  escortCost: number;
  savings: number;
  cumulativeSavings: number;
};

/** Custo mensal das duas modalidades para o mix de rotas informado. */
export function buildMonthlyResults(months: FreightMonth[]): MonthlyResult[] {
  let cumulative = 0;

  return months.map((month) => {
    const totals = laneComparisons.reduce(
      (acc, comparison) => {
        const shipments = shipmentsOnLane(month, comparison.lane);
        acc.allocatedShipments += shipments;
        acc.comumCost += shipments * comparison.comum.total;
        acc.escortCost += shipments * comparison.escort.total;
        return acc;
      },
      { allocatedShipments: 0, comumCost: 0, escortCost: 0 },
    );

    const savings = totals.comumCost - totals.escortCost;
    cumulative += savings;

    return {
      ...month,
      allocatedShipments: totals.allocatedShipments,
      comumCost: totals.comumCost,
      escortCost: totals.escortCost,
      savings,
      cumulativeSavings: cumulative,
    };
  });
}

export type FinancialSummary = {
  months: number;
  shipments: number;
  comumCost: number;
  escortCost: number;
  savings: number;
  savingsRate: number;
  savingsPerShipment: number;
  comumCostPerShipment: number;
  escortCostPerShipment: number;
  /** Economia projetada para doze meses no ritmo médio do período. */
  annualizedSavings: number;
  componentSavings: Array<{
    component: CostComponent;
    comum: number;
    escort: number;
    delta: number;
  }>;
};

export function summarizeFinancial(results: MonthlyResult[]): FinancialSummary {
  const shipments = results.reduce((total, month) => total + month.allocatedShipments, 0);
  const comumCost = results.reduce((total, month) => total + month.comumCost, 0);
  const escortCost = results.reduce((total, month) => total + month.escortCost, 0);
  const savings = comumCost - escortCost;

  const componentSavings = costComponents.map((component) => {
    const totals = results.reduce(
      (acc, month) => {
        laneComparisons.forEach((comparison) => {
          const laneShipments = shipmentsOnLane(month, comparison.lane);
          acc.comum += laneShipments * comparison.comum[component.id];
          acc.escort += laneShipments * comparison.escort[component.id];
        });
        return acc;
      },
      { comum: 0, escort: 0 },
    );

    return {
      component,
      comum: totals.comum,
      escort: totals.escort,
      delta: totals.comum - totals.escort,
    };
  });

  return {
    months: results.length,
    shipments,
    comumCost,
    escortCost,
    savings,
    savingsRate: comumCost ? savings / comumCost : 0,
    savingsPerShipment: shipments ? savings / shipments : 0,
    comumCostPerShipment: shipments ? comumCost / shipments : 0,
    escortCostPerShipment: shipments ? escortCost / shipments : 0,
    annualizedSavings: results.length ? (savings / results.length) * 12 : 0,
    componentSavings,
  };
}
