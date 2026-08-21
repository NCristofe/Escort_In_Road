import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import {
  Building2,
  Car,
  Download,
  FileText,
  Fuel,
  Gauge,
  Leaf,
  Target,
  TreePine,
  TrendingDown,
} from "lucide-react";
import { PageHero } from "../components/PageHero";
import {
  BASELINE_KM_PER_LITER,
  DIESEL_EMISSION_FACTOR_KG_PER_LITER,
  TREE_ABSORPTION_KG_PER_YEAR,
  clientCompanies,
  esgSeries,
  esgTargets,
  initiatives,
  litersToCo2Tons,
  scaleSeries,
  summarize,
  type EsgMonth,
} from "../data/esg";
import { generateEsgReport } from "../reports/esgReportPdf";

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
/** O fator de emissão precisa das duas casas: 2,68 e não 2,7. */
const factorFormat = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currentYear = esgSeries[esgSeries.length - 1].key.slice(0, 4);

const periods = [
  { id: "12m", label: "Últimos 12 meses" },
  { id: "6m", label: "Últimos 6 meses" },
  { id: "ytd", label: `Ano ${currentYear}` },
] as const;

type PeriodId = (typeof periods)[number]["id"];

function selectPeriod(periodId: PeriodId): EsgMonth[] {
  if (periodId === "6m") return esgSeries.slice(-6);
  if (periodId === "ytd") return esgSeries.filter((month) => month.key.startsWith(currentYear));
  return esgSeries;
}

type ChartPoint = EsgMonth & {
  /** Acumulado dentro do período selecionado, não da série inteira. */
  periodCo2Tons: number;
  periodDieselLiters: number;
};

type ValueTooltipProps = TooltipProps<number, string> & {
  unit?: string;
  decimals?: number;
};

function ValueTooltip({ active, payload, label, unit = "", decimals = 0 }: ValueTooltipProps) {
  if (!active || !payload?.length) return null;

  const format = decimals > 0 ? decimalFormat : integerFormat;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <div className="mb-2 text-sm font-bold text-gray-900">{label}</div>
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={String(entry.dataKey)} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden
            />
            <span className="text-gray-600">{entry.name}</span>
            <span className="ml-auto font-bold text-gray-900">
              {format.format(Number(entry.value ?? 0))} {unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EsgDashboard() {
  const [periodId, setPeriodId] = useState<PeriodId>("12m");
  const [companyId, setCompanyId] = useState("consolidado");
  const [exporting, setExporting] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const company = useMemo(
    () => clientCompanies.find((item) => item.id === companyId) ?? null,
    [companyId],
  );
  const operationShare = company?.operationShare ?? 1;

  const series = useMemo(
    () => scaleSeries(selectPeriod(periodId), operationShare),
    [operationShare, periodId],
  );
  const summary = useMemo(
    () => summarize(series, esgTargets.annualDieselLiters * operationShare),
    [operationShare, series],
  );

  const periodLabel = useMemo(() => {
    const label = periods.find((period) => period.id === periodId)?.label ?? "";
    return series.length ? `${label} (${series[0].label} a ${series[series.length - 1].label})` : label;
  }, [periodId, series]);

  const chartData = useMemo<ChartPoint[]>(() => {
    let liters = 0;
    return series.map((month) => {
      liters += month.dieselSavedLiters;
      return {
        ...month,
        periodDieselLiters: liters,
        periodCo2Tons: Number(litersToCo2Tons(liters).toFixed(1)),
      };
    });
  }, [series]);

  const initiativeData = useMemo(
    () =>
      initiatives
        .map((initiative) => ({
          ...initiative,
          liters: summary.savingsByInitiative[initiative.id],
          co2Tons: Number(litersToCo2Tons(summary.savingsByInitiative[initiative.id]).toFixed(1)),
          share: summary.dieselSavedLiters
            ? summary.savingsByInitiative[initiative.id] / summary.dieselSavedLiters
            : 0,
        }))
        .sort((a, b) => b.liters - a.liters),
    [summary],
  );

  const bestMonth = useMemo(
    () =>
      series.reduce((best, month) =>
        month.co2AvoidedTons > best.co2AvoidedTons ? month : best,
      ),
    [series],
  );

  const monthsAboveTarget = series.filter(
    (month) => month.dieselSavedLiters >= esgTargets.monthlyDieselLiters,
  ).length;

  const targetProgress = Math.min(summary.targetProgress, 1);

  async function handleExport() {
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const rows = series.map((month) => ({
        "Mês": month.label,
        "Km rodados": month.kmTraveled,
        "Diesel linha de base (L)": month.dieselBaselineLiters,
        "Diesel consumido (L)": month.dieselConsumedLiters,
        "Diesel economizado (L)": month.dieselSavedLiters,
        "CO2 evitado (t)": month.co2AvoidedTons,
        "Eficiência (km/L)": month.kmPerLiter,
        ...Object.fromEntries(
          initiatives.map((initiative) => [
            `${initiative.label} (L)`,
            month.savingsByInitiative[initiative.id],
          ]),
        ),
      }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "Mensal");
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet([
          { Indicador: "Período (meses)", Valor: summary.months },
          { Indicador: "CO2 evitado (t)", Valor: summary.co2AvoidedTons },
          { Indicador: "Diesel economizado (L)", Valor: summary.dieselSavedLiters },
          { Indicador: "Redução sobre a linha de base (%)", Valor: Number((summary.savingsRate * 100).toFixed(1)) },
          { Indicador: "Eficiência média (km/L)", Valor: summary.kmPerLiter },
          { Indicador: "Fator de emissão (kg CO2/L)", Valor: DIESEL_EMISSION_FACTOR_KG_PER_LITER },
        ]),
        "Resumo",
      );
      XLSX.writeFile(workbook, `relatorio-esg-${companyId}-${periodId}.xlsx`);
    } finally {
      setExporting(false);
    }
  }

  async function handleGeneratePdf() {
    setGeneratingPdf(true);
    try {
      await generateEsgReport({ company, periodLabel, series, summary });
    } finally {
      setGeneratingPdf(false);
    }
  }

  return (
    <div>
      <PageHero
        eyebrow="ESG"
        title="Painel de impacto ambiental"
        description="Toneladas de CO2 evitadas e litros de diesel economizados pela operação, medidos mês a mês contra a linha de base da frota."
      />

      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtros e exportação */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setPeriodId(period.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    periodId === period.id
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" aria-hidden />
                <span className="sr-only">Empresa</span>
                <select
                  value={companyId}
                  onChange={(event) => setCompanyId(event.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="consolidado">Operação consolidada</option>
                  {clientCompanies.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleGeneratePdf}
                  disabled={generatingPdf}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-60"
                >
                  <FileText className="w-4 h-4" />
                  {generatingPdf ? "Gerando PDF..." : "Gerar PDF"}
                </button>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  <Download className="w-4 h-4" />
                  {exporting ? "Gerando..." : "Exportar XLSX"}
                </button>
              </div>
            </div>
          </div>

          {company && (
            <div className="mb-8 flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-bold text-gray-900">{company.name}</div>
                <div className="text-sm text-gray-600">
                  {company.segment} • CNPJ {company.document} • Cliente desde {company.since}
                </div>
              </div>
              <div className="text-sm text-emerald-800">
                {percentFormat.format(company.operationShare)} do volume transportado no período
              </div>
            </div>
          )}

          {/* Indicadores principais */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-10">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl p-7 shadow-lg">
              <Leaf className="w-8 h-8 mb-4 text-emerald-100" />
              <div className="text-4xl font-bold mb-1">
                {decimalFormat.format(summary.co2AvoidedTons)} t
              </div>
              <div className="text-emerald-100 font-semibold">CO2 evitado no período</div>
              <div className="text-sm text-emerald-100/80 mt-3">
                {integerFormat.format(summary.equivalentTrees)} árvores absorvendo por um ano
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-2xl p-7 shadow-lg">
              <Fuel className="w-8 h-8 mb-4 text-orange-400" />
              <div className="text-4xl font-bold mb-1">
                {integerFormat.format(summary.dieselSavedLiters)} L
              </div>
              <div className="text-gray-300 font-semibold">Diesel economizado</div>
              <div className="text-sm text-gray-400 mt-3">
                Contra {integerFormat.format(summary.dieselBaselineLiters)} L da linha de base
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-md">
              <TrendingDown className="w-8 h-8 mb-4 text-emerald-600" />
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {percentFormat.format(summary.savingsRate)}
              </div>
              <div className="text-gray-700 font-semibold">Redução de consumo</div>
              <div className="text-sm text-gray-500 mt-3">
                {integerFormat.format(summary.kmTraveled)} km rodados no período
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-md">
              <Gauge className="w-8 h-8 mb-4 text-orange-600" />
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {decimalFormat.format(summary.kmPerLiter)} km/L
              </div>
              <div className="text-gray-700 font-semibold">Eficiência média</div>
              <div className="text-sm text-gray-500 mt-3">
                Linha de base: {decimalFormat.format(BASELINE_KM_PER_LITER)} km/L
              </div>
            </div>
          </div>

          {/* Toneladas de CO2 evitadas */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Toneladas de CO2 evitadas</h2>
                <p className="text-gray-600">
                  Emissões que deixaram de ocorrer a cada mês e o acumulado do período.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Melhor mês: <span className="font-bold text-emerald-700">{bestMonth.label}</span> com{" "}
                {decimalFormat.format(bestMonth.co2AvoidedTons)} t
              </div>
            </div>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#6b7280" />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    stroke="#6b7280"
                    width={48}
                    unit=" t"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    stroke="#9ca3af"
                    width={56}
                    unit=" t"
                  />
                  <Tooltip<number, string>
                    content={<ValueTooltip unit="t" decimals={1} />}
                    cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 12 }} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="co2AvoidedTons"
                    name="CO2 evitado no mês"
                    stroke="#059669"
                    strokeWidth={3}
                    fill="url(#co2Gradient)"
                    dot={{ r: 3, fill: "#059669" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="periodCo2Tons"
                    name="Acumulado do período"
                    stroke="#0f172a"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Litros de diesel economizados */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Litros de diesel economizados</h2>
                <p className="text-gray-600">
                  Diferença entre o consumo previsto pela linha de base e o consumo realizado.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {monthsAboveTarget} de {summary.months} meses acima da meta de{" "}
                {integerFormat.format(esgTargets.monthlyDieselLiters)} L
              </div>
            </div>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#6b7280" />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#6b7280"
                    width={64}
                    tickFormatter={(value: number) => integerFormat.format(value)}
                  />
                  <Tooltip<number, string>
                    content={<ValueTooltip unit="L" />}
                    cursor={{ fill: "rgba(234, 88, 12, 0.08)" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 12 }} />
                  <ReferenceLine
                    y={esgTargets.monthlyDieselLiters}
                    stroke="#0f172a"
                    strokeDasharray="6 4"
                    label={{
                      value: `Meta ${integerFormat.format(esgTargets.monthlyDieselLiters)} L`,
                      position: "insideTopRight",
                      fill: "#0f172a",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="dieselSavedLiters"
                    name="Diesel economizado"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={54}
                  >
                    {chartData.map((month) => (
                      <Cell
                        key={month.key}
                        fill={
                          month.dieselSavedLiters >= esgTargets.monthlyDieselLiters
                            ? "#ea580c"
                            : "#fdba74"
                        }
                      />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 rounded-xl bg-gray-50 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <Target className="w-5 h-5 text-emerald-600" />
                  Meta anual de {integerFormat.format(esgTargets.annualDieselLiters)} L
                </div>
                <span className="font-bold text-emerald-700">
                  {percentFormat.format(summary.targetProgress)}
                </span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${targetProgress * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Equivale a {decimalFormat.format(esgTargets.annualCo2Tons)} t de CO2 no ciclo completo.
              </p>
            </div>
          </div>

          {/* Origem da economia + equivalências */}
          <div className="grid gap-8 lg:grid-cols-5 mb-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Origem da economia</h2>
              <p className="text-gray-600 mb-6">
                Quanto cada iniciativa contribuiu para os litros economizados no período.
              </p>
              <div className="grid gap-6 sm:grid-cols-2 items-center">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={initiativeData}
                        dataKey="liters"
                        nameKey="label"
                        innerRadius={58}
                        outerRadius={92}
                        paddingAngle={2}
                        strokeWidth={0}
                        isAnimationActive={false}
                      >
                        {initiativeData.map((initiative) => (
                          <Cell key={initiative.id} fill={initiative.color} />
                        ))}
                      </Pie>
                      <Tooltip<number, string> content={<ValueTooltip unit="L" />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="space-y-3">
                  {initiativeData.map((initiative) => (
                    <li key={initiative.id}>
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: initiative.color }}
                          aria-hidden
                        />
                        <span className="font-semibold text-gray-900">{initiative.label}</span>
                        <span className="ml-auto text-gray-500">
                          {percentFormat.format(initiative.share)}
                        </span>
                      </div>
                      <div className="pl-5 text-sm text-gray-500">
                        {integerFormat.format(initiative.liters)} L •{" "}
                        {decimalFormat.format(initiative.co2Tons)} t CO2
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">O que isso representa</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 p-3 rounded-xl">
                    <TreePine className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {integerFormat.format(summary.equivalentTrees)}
                    </div>
                    <div className="text-gray-600 text-sm">
                      árvores adultas absorvendo CO2 durante um ano
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-50 p-3 rounded-xl">
                    <Car className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {integerFormat.format(summary.equivalentCars)}
                    </div>
                    <div className="text-gray-600 text-sm">
                      carros de passeio fora de circulação por um ano
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-xl">
                    <Fuel className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {integerFormat.format(Math.round(summary.dieselSavedLiters / 550))}
                    </div>
                    <div className="text-gray-600 text-sm">
                      tanques cheios de carreta que não precisaram ser abastecidos
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detalhamento mensal */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalhamento mensal</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-3 pr-4 font-semibold">Mês</th>
                    <th className="py-3 pr-4 font-semibold text-right">Km rodados</th>
                    <th className="py-3 pr-4 font-semibold text-right">Linha de base (L)</th>
                    <th className="py-3 pr-4 font-semibold text-right">Consumido (L)</th>
                    <th className="py-3 pr-4 font-semibold text-right">Economizado (L)</th>
                    <th className="py-3 pr-4 font-semibold text-right">CO2 evitado (t)</th>
                    <th className="py-3 font-semibold text-right">km/L</th>
                  </tr>
                </thead>
                <tbody>
                  {[...series].reverse().map((month) => (
                    <tr key={month.key} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 pr-4 font-semibold text-gray-900">{month.label}</td>
                      <td className="py-3 pr-4 text-right text-gray-600">
                        {integerFormat.format(month.kmTraveled)}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-600">
                        {integerFormat.format(month.dieselBaselineLiters)}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-600">
                        {integerFormat.format(month.dieselConsumedLiters)}
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold text-orange-600">
                        {integerFormat.format(month.dieselSavedLiters)}
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold text-emerald-700">
                        {decimalFormat.format(month.co2AvoidedTons)}
                      </td>
                      <td className="py-3 text-right text-gray-600">
                        {decimalFormat.format(month.kmPerLiter)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-6 leading-relaxed">
              <span className="font-semibold text-gray-700">Metodologia:</span> a linha de base usa a
              eficiência média da frota em {decimalFormat.format(BASELINE_KM_PER_LITER)} km/L. O CO2
              evitado converte os litros economizados pelo fator de emissão do diesel S10 de{" "}
              {factorFormat.format(DIESEL_EMISSION_FACTOR_KG_PER_LITER)} kg de CO2e por litro
              (escopo 1 do GHG Protocol). As equivalências consideram{" "}
              {integerFormat.format(TREE_ABSORPTION_KG_PER_YEAR)} kg de CO2 absorvidos por árvore ao
              ano.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
