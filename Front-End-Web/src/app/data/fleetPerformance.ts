/**
 * Indicadores de performance operacional: tempo de match e eficiência da frota.
 *
 * A base guarda apenas contadores brutos — quantos matches caíram em cada faixa
 * de tempo, km carregado e vazio, horas disponíveis, capacidade e carga
 * transportada. Média, percentis, ocupação e disponibilidade são derivados,
 * então nenhum indicador pode divergir dos outros.
 */

export type MatchBucket = {
  id: string;
  label: string;
  /** Limites da faixa em minutos; o último é aberto e usa `upper` como teto. */
  lower: number;
  upper: number;
  color: string;
};

export const matchBuckets: MatchBucket[] = [
  { id: "ate15", label: "Até 15 min", lower: 0, upper: 15, color: "#059669" },
  { id: "15a30", label: "15 a 30 min", lower: 15, upper: 30, color: "#10b981" },
  { id: "30a60", label: "30 a 60 min", lower: 30, upper: 60, color: "#f59e0b" },
  { id: "60a120", label: "1h a 2h", lower: 60, upper: 120, color: "#ea580c" },
  { id: "acima120", label: "Acima de 2h", lower: 120, upper: 300, color: "#dc2626" },
];

/** Metas pactuadas com a operação. */
export const performanceTargets = {
  matchMinutes: 30,
  under30Rate: 0.7,
  occupancyRate: 0.85,
  emptyKmRate: 0.08,
  availabilityRate: 0.92,
};

export type PerformanceMonthInput = {
  key: string;
  label: string;
  /** Matches concluídos em cada faixa de `matchBuckets`, na mesma ordem. */
  matchesByBucket: number[];
  trips: number;
  loadedKm: number;
  emptyKm: number;
  activeVehicles: number;
  /** Horas de frota programadas no mês. */
  scheduledHours: number;
  /** Horas em que a frota esteve efetivamente disponível. */
  availableHours: number;
  capacityTons: number;
  transportedTons: number;
};

const monthlyInput: PerformanceMonthInput[] = [
  {
    key: "2025-09",
    label: "Set/25",
    matchesByBucket: [212, 354, 295, 201, 118],
    trips: 1180,
    loadedKm: 708413,
    emptyKm: 103987,
    activeVehicles: 212,
    scheduledHours: 55968,
    availableHours: 49476,
    capacityTons: 30680,
    transportedTons: 23961,
  },
  {
    key: "2025-10",
    label: "Out/25",
    matchesByBucket: [236, 373, 301, 199, 116],
    trips: 1225,
    loadedKm: 740162,
    emptyKm: 105738,
    activeVehicles: 215,
    scheduledHours: 56760,
    availableHours: 50460,
    capacityTons: 31850,
    transportedTons: 25130,
  },
  {
    key: "2025-11",
    label: "Nov/25",
    matchesByBucket: [265, 399, 311, 201, 114],
    trips: 1290,
    loadedKm: 781695,
    emptyKm: 107605,
    activeVehicles: 219,
    scheduledHours: 57816,
    availableHours: 51630,
    capacityTons: 33540,
    transportedTons: 26698,
  },
  {
    key: "2025-12",
    label: "Dez/25",
    matchesByBucket: [296, 425, 320, 201, 113],
    trips: 1355,
    loadedKm: 826223,
    emptyKm: 109477,
    activeVehicles: 224,
    scheduledHours: 59136,
    availableHours: 53045,
    capacityTons: 35230,
    transportedTons: 28290,
  },
  {
    key: "2026-01",
    label: "Jan/26",
    matchesByBucket: [261, 360, 262, 159, 88],
    trips: 1130,
    loadedKm: 693706,
    emptyKm: 87494,
    activeVehicles: 218,
    scheduledHours: 57552,
    availableHours: 51912,
    capacityTons: 29380,
    transportedTons: 23857,
  },
  {
    key: "2026-02",
    label: "Fev/26",
    matchesByBucket: [284, 376, 265, 156, 84],
    trips: 1165,
    loadedKm: 720204,
    emptyKm: 86296,
    activeVehicles: 220,
    scheduledHours: 58080,
    availableHours: 52620,
    capacityTons: 30290,
    transportedTons: 24777,
  },
  {
    key: "2026-03",
    label: "Mar/26",
    matchesByBucket: [328, 419, 285, 162, 86],
    trips: 1280,
    loadedKm: 794806,
    emptyKm: 89294,
    activeVehicles: 226,
    scheduledHours: 59664,
    availableHours: 54354,
    capacityTons: 33280,
    transportedTons: 27489,
  },
  {
    key: "2026-04",
    label: "Abr/26",
    matchesByBucket: [353, 435, 286, 156, 80],
    trips: 1310,
    loadedKm: 816129,
    emptyKm: 85671,
    activeVehicles: 229,
    scheduledHours: 60456,
    availableHours: 55317,
    capacityTons: 34060,
    transportedTons: 28372,
  },
  {
    key: "2026-05",
    label: "Mai/26",
    matchesByBucket: [379, 452, 287, 150, 77],
    trips: 1345,
    loadedKm: 845772,
    emptyKm: 82628,
    activeVehicles: 232,
    scheduledHours: 61248,
    availableHours: 56287,
    capacityTons: 34970,
    transportedTons: 29410,
  },
  {
    key: "2026-06",
    label: "Jun/26",
    matchesByBucket: [404, 467, 286, 143, 70],
    trips: 1370,
    loadedKm: 868949,
    emptyKm: 78651,
    activeVehicles: 235,
    scheduledHours: 62040,
    availableHours: 57263,
    capacityTons: 35620,
    transportedTons: 30206,
  },
  {
    key: "2026-07",
    label: "Jul/26",
    matchesByBucket: [436, 491, 290, 138, 65],
    trips: 1420,
    loadedKm: 906663,
    emptyKm: 75637,
    activeVehicles: 239,
    scheduledHours: 63096,
    availableHours: 58553,
    capacityTons: 36920,
    transportedTons: 31604,
  },
  {
    key: "2026-08",
    label: "Ago/26",
    matchesByBucket: [424, 464, 265, 119, 53],
    trips: 1325,
    loadedKm: 850778,
    emptyKm: 65022,
    activeVehicles: 234,
    scheduledHours: 61776,
    availableHours: 57513,
    capacityTons: 34450,
    transportedTons: 29696,
  },
];

export type MatchStats = {
  matches: number;
  /** Média ponderada pelo ponto médio de cada faixa, em minutos. */
  averageMinutes: number;
  /** Mediana interpolada dentro da faixa em que o percentil cai. */
  medianMinutes: number;
  p90Minutes: number;
  /** Participação dos matches concluídos em até 30 minutos, de 0 a 1. */
  under30Rate: number;
};

function bucketMidpoint(bucket: MatchBucket) {
  return (bucket.lower + bucket.upper) / 2;
}

/**
 * Percentil interpolado sobre a distribuição por faixas. Sem os tempos
 * individuais, assume-se distribuição uniforme dentro de cada faixa.
 */
function percentile(counts: number[], ratio: number) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (!total) return 0;

  const target = total * ratio;
  let accumulated = 0;

  for (let index = 0; index < counts.length; index += 1) {
    if (accumulated + counts[index] >= target) {
      const bucket = matchBuckets[index];
      const positionInBucket = counts[index] ? (target - accumulated) / counts[index] : 0;
      return bucket.lower + (bucket.upper - bucket.lower) * positionInBucket;
    }
    accumulated += counts[index];
  }

  return matchBuckets[matchBuckets.length - 1].upper;
}

export function matchStats(counts: number[]): MatchStats {
  const matches = counts.reduce((sum, count) => sum + count, 0);
  if (!matches) {
    return { matches: 0, averageMinutes: 0, medianMinutes: 0, p90Minutes: 0, under30Rate: 0 };
  }

  const weighted = counts.reduce(
    (sum, count, index) => sum + count * bucketMidpoint(matchBuckets[index]),
    0,
  );

  return {
    matches,
    averageMinutes: Number((weighted / matches).toFixed(1)),
    medianMinutes: Number(percentile(counts, 0.5).toFixed(1)),
    p90Minutes: Number(percentile(counts, 0.9).toFixed(1)),
    under30Rate: (counts[0] + counts[1]) / matches,
  };
}

export type PerformanceMonth = PerformanceMonthInput &
  MatchStats & {
    totalKm: number;
    emptyKmRate: number;
    occupancyRate: number;
    availabilityRate: number;
    tripsPerVehicle: number;
  };

function buildMonth(month: PerformanceMonthInput): PerformanceMonth {
  const totalKm = month.loadedKm + month.emptyKm;

  return {
    ...month,
    ...matchStats(month.matchesByBucket),
    totalKm,
    emptyKmRate: totalKm ? month.emptyKm / totalKm : 0,
    occupancyRate: month.capacityTons ? month.transportedTons / month.capacityTons : 0,
    availabilityRate: month.scheduledHours ? month.availableHours / month.scheduledHours : 0,
    tripsPerVehicle: Number((month.trips / month.activeVehicles).toFixed(1)),
  };
}

/** Série mensal completa, do mês mais antigo para o mais recente. */
export const performanceSeries: PerformanceMonth[] = monthlyInput.map(buildMonth);

export type Corridor = {
  id: string;
  label: string;
  /** Distribuição de matches do corredor no período, por faixa de tempo. */
  matchesByBucket: number[];
  emptyKmRate: number;
};

export const corridors: Corridor[] = [
  {
    id: "sp-cwb",
    label: "São Paulo → Curitiba",
    matchesByBucket: [1180, 1240, 620, 210, 70],
    emptyKmRate: 0.064,
  },
  {
    id: "sp-rj",
    label: "São Paulo → Rio de Janeiro",
    matchesByBucket: [940, 1010, 540, 200, 80],
    emptyKmRate: 0.071,
  },
  {
    id: "cps-bh",
    label: "Campinas → Belo Horizonte",
    matchesByBucket: [610, 780, 520, 240, 110],
    emptyKmRate: 0.089,
  },
  {
    id: "cwb-poa",
    label: "Curitiba → Porto Alegre",
    matchesByBucket: [430, 620, 480, 270, 140],
    emptyKmRate: 0.104,
  },
  {
    id: "sp-gyn",
    label: "São Paulo → Goiânia",
    matchesByBucket: [320, 480, 430, 290, 170],
    emptyKmRate: 0.118,
  },
  {
    id: "gru-ssa",
    label: "Guarulhos → Salvador",
    matchesByBucket: [180, 290, 340, 300, 210],
    emptyKmRate: 0.147,
  },
];

export type VehicleType = {
  id: string;
  label: string;
  fleet: number;
  /** Tempo médio até encontrar carga compatível, em minutos. */
  averageMatchMinutes: number;
  occupancyRate: number;
  emptyKmRate: number;
  tripsPerVehicle: number;
};

export const vehicleTypes: VehicleType[] = [
  {
    id: "carreta-sider",
    label: "Carreta sider",
    fleet: 86,
    averageMatchMinutes: 31.4,
    occupancyRate: 0.884,
    emptyKmRate: 0.061,
    tripsPerVehicle: 6.4,
  },
  {
    id: "truck-bau",
    label: "Truck baú",
    fleet: 64,
    averageMatchMinutes: 35.8,
    occupancyRate: 0.857,
    emptyKmRate: 0.074,
    tripsPerVehicle: 5.9,
  },
  {
    id: "bitrem",
    label: "Bitrem",
    fleet: 38,
    averageMatchMinutes: 44.2,
    occupancyRate: 0.903,
    emptyKmRate: 0.083,
    tripsPerVehicle: 4.6,
  },
  {
    id: "vuc",
    label: "VUC",
    fleet: 46,
    averageMatchMinutes: 26.9,
    occupancyRate: 0.792,
    emptyKmRate: 0.097,
    tripsPerVehicle: 8.2,
  },
];

export type PerformanceSummary = MatchStats & {
  months: number;
  matchesByBucket: number[];
  trips: number;
  loadedKm: number;
  emptyKm: number;
  totalKm: number;
  emptyKmRate: number;
  occupancyRate: number;
  availabilityRate: number;
  tripsPerVehicle: number;
  averageActiveVehicles: number;
  /** Variação do tempo médio entre o primeiro e o último mês, em minutos. */
  matchTrendMinutes: number;
  /** Variação do km vazio entre o primeiro e o último mês, em pontos. */
  emptyKmTrendPoints: number;
};

/** Consolida um recorte da série nos indicadores exibidos no painel. */
export function summarizePerformance(series: PerformanceMonth[]): PerformanceSummary {
  const empty = matchBuckets.map(() => 0);

  const totals = series.reduce(
    (acc, month) => {
      month.matchesByBucket.forEach((count, index) => {
        acc.matchesByBucket[index] += count;
      });
      acc.trips += month.trips;
      acc.loadedKm += month.loadedKm;
      acc.emptyKm += month.emptyKm;
      acc.scheduledHours += month.scheduledHours;
      acc.availableHours += month.availableHours;
      acc.capacityTons += month.capacityTons;
      acc.transportedTons += month.transportedTons;
      acc.vehicleMonths += month.activeVehicles;
      return acc;
    },
    {
      matchesByBucket: [...empty],
      trips: 0,
      loadedKm: 0,
      emptyKm: 0,
      scheduledHours: 0,
      availableHours: 0,
      capacityTons: 0,
      transportedTons: 0,
      vehicleMonths: 0,
    },
  );

  const totalKm = totals.loadedKm + totals.emptyKm;
  const first = series[0];
  const last = series[series.length - 1];

  return {
    ...matchStats(totals.matchesByBucket),
    months: series.length,
    matchesByBucket: totals.matchesByBucket,
    trips: totals.trips,
    loadedKm: totals.loadedKm,
    emptyKm: totals.emptyKm,
    totalKm,
    emptyKmRate: totalKm ? totals.emptyKm / totalKm : 0,
    occupancyRate: totals.capacityTons ? totals.transportedTons / totals.capacityTons : 0,
    availabilityRate: totals.scheduledHours ? totals.availableHours / totals.scheduledHours : 0,
    tripsPerVehicle: totals.vehicleMonths
      ? Number((totals.trips / totals.vehicleMonths).toFixed(1))
      : 0,
    averageActiveVehicles: series.length ? Math.round(totals.vehicleMonths / series.length) : 0,
    matchTrendMinutes:
      first && last ? Number((last.averageMinutes - first.averageMinutes).toFixed(1)) : 0,
    emptyKmTrendPoints:
      first && last ? Number(((last.emptyKmRate - first.emptyKmRate) * 100).toFixed(1)) : 0,
  };
}
