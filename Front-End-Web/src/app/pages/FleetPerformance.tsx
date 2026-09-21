import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import {
  Download,
  Gauge,
  Percent,
  Route,
  Timer,
  TrendingDown,
  Truck,
  Zap,
} from "lucide-react";
import { PageHero } from "../components/PageHero";
import {
  corridors,
  matchBuckets,
  matchStats,
  performanceSeries,
  performanceTargets,
  summarizePerformance,
  vehicleTypes,
  type PerformanceMonth,
} from "../data/fleetPerformance";

const integerFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const decimalFormat = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const percentFormat = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const currentYear = performanceSeries[performanceSeries.length - 1].key.slice(0, 4);

const periods = [
  { id: "12m", label: "Últimos 12 meses" },
  { id: "6m", label: "Últimos 6 meses" },
  { id: "ytd", label: `Ano ${currentYear}` },
] as const;

type PeriodId = (typeof periods)[number]["id"];

function selectPeriod(periodId: PeriodId): PerformanceMonth[] {
  if (periodId === "6m") return performanceSeries.slice(-6);
  if (periodId === "ytd") {
    return performanceSeries.filter((month) => month.key.startsWith(currentYear));
  }
  return performanceSeries;
}

/** Converte minutos em "1h 20min" para leitura rápida nos indicadores. */
function formatMinutes(minutes: number) {
  if (minutes < 60) return `${decimalFormat.format(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes - hours * 60);
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}

type UnitTooltipProps = TooltipProps<number, string> & {
  unit?: string;
  percent?: boolean;
};

function UnitTooltip({ active, payload, label, unit = "", percent = false }: UnitTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <div className="mb-2 text-sm font-bold text-gray-900">{label}</div>
      <ul className="space-y-1">
        {payload.map((entry) => {
          const value = Number(entry.value ?? 0);
          return (
            <li key={String(entry.dataKey)} className="flex items-center gap-3 text-sm">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
                aria-hidden
              />
              <span className="text-gray-600">{entry.name}</span>
              <span className="ml-auto font-bold text-gray-900">
                {percent
                  ? percentFormat.format(value / 100)
                  : `${decimalFormat.format(value)} ${unit}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function FleetPerformance() {
  const [periodId, setPeriodId] = useState<PeriodId>("12m");
  const [exporting, setExporting] = useState(false);

  const series = useMemo(() => selectPeriod(periodId), [periodId]);
  const summary = useMemo(() => summarizePerformance(series), [series]);

  const matchChartData = useMemo(
    () =>
      series.map((month) => ({
        label: month.label,
        averageMinutes: month.averageMinutes,
        medianMinutes: month.medianMinutes,
        p90Minutes: month.p90Minutes,
      })),
    [series],
  );

  const distributionData = useMemo(() => {
    let accumulated = 0;
    return matchBuckets.map((bucket, index) => {
      const matches = summary.matchesByBucket[index];
      accumulated += matches;
      return {
        id: bucket.id,
        label: bucket.label,
        color: bucket.color,
        matches,
        share: summary.matches ? matches / summary.matches : 0,
        cumulative: summary.matches ? (accumulated / summary.matches) * 100 : 0,
      };
    });
  }, [summary]);

  const efficiencyData = useMemo(
    () =>
      series.map((month) => ({
        label: month.label,
        emptyKm: Number((month.emptyKmRate * 100).toFixed(1)),
        occupancy: Number((month.occupancyRate * 100).toFixed(1)),
        availability: Number((month.availabilityRate * 100).toFixed(1)),
      })),
    [series],
  );

  const corridorData = useMemo(
    () =>
      corridors
        .map((corridor) => ({
          ...corridor,
          ...matchStats(corridor.matchesByBucket),
        }))
        .sort((a, b) => a.averageMinutes - b.averageMinutes),
    [],
  );

  const slowestCorridor = corridorData[corridorData.length - 1];

  async function handleExport() {
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          series.map((month) => ({
            "Mês": month.label,
            Matches: month.matches,
            "Tempo médio (min)": month.averageMinutes,
            "Mediana (min)": month.medianMinutes,
            "P90 (min)": month.p90Minutes,
            "Até 30 min (%)": Number((month.under30Rate * 100).toFixed(1)),
            "Km carregado": month.loadedKm,
            "Km vazio": month.emptyKm,
            "Km vazio (%)": Number((month.emptyKmRate * 100).toFixed(1)),
            "Ocupação (%)": Number((month.occupancyRate * 100).toFixed(1)),
            "Disponibilidade (%)": Number((month.availabilityRate * 100).toFixed(1)),
            "Viagens por veículo": month.tripsPerVehicle,
          })),
        ),
        "Mensal",
      );

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          distributionData.map((bucket) => ({
            Faixa: bucket.label,
            Matches: bucket.matches,
            "Participação (%)": Number((bucket.share * 100).toFixed(1)),
            "Acumulado (%)": Number(bucket.cumulative.toFixed(1)),
          })),
        ),
        "Distribuição",
      );

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          vehicleTypes.map((vehicle) => ({
            "Tipo de veículo": vehicle.label,
            Frota: vehicle.fleet,
            "Tempo médio de match (min)": vehicle.averageMatchMinutes,
            "Ocupação (%)": Number((vehicle.occupancyRate * 100).toFixed(1)),
            "Km vazio (%)": Number((vehicle.emptyKmRate * 100).toFixed(1)),
            "Viagens por veículo": vehicle.tripsPerVehicle,
          })),
        ),
        "Frota",
      );

      XLSX.writeFile(workbook, `performance-operacional-${periodId}.xlsx`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <PageHero
        eyebrow="Performance"
        title="Tempo de match e eficiência da frota"
        description="Quanto tempo uma carga leva para encontrar veículo e quanto da capacidade da frota vira quilômetro produtivo."
      />

      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setPeriodId(period.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    periodId === period.id
                      ? "bg-orange-600 text-white"
                      : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Gerando..." : "Exportar XLSX"}
            </button>
          </div>

          {/* Indicadores principais */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-6">
            <div className="bg-gray-900 text-white rounded-2xl p-7 shadow-lg">
              <Timer className="w-8 h-8 mb-4 text-orange-400" />
              <div className="text-4xl font-bold mb-1">
                {formatMinutes(summary.averageMinutes)}
              </div>
              <div className="text-gray-300 font-semibold">Tempo médio de match</div>
              <div className="text-sm text-gray-400 mt-3">
                Mediana de {formatMinutes(summary.medianMinutes)} • P90 de{" "}
                {formatMinutes(summary.p90Minutes)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-2xl p-7 shadow-lg">
              <Zap className="w-8 h-8 mb-4 text-orange-100" />
              <div className="text-4xl font-bold mb-1">
                {percentFormat.format(summary.under30Rate)}
              </div>
              <div className="text-orange-100 font-semibold">Matches em até 30 min</div>
              <div className="text-sm text-orange-100/80 mt-3">
                Meta de {percentFormat.format(performanceTargets.under30Rate)} •{" "}
                {integerFormat.format(summary.matches)} matches no período
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-md">
              <Gauge className="w-8 h-8 mb-4 text-emerald-600" />
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {percentFormat.format(summary.occupancyRate)}
              </div>
              <div className="text-gray-700 font-semibold">Ocupação da frota</div>
              <div className="text-sm text-gray-500 mt-3">
                Meta de {percentFormat.format(performanceTargets.occupancyRate)} de aproveitamento
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-md">
              <Percent className="w-8 h-8 mb-4 text-orange-600" />
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {percentFormat.format(summary.emptyKmRate)}
              </div>
              <div className="text-gray-700 font-semibold">Km vazio</div>
              <div className="text-sm text-gray-500 mt-3">
                {integerFormat.format(summary.emptyKm)} km de{" "}
                {integerFormat.format(summary.totalKm)} rodados
              </div>
            </div>
          </div>

          {/* Indicadores secundários */}
          <div className="grid gap-5 sm:grid-cols-3 mb-10">
            {[
              {
                icon: TrendingDown,
                value: `${summary.matchTrendMinutes > 0 ? "+" : ""}${decimalFormat.format(
                  summary.matchTrendMinutes,
                )} min`,
                label: "Variação do tempo de match no período",
                positive: summary.matchTrendMinutes <= 0,
              },
              {
                icon: Truck,
                value: decimalFormat.format(summary.tripsPerVehicle),
                label: `Viagens por veículo ao mês • frota média de ${integerFormat.format(
                  summary.averageActiveVehicles,
                )}`,
                positive: true,
              },
              {
                icon: Gauge,
                value: percentFormat.format(summary.availabilityRate),
                label: `Disponibilidade da frota • meta de ${percentFormat.format(
                  performanceTargets.availabilityRate,
                )}`,
                positive: summary.availabilityRate >= performanceTargets.availabilityRate,
              },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${item.positive ? "bg-emerald-50" : "bg-orange-50"}`}>
                  <item.icon
                    className={`w-5 h-5 ${item.positive ? "text-emerald-600" : "text-orange-600"}`}
                  />
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold ${
                      item.positive ? "text-emerald-700" : "text-orange-600"
                    }`}
                  >
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tempo de match por mês */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tempo de match por mês</h2>
                <p className="text-gray-600">
                  Média e cauda longa: o P90 mostra o que acontece nos casos mais difíceis.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Meta de {performanceTargets.matchMinutes} min no tempo médio
              </div>
            </div>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={matchChartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#6b7280" />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#6b7280"
                    width={52}
                    unit=" min"
                  />
                  <Tooltip<number, string>
                    content={<UnitTooltip unit="min" />}
                    cursor={{ fill: "rgba(234, 88, 12, 0.08)" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 12 }} />
                  <ReferenceLine
                    y={performanceTargets.matchMinutes}
                    stroke="#059669"
                    strokeDasharray="6 4"
                    label={{
                      value: `Meta ${performanceTargets.matchMinutes} min`,
                      position: "insideTopRight",
                      fill: "#059669",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="averageMinutes"
                    name="Tempo médio"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                    isAnimationActive={false}
                  >
                    {matchChartData.map((month) => (
                      <Cell
                        key={month.label}
                        fill={
                          month.averageMinutes <= performanceTargets.matchMinutes
                            ? "#059669"
                            : "#ea580c"
                        }
                      />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="medianMinutes"
                    name="Mediana"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="p90Minutes"
                    name="P90"
                    stroke="#dc2626"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribuição do tempo de match */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Distribuição do tempo de match
                </h2>
                <p className="text-gray-600">
                  Quantos matches caem em cada faixa e o acumulado até ali.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {integerFormat.format(summary.matches)} matches no período
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={distributionData}
                  margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#6b7280" />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    stroke="#6b7280"
                    width={60}
                    tickFormatter={(value: number) => integerFormat.format(value)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    stroke="#9ca3af"
                    width={48}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip<number, string>
                    content={<UnitTooltip unit="matches" />}
                    cursor={{ fill: "rgba(15, 23, 42, 0.05)" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 12 }} />
                  <Bar
                    yAxisId="left"
                    dataKey="matches"
                    name="Matches"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={64}
                    isAnimationActive={false}
                  >
                    {distributionData.map((bucket) => (
                      <Cell key={bucket.id} fill={bucket.color} />
                    ))}
                  </Bar>
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumulative"
                    name="Acumulado (%)"
                    stroke="#0f172a"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={{ r: 3 }}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5 mt-6">
              {distributionData.map((bucket) => (
                <div key={bucket.id} className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: bucket.color }}
                      aria-hidden
                    />
                    <span className="text-sm font-semibold text-gray-900">{bucket.label}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {percentFormat.format(bucket.share)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {integerFormat.format(bucket.matches)} matches
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eficiência da frota */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Eficiência da frota</h2>
                <p className="text-gray-600">
                  Ocupação e disponibilidade subindo enquanto o km vazio cai.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Km vazio: <span className="font-bold text-emerald-700">
                  {decimalFormat.format(summary.emptyKmTrendPoints)} p.p.
                </span>{" "}
                no período
              </div>
            </div>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={efficiencyData}
                  margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#6b7280" />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    stroke="#6b7280"
                    width={52}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    stroke="#9ca3af"
                    width={48}
                    domain={[0, 20]}
                    unit="%"
                  />
                  <Tooltip<number, string> content={<UnitTooltip percent />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 12 }} />
                  <Bar
                    yAxisId="right"
                    dataKey="emptyKm"
                    name="Km vazio"
                    fill="#fdba74"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                    isAnimationActive={false}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="occupancy"
                    name="Ocupação"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    isAnimationActive={false}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="availability"
                    name="Disponibilidade"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Corredores e tipos de veículo */}
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md lg:col-span-3">
              <div className="flex items-center gap-2 mb-1">
                <Route className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Match por corredor</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Corredor mais lento: <span className="font-semibold">{slowestCorridor.label}</span>,
                com {formatMinutes(slowestCorridor.averageMinutes)} de média.
              </p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={corridorData}
                    layout="vertical"
                    margin={{ top: 4, right: 24, bottom: 0, left: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      stroke="#6b7280"
                      unit=" min"
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      stroke="#374151"
                      width={150}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip<number, string>
                      content={<UnitTooltip unit="min" />}
                      cursor={{ fill: "rgba(234, 88, 12, 0.08)" }}
                    />
                    <ReferenceLine
                      x={performanceTargets.matchMinutes}
                      stroke="#059669"
                      strokeDasharray="6 4"
                    />
                    <Bar
                      dataKey="averageMinutes"
                      name="Tempo médio"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={26}
                      isAnimationActive={false}
                    >
                      {corridorData.map((corridor) => (
                        <Cell
                          key={corridor.id}
                          fill={
                            corridor.averageMinutes <= performanceTargets.matchMinutes
                              ? "#059669"
                              : "#ea580c"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Por tipo de veículo</h2>
              </div>
              <div className="space-y-5">
                {vehicleTypes.map((vehicle) => (
                  <div key={vehicle.id}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-semibold text-gray-900">{vehicle.label}</span>
                      <span className="text-sm text-gray-500">
                        {integerFormat.format(vehicle.fleet)} veículos
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full bg-emerald-600"
                        style={{ width: `${vehicle.occupancyRate * 100}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                      <span>
                        Ocupação{" "}
                        <span className="font-semibold text-gray-900">
                          {percentFormat.format(vehicle.occupancyRate)}
                        </span>
                      </span>
                      <span>
                        Match{" "}
                        <span className="font-semibold text-gray-900">
                          {formatMinutes(vehicle.averageMatchMinutes)}
                        </span>
                      </span>
                      <span>
                        Km vazio{" "}
                        <span className="font-semibold text-gray-900">
                          {percentFormat.format(vehicle.emptyKmRate)}
                        </span>
                      </span>
                      <span>
                        {decimalFormat.format(vehicle.tripsPerVehicle)} viagens/mês
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-6 leading-relaxed">
                Tempo de match é o intervalo entre a publicação da carga e a confirmação do veículo.
                Média e percentis vêm da distribuição por faixas, com interpolação uniforme dentro
                de cada faixa. A faixa aberta "acima de 2h" entra nos cálculos com teto de{" "}
                {formatMinutes(matchBuckets[matchBuckets.length - 1].upper)}, o que puxa a média
                para cima em relação à mediana.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
