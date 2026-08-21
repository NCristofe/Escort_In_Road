import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import {
  ArrowDownRight,
  Calculator,
  Download,
  PiggyBank,
  Receipt,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { PageHero } from "../components/PageHero";
import {
  breakdownFor,
  buildMonthlyResults,
  costComponents,
  freightMonths,
  laneComparisons,
  lanes,
  modalities,
  summarizeFinancial,
} from "../data/freightCost";

const currencyFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});
const preciseCurrencyFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const compactCurrencyFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});
const integerFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const percentFormat = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const currentYear = freightMonths[freightMonths.length - 1].key.slice(0, 4);

const periods = [
  { id: "12m", label: "Últimos 12 meses" },
  { id: "6m", label: "Últimos 6 meses" },
  { id: "ytd", label: `Ano ${currentYear}` },
] as const;

type PeriodId = (typeof periods)[number]["id"];

function selectMonths(periodId: PeriodId) {
  if (periodId === "6m") return freightMonths.slice(-6);
  if (periodId === "ytd") return freightMonths.filter((month) => month.key.startsWith(currentYear));
  return freightMonths;
}

type CurrencyTooltipProps = TooltipProps<number, string> & { showTotal?: boolean };

function CurrencyTooltip({ active, payload, label, showTotal = false }: CurrencyTooltipProps) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, entry) => sum + Number(entry.value ?? 0), 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <div className="mb-2 text-sm font-bold text-gray-900">{label}</div>
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={String(entry.dataKey)} className="flex items-center gap-3 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden
            />
            <span className="text-gray-600">{entry.name}</span>
            <span className="ml-auto font-bold text-gray-900">
              {currencyFormat.format(Number(entry.value ?? 0))}
            </span>
          </li>
        ))}
      </ul>
      {showTotal && (
        <div className="mt-2 flex items-center gap-3 border-t border-gray-100 pt-2 text-sm">
          <span className="font-semibold text-gray-700">Total</span>
          <span className="ml-auto font-bold text-gray-900">{currencyFormat.format(total)}</span>
        </div>
      )}
    </div>
  );
}

export function FreightSavings() {
  const [periodId, setPeriodId] = useState<PeriodId>("12m");
  const [exporting, setExporting] = useState(false);

  // Simulador
  const [simulationLaneId, setSimulationLaneId] = useState(lanes[0].id);
  const [simulationShipments, setSimulationShipments] = useState(120);
  const [simulationCargoValue, setSimulationCargoValue] = useState(lanes[0].avgCargoValue);
  const [simulationDistance, setSimulationDistance] = useState(lanes[0].distanceKm);

  const months = useMemo(() => selectMonths(periodId), [periodId]);
  const results = useMemo(() => buildMonthlyResults(months), [months]);
  const summary = useMemo(() => summarizeFinancial(results), [results]);

  const laneChartData = useMemo(
    () =>
      [...laneComparisons]
        .sort((a, b) => b.savingsPerShipment - a.savingsPerShipment)
        .map((comparison) => ({
          id: comparison.lane.id,
          label: `${comparison.lane.origin.split("/")[0]} → ${comparison.lane.destination.split("/")[0]}`,
          comum: Math.round(comparison.comum.total),
          escort: Math.round(comparison.escort.total),
          savings: Math.round(comparison.savingsPerShipment),
          savingsRate: comparison.savingsRate,
          lane: comparison.lane,
        })),
    [],
  );

  const componentChartData = useMemo(
    () => [
      {
        modality: modalities.comum.label,
        ...Object.fromEntries(
          summary.componentSavings.map((item) => [item.component.id, Math.round(item.comum)]),
        ),
      },
      {
        modality: modalities.escort.label,
        ...Object.fromEntries(
          summary.componentSavings.map((item) => [item.component.id, Math.round(item.escort)]),
        ),
      },
    ],
    [summary],
  );

  const simulation = useMemo(() => {
    const profile = { distanceKm: simulationDistance, cargoValue: simulationCargoValue };
    const comum = breakdownFor(profile, modalities.comum);
    const escort = breakdownFor(profile, modalities.escort);
    const perShipment = comum.total - escort.total;

    return {
      comum,
      escort,
      perShipment,
      monthly: perShipment * simulationShipments,
      annual: perShipment * simulationShipments * 12,
      rate: comum.total ? perShipment / comum.total : 0,
    };
  }, [simulationCargoValue, simulationDistance, simulationShipments]);

  function applyLanePreset(laneId: string) {
    const lane = lanes.find((item) => item.id === laneId) ?? lanes[0];
    setSimulationLaneId(lane.id);
    setSimulationDistance(lane.distanceKm);
    setSimulationCargoValue(lane.avgCargoValue);
  }

  const bestLane = laneChartData[0];

  async function handleExport() {
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          results.map((month) => ({
            "Mês": month.label,
            Embarques: month.allocatedShipments,
            "Custo frete comum (R$)": Number(month.comumCost.toFixed(2)),
            "Custo frete Escort (R$)": Number(month.escortCost.toFixed(2)),
            "Economia (R$)": Number(month.savings.toFixed(2)),
            "Economia acumulada (R$)": Number(month.cumulativeSavings.toFixed(2)),
          })),
        ),
        "Mensal",
      );

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          laneComparisons.map((comparison) => ({
            Rota: `${comparison.lane.origin} → ${comparison.lane.destination}`,
            "Distância (km)": comparison.lane.distanceKm,
            "Valor médio da carga (R$)": comparison.lane.avgCargoValue,
            "Custo comum por embarque (R$)": Number(comparison.comum.total.toFixed(2)),
            "Custo Escort por embarque (R$)": Number(comparison.escort.total.toFixed(2)),
            "Economia por embarque (R$)": Number(comparison.savingsPerShipment.toFixed(2)),
            "Economia (%)": Number((comparison.savingsRate * 100).toFixed(1)),
          })),
        ),
        "Rotas",
      );

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          summary.componentSavings.map((item) => ({
            Componente: item.component.label,
            "Frete comum (R$)": Number(item.comum.toFixed(2)),
            "Frete Escort (R$)": Number(item.escort.toFixed(2)),
            "Diferença (R$)": Number(item.delta.toFixed(2)),
          })),
        ),
        "Componentes",
      );

      XLSX.writeFile(workbook, `economia-frete-${periodId}.xlsx`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <PageHero
        eyebrow="Relatórios financeiros"
        title="Frete Comum x Frete Escort"
        description="Comparativo de custo total por embarque: tarifa, seguro, perdas por sinistro, multas por atraso e gestão em uma única conta."
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
              {exporting ? "Gerando..." : "Exportar relatório"}
            </button>
          </div>

          {/* Indicadores principais */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-10">
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-2xl p-7 shadow-lg">
              <PiggyBank className="w-8 h-8 mb-4 text-orange-100" />
              <div className="text-4xl font-bold mb-1">{currencyFormat.format(summary.savings)}</div>
              <div className="text-orange-100 font-semibold">Economia no período</div>
              <div className="text-sm text-orange-100/80 mt-3">
                {currencyFormat.format(summary.annualizedSavings)} projetados em 12 meses
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-2xl p-7 shadow-lg">
              <ArrowDownRight className="w-8 h-8 mb-4 text-emerald-400" />
              <div className="text-4xl font-bold mb-1">
                {percentFormat.format(summary.savingsRate)}
              </div>
              <div className="text-gray-300 font-semibold">Redução do custo total</div>
              <div className="text-sm text-gray-400 mt-3">
                {currencyFormat.format(summary.comumCost)} → {currencyFormat.format(summary.escortCost)}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-md">
              <Receipt className="w-8 h-8 mb-4 text-orange-600" />
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {currencyFormat.format(summary.savingsPerShipment)}
              </div>
              <div className="text-gray-700 font-semibold">Economia por embarque</div>
              <div className="text-sm text-gray-500 mt-3">
                Média de {integerFormat.format(summary.shipments)} embarques no período
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-md">
              <ShieldCheck className="w-8 h-8 mb-4 text-emerald-600" />
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {currencyFormat.format(
                  summary.componentSavings.find((item) => item.component.id === "losses")?.delta ?? 0,
                )}
              </div>
              <div className="text-gray-700 font-semibold">Perdas evitadas</div>
              <div className="text-sm text-gray-500 mt-3">
                Menor exposição a roubo e avaria com escolta e monitoramento
              </div>
            </div>
          </div>

          {/* Custo por embarque em cada rota */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Custo por embarque em cada rota</h2>
                <p className="text-gray-600">
                  Custo total de um embarque médio, da coleta à entrega, nas duas modalidades.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Maior ganho: <span className="font-bold text-orange-600">{bestLane.label}</span>, com{" "}
                {percentFormat.format(bestLane.savingsRate)} de redução
              </div>
            </div>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={laneChartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    stroke="#6b7280"
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#6b7280"
                    width={72}
                    tickFormatter={(value: number) => compactCurrencyFormat.format(value)}
                  />
                  <Tooltip<number, string>
                    content={<CurrencyTooltip />}
                    cursor={{ fill: "rgba(15, 23, 42, 0.05)" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 12 }} />
                  <Bar
                    dataKey="comum"
                    name={modalities.comum.label}
                    fill="#94a3b8"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={42}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="escort"
                    name={modalities.escort.label}
                    fill="#ea580c"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={42}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Economia mês a mês */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Economia mês a mês</h2>
                <p className="text-gray-600">
                  Diferença de custo aplicada ao volume real embarcado, com o acumulado do período.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Acumulado:{" "}
                <span className="font-bold text-emerald-700">
                  {currencyFormat.format(results[results.length - 1]?.cumulativeSavings ?? 0)}
                </span>
              </div>
            </div>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={results} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#6b7280" />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    stroke="#6b7280"
                    width={72}
                    tickFormatter={(value: number) => compactCurrencyFormat.format(value)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    stroke="#9ca3af"
                    width={72}
                    tickFormatter={(value: number) => compactCurrencyFormat.format(value)}
                  />
                  <Tooltip<number, string>
                    content={<CurrencyTooltip />}
                    cursor={{ fill: "rgba(234, 88, 12, 0.08)" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 12 }} />
                  <Bar
                    yAxisId="left"
                    dataKey="savings"
                    name="Economia do mês"
                    fill="#ea580c"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={54}
                    isAnimationActive={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumulativeSavings"
                    name="Acumulado"
                    stroke="#0f172a"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Composição do custo */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Onde a diferença aparece</h2>
            <p className="text-gray-600 mb-6">
              Composição do custo total do período nas duas modalidades. A tarifa do Frete Escort é
              maior, mas seguro, perdas e multas caem mais do que ela sobe.
            </p>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={componentChartData}
                  layout="vertical"
                  margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    stroke="#6b7280"
                    tickFormatter={(value: number) => compactCurrencyFormat.format(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="modality"
                    tickLine={false}
                    axisLine={false}
                    stroke="#374151"
                    width={110}
                  />
                  <Tooltip<number, string>
                    content={<CurrencyTooltip showTotal />}
                    cursor={{ fill: "rgba(15, 23, 42, 0.05)" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 12 }} />
                  {costComponents.map((component, index) => (
                    <Bar
                      key={component.id}
                      dataKey={component.id}
                      name={component.label}
                      stackId="cost"
                      fill={component.color}
                      maxBarSize={64}
                      isAnimationActive={false}
                      radius={
                        index === costComponents.length - 1
                          ? ([0, 6, 6, 0] as [number, number, number, number])
                          : undefined
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {summary.componentSavings.map((item) => (
                <div key={item.component.id} className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.component.color }}
                      aria-hidden
                    />
                    <span className="font-semibold text-gray-900 text-sm">
                      {item.component.label}
                    </span>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      item.delta >= 0 ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {item.delta >= 0 ? "−" : "+"}
                    {currencyFormat.format(Math.abs(item.delta))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{item.component.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulador */}
          <div className="bg-gray-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-7 h-7 text-orange-400" />
              <div>
                <h2 className="text-2xl font-bold">Simulador de economia</h2>
                <p className="text-gray-400">
                  Ajuste a operação do cliente e veja o impacto no custo total.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-5">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-300">Rota de referência</span>
                  <select
                    value={simulationLaneId}
                    onChange={(event) => applyLanePreset(event.target.value)}
                    className="mt-2 w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {lanes.map((lane) => (
                      <option key={lane.id} value={lane.id} className="text-gray-900">
                        {lane.origin} → {lane.destination}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-gray-300">
                    Embarques por mês: {integerFormat.format(simulationShipments)}
                  </span>
                  <input
                    type="range"
                    min={10}
                    max={600}
                    step={10}
                    value={simulationShipments}
                    onChange={(event) => setSimulationShipments(Number(event.target.value))}
                    className="mt-3 w-full accent-orange-500"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-gray-300">
                    Valor médio da carga: {currencyFormat.format(simulationCargoValue)}
                  </span>
                  <input
                    type="range"
                    min={20000}
                    max={600000}
                    step={1000}
                    value={simulationCargoValue}
                    onChange={(event) => setSimulationCargoValue(Number(event.target.value))}
                    className="mt-3 w-full accent-orange-500"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-gray-300">
                    Distância média: {integerFormat.format(simulationDistance)} km
                  </span>
                  <input
                    type="range"
                    min={100}
                    max={2500}
                    step={1}
                    value={simulationDistance}
                    onChange={(event) => setSimulationDistance(Number(event.target.value))}
                    className="mt-3 w-full accent-orange-500"
                  />
                </label>
              </div>

              <div className="rounded-xl bg-white/10 p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">{modalities.comum.label}</div>
                    <div className="text-2xl font-bold">
                      {preciseCurrencyFormat.format(simulation.comum.total)}
                    </div>
                    <div className="text-xs text-gray-400">por embarque</div>
                  </div>
                  <div>
                    <div className="text-sm text-orange-300 mb-1">{modalities.escort.label}</div>
                    <div className="text-2xl font-bold text-orange-300">
                      {preciseCurrencyFormat.format(simulation.escort.total)}
                    </div>
                    <div className="text-xs text-gray-400">por embarque</div>
                  </div>
                </div>

                <div className="border-t border-white/15 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Economia por embarque</span>
                    <span className="font-bold text-emerald-400">
                      {preciseCurrencyFormat.format(simulation.perShipment)} (
                      {percentFormat.format(simulation.rate)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Economia por mês</span>
                    <span className="font-bold text-emerald-400">
                      {currencyFormat.format(simulation.monthly)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold text-white">Economia em 12 meses</span>
                    <span className="font-bold text-emerald-400">
                      {currencyFormat.format(simulation.annual)}
                    </span>
                  </div>
                </div>

                {simulation.perShipment <= 0 && (
                  <p className="mt-5 text-sm text-orange-200">
                    Nesta configuração o frete comum sai na frente: cargas de baixo valor em rotas
                    longas diluem o ganho de seguro e sinistro, que é o que paga o Frete Escort.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Detalhamento por rota */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Detalhamento por rota</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-3 pr-4 font-semibold">Rota</th>
                    <th className="py-3 pr-4 font-semibold text-right">Km</th>
                    <th className="py-3 pr-4 font-semibold text-right">Valor da carga</th>
                    <th className="py-3 pr-4 font-semibold text-right">Comum</th>
                    <th className="py-3 pr-4 font-semibold text-right">Escort</th>
                    <th className="py-3 pr-4 font-semibold text-right">Economia</th>
                    <th className="py-3 font-semibold text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {laneChartData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 pr-4 font-semibold text-gray-900">
                        {row.lane.origin} → {row.lane.destination}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-600">
                        {integerFormat.format(row.lane.distanceKm)}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-600">
                        {currencyFormat.format(row.lane.avgCargoValue)}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-600">
                        {currencyFormat.format(row.comum)}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-600">
                        {currencyFormat.format(row.escort)}
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold text-emerald-700">
                        {currencyFormat.format(row.savings)}
                      </td>
                      <td className="py-3 text-right font-semibold text-orange-600">
                        {percentFormat.format(row.savingsRate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-6 leading-relaxed">
              <span className="font-semibold text-gray-700">Premissas do modelo:</span> frete comum a{" "}
              {preciseCurrencyFormat.format(modalities.comum.ratePerKm)}/km com{" "}
              {percentFormat.format(modalities.comum.emptyKmShare)} de km improdutivo, ad valorem de{" "}
              {percentFormat.format(modalities.comum.adValoremRate)}, sinistro em{" "}
              {percentFormat.format(modalities.comum.incidentRate)} dos embarques com{" "}
              {percentFormat.format(modalities.comum.incidentRecovery)} de recuperação e{" "}
              {percentFormat.format(modalities.comum.delayRate)} de atrasos com multa. Frete Escort a{" "}
              {preciseCurrencyFormat.format(modalities.escort.ratePerKm)}/km com{" "}
              {percentFormat.format(modalities.escort.emptyKmShare)} de km improdutivo, ad valorem de{" "}
              {percentFormat.format(modalities.escort.adValoremRate)}, sinistro em{" "}
              {percentFormat.format(modalities.escort.incidentRate)} dos embarques com{" "}
              {percentFormat.format(modalities.escort.incidentRecovery)} de recuperação,{" "}
              {percentFormat.format(modalities.escort.delayRate)} de atrasos e{" "}
              {currencyFormat.format(modalities.escort.managementFee)} de gestão e tecnologia por
              embarque. Ajuste esses parâmetros em{" "}
              <span className="font-mono">src/app/data/freightCost.ts</span> para refletir os
              contratos vigentes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
