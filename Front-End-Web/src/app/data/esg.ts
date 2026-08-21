/**
 * Base de dados do painel ESG.
 *
 * A fonte de verdade é a economia de diesel por iniciativa (em litros). Todo o
 * resto — economia total, consumo realizado, eficiência e CO2 evitado — é
 * derivado dela, para que os números do painel nunca se contradigam.
 */

/** Eficiência da frota na linha de base (2024), em km por litro. */
export const BASELINE_KM_PER_LITER = 2.4;

/** Fator de emissão do diesel S10 (kg de CO2e por litro queimado). */
export const DIESEL_EMISSION_FACTOR_KG_PER_LITER = 2.68;

/** CO2 absorvido por uma árvore adulta em um ano, em kg. */
export const TREE_ABSORPTION_KG_PER_YEAR = 22;

/** Emissão média anual de um carro de passeio no Brasil, em toneladas de CO2. */
export const CAR_EMISSION_TONS_PER_YEAR = 1.9;

export type InitiativeId =
  | "routing"
  | "consolidation"
  | "emptyKm"
  | "fleet"
  | "ecoDriving";

export type Initiative = {
  id: InitiativeId;
  label: string;
  description: string;
  color: string;
};

export const initiatives: Initiative[] = [
  {
    id: "routing",
    label: "Roteirização inteligente",
    description: "Rotas otimizadas por janela de entrega, restrição de tráfego e perfil de carga.",
    color: "#059669",
  },
  {
    id: "consolidation",
    label: "Consolidação de cargas",
    description: "Agrupamento de embarques compatíveis para elevar a taxa de ocupação do veículo.",
    color: "#0ea5e9",
  },
  {
    id: "emptyKm",
    label: "Redução de km vazio",
    description: "Cruzamento de trucks vazios com cargas pendentes no mapa operacional.",
    color: "#ea580c",
  },
  {
    id: "fleet",
    label: "Renovação de frota",
    description: "Substituição gradual por veículos Euro 6, com menor consumo por km rodado.",
    color: "#7c3aed",
  },
  {
    id: "ecoDriving",
    label: "Ecodriving",
    description: "Treinamento de motoristas e telemetria de condução para reduzir consumo.",
    color: "#f59e0b",
  },
];

const initiativeIds: InitiativeId[] = initiatives.map((initiative) => initiative.id);

export type EsgMonthInput = {
  key: string;
  label: string;
  kmTraveled: number;
  savingsByInitiative: Record<InitiativeId, number>;
};

const monthlyInput: EsgMonthInput[] = [
  {
    key: "2025-09",
    label: "Set/25",
    kmTraveled: 812400,
    savingsByInitiative: {
      routing: 5290,
      consolidation: 4050,
      emptyKm: 2800,
      fleet: 2020,
      ecoDriving: 1410,
    },
  },
  {
    key: "2025-10",
    label: "Out/25",
    kmTraveled: 845900,
    savingsByInitiative: {
      routing: 5730,
      consolidation: 4380,
      emptyKm: 3030,
      fleet: 2190,
      ecoDriving: 1520,
    },
  },
  {
    key: "2025-11",
    label: "Nov/25",
    kmTraveled: 889300,
    savingsByInitiative: {
      routing: 6250,
      consolidation: 4780,
      emptyKm: 3310,
      fleet: 2390,
      ecoDriving: 1650,
    },
  },
  {
    key: "2025-12",
    label: "Dez/25",
    kmTraveled: 935700,
    savingsByInitiative: {
      routing: 6810,
      consolidation: 5210,
      emptyKm: 3610,
      fleet: 2610,
      ecoDriving: 1800,
    },
  },
  {
    key: "2026-01",
    label: "Jan/26",
    kmTraveled: 781200,
    savingsByInitiative: {
      routing: 5890,
      consolidation: 4500,
      emptyKm: 3120,
      fleet: 2250,
      ecoDriving: 1560,
    },
  },
  {
    key: "2026-02",
    label: "Fev/26",
    kmTraveled: 806500,
    savingsByInitiative: {
      routing: 6280,
      consolidation: 4800,
      emptyKm: 3330,
      fleet: 2400,
      ecoDriving: 1670,
    },
  },
  {
    key: "2026-03",
    label: "Mar/26",
    kmTraveled: 884100,
    savingsByInitiative: {
      routing: 7110,
      consolidation: 5440,
      emptyKm: 3770,
      fleet: 2720,
      ecoDriving: 1880,
    },
  },
  {
    key: "2026-04",
    label: "Abr/26",
    kmTraveled: 901800,
    savingsByInitiative: {
      routing: 7490,
      consolidation: 5730,
      emptyKm: 3960,
      fleet: 2860,
      ecoDriving: 1980,
    },
  },
  {
    key: "2026-05",
    label: "Mai/26",
    kmTraveled: 928400,
    savingsByInitiative: {
      routing: 7940,
      consolidation: 6070,
      emptyKm: 4200,
      fleet: 3040,
      ecoDriving: 2110,
    },
  },
  {
    key: "2026-06",
    label: "Jun/26",
    kmTraveled: 947600,
    savingsByInitiative: {
      routing: 8350,
      consolidation: 6390,
      emptyKm: 4420,
      fleet: 3190,
      ecoDriving: 2210,
    },
  },
  {
    key: "2026-07",
    label: "Jul/26",
    kmTraveled: 982300,
    savingsByInitiative: {
      routing: 8900,
      consolidation: 6810,
      emptyKm: 4710,
      fleet: 3400,
      ecoDriving: 2370,
    },
  },
  {
    key: "2026-08",
    label: "Ago/26",
    kmTraveled: 915800,
    savingsByInitiative: {
      routing: 8540,
      consolidation: 6530,
      emptyKm: 4520,
      fleet: 3260,
      ecoDriving: 2260,
    },
  },
];

export type EsgMonth = EsgMonthInput & {
  /** Consumo que a frota teria mantendo a eficiência da linha de base. */
  dieselBaselineLiters: number;
  /** Consumo realizado no mês. */
  dieselConsumedLiters: number;
  dieselSavedLiters: number;
  co2AvoidedTons: number;
  /** Eficiência realizada no mês, em km/l. */
  kmPerLiter: number;
  /** Acumulado do período, na ordem cronológica da série. */
  cumulativeDieselSavedLiters: number;
  cumulativeCo2AvoidedTons: number;
};

export function litersToCo2Tons(liters: number) {
  return (liters * DIESEL_EMISSION_FACTOR_KG_PER_LITER) / 1000;
}

function buildSeries(input: EsgMonthInput[]): EsgMonth[] {
  let cumulativeLiters = 0;

  return input.map((month) => {
    const dieselSavedLiters = initiativeIds.reduce(
      (total, id) => total + month.savingsByInitiative[id],
      0,
    );
    const dieselBaselineLiters = month.kmTraveled / BASELINE_KM_PER_LITER;
    const dieselConsumedLiters = dieselBaselineLiters - dieselSavedLiters;
    cumulativeLiters += dieselSavedLiters;

    return {
      ...month,
      dieselBaselineLiters: Math.round(dieselBaselineLiters),
      dieselConsumedLiters: Math.round(dieselConsumedLiters),
      dieselSavedLiters,
      co2AvoidedTons: Number(litersToCo2Tons(dieselSavedLiters).toFixed(1)),
      kmPerLiter: Number((month.kmTraveled / dieselConsumedLiters).toFixed(2)),
      cumulativeDieselSavedLiters: cumulativeLiters,
      cumulativeCo2AvoidedTons: Number(litersToCo2Tons(cumulativeLiters).toFixed(1)),
    };
  });
}

/** Série mensal completa (12 meses), do mês mais antigo para o mais recente. */
export const esgSeries: EsgMonth[] = buildSeries(monthlyInput);

/** Metas pactuadas para o ciclo de 12 meses. */
export const esgTargets = {
  annualDieselLiters: 240000,
  monthlyDieselLiters: 20000,
  annualCo2Tons: Number(litersToCo2Tons(240000).toFixed(1)),
};

export type ClientCompany = {
  id: string;
  name: string;
  segment: string;
  document: string;
  /** Início do contrato, para constar no cabeçalho do relatório. */
  since: string;
  /** Participação da empresa no volume total transportado, de 0 a 1. */
  operationShare: number;
};

/**
 * Empresas atendidas que recebem relatório de impacto. As participações somam
 * menos de 1: o restante corresponde à carteira de clientes menores.
 */
export const clientCompanies: ClientCompany[] = [
  {
    id: "nexus",
    name: "Grupo Nexus",
    segment: "Bens de consumo",
    document: "12.345.678/0001-90",
    since: "Março de 2023",
    operationShare: 0.22,
  },
  {
    id: "vitalis",
    name: "Vitalis Farma",
    segment: "Farmacêutico",
    document: "23.456.789/0001-01",
    since: "Agosto de 2023",
    operationShare: 0.17,
  },
  {
    id: "campo-bom",
    name: "Alimentos Campo Bom",
    segment: "Indústria alimentícia",
    document: "34.567.890/0001-12",
    since: "Janeiro de 2024",
    operationShare: 0.14,
  },
  {
    id: "motriz",
    name: "Motriz Autopeças",
    segment: "Autopeças",
    document: "45.678.901/0001-23",
    since: "Maio de 2024",
    operationShare: 0.11,
  },
  {
    id: "loja-viva",
    name: "Loja Viva Marketplace",
    segment: "Marketplace",
    document: "56.789.012/0001-34",
    since: "Outubro de 2024",
    operationShare: 0.09,
  },
  {
    id: "atacado-sul",
    name: "Atacado Sul Distribuição",
    segment: "Atacado",
    document: "67.890.123/0001-45",
    since: "Fevereiro de 2025",
    operationShare: 0.07,
  },
];

/**
 * Recorta a série para a fatia de operação de uma empresa. As grandezas
 * absolutas escalam pela participação; eficiência em km/l não muda.
 */
export function scaleSeries(series: EsgMonth[], share: number): EsgMonth[] {
  if (share >= 1) return series;

  let cumulativeLiters = 0;

  return series.map((month) => {
    const savingsByInitiative = initiativeIds.reduce(
      (acc, id) => {
        acc[id] = Math.round(month.savingsByInitiative[id] * share);
        return acc;
      },
      {} as Record<InitiativeId, number>,
    );
    const dieselSavedLiters = initiativeIds.reduce(
      (total, id) => total + savingsByInitiative[id],
      0,
    );
    cumulativeLiters += dieselSavedLiters;

    return {
      ...month,
      kmTraveled: Math.round(month.kmTraveled * share),
      savingsByInitiative,
      dieselBaselineLiters: Math.round(month.dieselBaselineLiters * share),
      dieselConsumedLiters: Math.round(month.dieselConsumedLiters * share),
      dieselSavedLiters,
      co2AvoidedTons: Number(litersToCo2Tons(dieselSavedLiters).toFixed(1)),
      cumulativeDieselSavedLiters: cumulativeLiters,
      cumulativeCo2AvoidedTons: Number(litersToCo2Tons(cumulativeLiters).toFixed(1)),
    };
  });
}

export type EsgSummary = {
  months: number;
  kmTraveled: number;
  dieselBaselineLiters: number;
  dieselConsumedLiters: number;
  dieselSavedLiters: number;
  co2AvoidedTons: number;
  /** Economia sobre o consumo da linha de base, de 0 a 1. */
  savingsRate: number;
  kmPerLiter: number;
  baselineKmPerLiter: number;
  savingsByInitiative: Record<InitiativeId, number>;
  equivalentTrees: number;
  equivalentCars: number;
  /** Avanço sobre a meta anual de litros economizados, de 0 a 1. */
  targetProgress: number;
};

/**
 * Consolida um recorte da série mensal nos indicadores exibidos no painel.
 * `targetLiters` permite comparar a fatia de um cliente com a meta rateada.
 */
export function summarize(
  series: EsgMonth[],
  targetLiters: number = esgTargets.annualDieselLiters,
): EsgSummary {
  const totals = series.reduce(
    (acc, month) => {
      acc.kmTraveled += month.kmTraveled;
      acc.dieselBaselineLiters += month.dieselBaselineLiters;
      acc.dieselConsumedLiters += month.dieselConsumedLiters;
      acc.dieselSavedLiters += month.dieselSavedLiters;
      initiativeIds.forEach((id) => {
        acc.savingsByInitiative[id] += month.savingsByInitiative[id];
      });
      return acc;
    },
    {
      kmTraveled: 0,
      dieselBaselineLiters: 0,
      dieselConsumedLiters: 0,
      dieselSavedLiters: 0,
      savingsByInitiative: {
        routing: 0,
        consolidation: 0,
        emptyKm: 0,
        fleet: 0,
        ecoDriving: 0,
      } as Record<InitiativeId, number>,
    },
  );

  const co2AvoidedTons = Number(litersToCo2Tons(totals.dieselSavedLiters).toFixed(1));

  return {
    months: series.length,
    ...totals,
    co2AvoidedTons,
    savingsRate: totals.dieselBaselineLiters
      ? totals.dieselSavedLiters / totals.dieselBaselineLiters
      : 0,
    kmPerLiter: totals.dieselConsumedLiters
      ? Number((totals.kmTraveled / totals.dieselConsumedLiters).toFixed(2))
      : 0,
    baselineKmPerLiter: BASELINE_KM_PER_LITER,
    equivalentTrees: Math.round((co2AvoidedTons * 1000) / TREE_ABSORPTION_KG_PER_YEAR),
    equivalentCars: Math.round(co2AvoidedTons / CAR_EMISSION_TONS_PER_YEAR),
    targetProgress: targetLiters ? totals.dieselSavedLiters / targetLiters : 0,
  };
}
