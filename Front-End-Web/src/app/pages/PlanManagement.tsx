import { useState } from "react";
import { Link } from "react-router";
import { CalendarClock, FileText, KeyRound, Receipt, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { useAuth } from "../auth/AuthContext";
import { cancelPremium, getSubscription, PREMIUM_PRICE, type InvoiceStatus } from "../lib/subscription";

const statusLabels: Record<InvoiceStatus, string> = {
  paid: "Paga",
  pending: "Pendente",
  failed: "Falhou",
};

const statusClasses: Record<InvoiceStatus, string> = {
  paid: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PlanManagement() {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);

  if (!user) return null;

  const subscription = getSubscription(user.email);
  const isPremium = subscription.plan === "premium";

  const handleCancel = () => {
    if (!window.confirm("Cancelar a assinatura Premium? A empresa voltara ao plano Gratuito.")) return;
    cancelPremium(user.email);
    setVersion((current) => current + 1);
  };

  return (
    <div key={version}>
      <PageHero
        eyebrow="Gestao de Planos"
        title="Plano atual, faturas e historico de pagamentos"
        description="Acompanhe o status da assinatura da sua empresa e consulte todas as cobrancas realizadas."
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
            <aside className="space-y-6">
              <div className={`rounded-2xl shadow-xl p-6 text-white ${isPremium ? "bg-gray-900" : "bg-gray-500"}`}>
                <div className="flex items-center gap-3 mb-3">
                  {isPremium ? <Sparkles className="w-6 h-6 text-orange-400" /> : <ShieldCheck className="w-6 h-6" />}
                  <h3 className="text-xl font-bold">Plano {isPremium ? "Premium" : "Gratuito"}</h3>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {isPremium ? formatCurrency(PREMIUM_PRICE) : "R$ 0"}
                  <span className="text-base font-normal text-gray-300">/mes</span>
                </div>
                <div className="text-sm text-gray-200 mb-1">Cliente desde {formatDate(subscription.since)}</div>
                {isPremium && subscription.renewsAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-200 mt-3">
                    <CalendarClock className="w-4 h-4" />
                    Proxima renovacao em {formatDate(subscription.renewsAt)}
                  </div>
                )}
              </div>

              {isPremium ? (
                <div className="bg-white border-2 border-gray-100 rounded-xl p-5 space-y-3">
                  <Link
                    to="/chaves-api"
                    className="flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                  >
                    <KeyRound className="w-5 h-5" />
                    Gerenciar chaves de API
                  </Link>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-200 text-red-600 px-4 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Cancelar assinatura
                  </button>
                </div>
              ) : (
                <Link
                  to="/checkout-assinatura"
                  className="flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Fazer upgrade para Premium
                </Link>
              )}
            </aside>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                <Receipt className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">Faturas e historico de pagamentos</h2>
              </div>

              {subscription.invoices.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                  <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  Nenhuma fatura emitida ate o momento.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                      <tr>
                        <th className="px-6 py-3">Fatura</th>
                        <th className="px-6 py-3">Data</th>
                        <th className="px-6 py-3">Descricao</th>
                        <th className="px-6 py-3">Valor</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subscription.invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-6 py-4 font-bold text-gray-900">{invoice.id}</td>
                          <td className="px-6 py-4 text-gray-600">{formatDate(invoice.date)}</td>
                          <td className="px-6 py-4 text-gray-600">{invoice.description}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(invoice.amount)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClasses[invoice.status]}`}>
                              {statusLabels[invoice.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
