import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  Barcode,
  Check,
  CreditCard,
  Download,
  FileText,
  QrCode,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { PageHero } from "../components/PageHero";
import { useSubscription } from "../billing/SubscriptionContext";
import {
  cyclePrice,
  invoiceStatusLabels,
  invoices,
  planList,
  plans,
  usageMetrics,
  type InvoiceStatus,
  type PaymentMethodId,
} from "../data/billing";

const currencyFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const integerFormat = new Intl.NumberFormat("pt-BR");

const methodIcons: Record<PaymentMethodId, typeof CreditCard> = {
  cartao: CreditCard,
  pix: QrCode,
  boleto: Barcode,
};
const methodLabels: Record<PaymentMethodId, string> = {
  cartao: "Cartão de crédito",
  pix: "PIX",
  boleto: "Boleto",
};

const statusFilters = [
  { id: "all", label: "Todas" },
  { id: "paga", label: "Pagas" },
  { id: "aberta", label: "Em aberto" },
  { id: "vencida", label: "Vencidas" },
  { id: "estornada", label: "Estornadas" },
] as const;

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function formatPeriod(period: string) {
  const [year, month] = period.split("-");
  const names = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  return `${names[Number(month) - 1]}/${year}`;
}

export function PlanManagement() {
  const { subscription, isPremium, cancelSubscription, resumeSubscription, downgradeToFree } = useSubscription();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const currentPlan = plans[subscription.planId];

  const visibleInvoices = useMemo(() => {
    const term = query.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
      const matchesQuery =
        !term ||
        invoice.id.toLowerCase().includes(term) ||
        invoice.description.toLowerCase().includes(term);
      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter]);

  const totals = useMemo(() => {
    const paid = invoices.filter((invoice) => invoice.status === "paga");
    return {
      paidCount: paid.length,
      paidAmount: paid.reduce((sum, invoice) => sum + invoice.amount, 0),
      openAmount: invoices
        .filter((invoice) => invoice.status === "aberta" || invoice.status === "vencida")
        .reduce((sum, invoice) => sum + invoice.amount, 0),
    };
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Financeiro"
        title="Gestão de planos e faturas"
        description="Acompanhe o plano contratado, o consumo do mês, as faturas emitidas e o histórico de pagamentos."
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Plano atual */}
          <div className="grid xl:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-sm font-bold text-orange-600 mb-1">Plano atual</div>
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    {currentPlan.name}
                    {isPremium && <Sparkles className="w-6 h-6 text-orange-500" />}
                  </h2>
                  <p className="text-gray-600 mt-1">{currentPlan.tagline}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {currencyFormat.format(cyclePrice(subscription.planId, subscription.cycle))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isPremium ? `por ciclo ${subscription.cycle}` : "sem custo"}
                  </div>
                </div>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-amber-900">Cancelamento agendado</div>
                    <p className="text-sm text-amber-800">
                      O Premium fica ativo até {formatDate(subscription.renewsAt)}. Depois disso a conta volta ao
                      plano gratuito e as chaves de API deixam de responder.
                    </p>
                    <button
                      type="button"
                      onClick={resumeSubscription}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-amber-900 hover:text-amber-950"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reativar renovação automática
                    </button>
                  </div>
                </div>
              )}

              {/* Consumo */}
              <h3 className="font-bold text-gray-900 mb-4">Consumo do mês</h3>
              <div className="space-y-4">
                {usageMetrics.map((metric) => {
                  const limit = metric.limitOf(currentPlan.limits);
                  const ratio = limit > 0 ? Math.min(metric.used / limit, 1) : 0;
                  const nearLimit = ratio >= 0.8;

                  return (
                    <div key={metric.id}>
                      <div className="flex justify-between items-baseline text-sm mb-1.5">
                        <span className="font-bold text-gray-700">{metric.label}</span>
                        <span className={nearLimit ? "text-amber-700 font-bold" : "text-gray-600"}>
                          {limit > 0
                            ? `${integerFormat.format(metric.used)} de ${integerFormat.format(limit)} ${metric.unit}`
                            : `indisponível no plano ${currentPlan.name}`}
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            limit === 0 ? "bg-gray-300" : nearLimit ? "bg-amber-500" : "bg-orange-600"
                          }`}
                          style={{ width: `${limit === 0 ? 100 : ratio * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cobrança */}
            <aside className="space-y-6 xl:sticky xl:top-28">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Cobrança</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Próxima cobrança</dt>
                    <dd className="font-bold text-gray-900">{formatDate(subscription.renewsAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Ciclo</dt>
                    <dd className="font-bold text-gray-900 capitalize">{subscription.cycle}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Forma de pagamento</dt>
                    <dd className="font-bold text-gray-900">
                      {subscription.method ? methodLabels[subscription.method] : "—"}
                    </dd>
                  </div>
                  {subscription.cardLast4 && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Cartão</dt>
                      <dd className="font-bold text-gray-900">
                        {subscription.cardBrand} •••• {subscription.cardLast4}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-3">
                    <dt className="text-gray-500">Em aberto</dt>
                    <dd className="font-bold text-gray-900">{currencyFormat.format(totals.openAmount)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Pago em {totals.paidCount} faturas</dt>
                    <dd className="font-bold text-gray-900">{currencyFormat.format(totals.paidAmount)}</dd>
                  </div>
                </dl>

                {isPremium ? (
                  <div className="mt-6 space-y-2">
                    <Link
                      to="/chaves-api"
                      className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                    >
                      Gerenciar chaves de API
                    </Link>
                    {!subscription.cancelAtPeriodEnd &&
                      (confirmingCancel ? (
                        <div className="border-2 border-red-200 rounded-lg p-3">
                          <p className="text-sm text-gray-700 mb-3">
                            Cancelar a renovação? O plano segue ativo até o fim do período pago.
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                cancelSubscription();
                                setConfirmingCancel(false);
                              }}
                              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors"
                            >
                              Sim, cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingCancel(false)}
                              className="flex-1 border-2 border-gray-300 text-gray-700 px-3 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
                            >
                              Manter
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmingCancel(true)}
                          className="w-full border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                        >
                          Cancelar assinatura
                        </button>
                      ))}
                  </div>
                ) : (
                  <Link
                    to="/assinatura"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                  >
                    Migrar para o Premium
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </aside>
          </div>

          {/* Comparativo de planos */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Planos disponíveis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {planList.map((plan) => {
                const isCurrent = plan.id === subscription.planId;
                return (
                  <div
                    key={plan.id}
                    className={`border-2 rounded-xl p-6 ${
                      isCurrent ? "border-orange-500 bg-orange-50/40" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      {isCurrent && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-600 text-white">
                          PLANO ATUAL
                        </span>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {plan.monthlyPrice === 0 ? "Grátis" : currencyFormat.format(plan.monthlyPrice)}
                      {plan.monthlyPrice > 0 && (
                        <span className="text-sm font-normal text-gray-500">/mês</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-5">{plan.tagline}</p>

                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {plan.missing.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-400">
                          <X className="w-4 h-4 mt-0.5 shrink-0" />
                          <span className="line-through">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {!isCurrent &&
                      (plan.id === "premium" ? (
                        <Link
                          to="/assinatura"
                          className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                        >
                          Fazer upgrade
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={downgradeToFree}
                          className="w-full border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                        >
                          Voltar ao gratuito
                        </button>
                      ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Faturas */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Faturas e histórico</h2>
                <p className="text-gray-600">{visibleInvoices.length} de {invoices.length} faturas exibidas.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por número ou descrição"
                    aria-label="Buscar faturas"
                    className="pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusFilters.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setStatusFilter(filter.id)}
                      className={`px-3 py-2 rounded-lg font-bold text-sm transition-colors ${
                        statusFilter === filter.id
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left font-bold px-6 py-3">Fatura</th>
                    <th className="text-left font-bold px-6 py-3">Competência</th>
                    <th className="text-left font-bold px-6 py-3">Vencimento</th>
                    <th className="text-left font-bold px-6 py-3">Pagamento</th>
                    <th className="text-right font-bold px-6 py-3">Valor</th>
                    <th className="text-left font-bold px-6 py-3">Status</th>
                    <th className="text-right font-bold px-6 py-3">PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleInvoices.map((invoice) => {
                    const status = invoiceStatusLabels[invoice.status];
                    const MethodIcon = methodIcons[invoice.method];

                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{invoice.id}</div>
                          <div className="text-gray-500">{invoice.description}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 capitalize">{formatPeriod(invoice.period)}</td>
                        <td className="px-6 py-4 text-gray-700">{formatDate(invoice.dueAt)}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-gray-700">
                            <MethodIcon className="w-4 h-4 text-gray-400" />
                            {formatDate(invoice.paidAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                          {currencyFormat.format(invoice.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            aria-label={`Baixar PDF da fatura ${invoice.id}`}
                            className="inline-flex items-center gap-1.5 text-orange-600 font-bold hover:text-orange-700"
                          >
                            <Download className="w-4 h-4" />
                            Baixar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {visibleInvoices.length === 0 && (
                <div className="p-12 text-center">
                  <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="font-bold text-gray-900">Nenhuma fatura encontrada</p>
                  <p className="text-gray-600 text-sm">Ajuste a busca ou o filtro de status.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
