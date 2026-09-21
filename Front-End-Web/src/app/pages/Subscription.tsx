import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { useAuth } from "../auth/AuthContext";
import { getSubscription, upgradeToPremium, PREMIUM_PRICE } from "../lib/subscription";

const freeFeatures = [
  "Cadastro de cargas ilimitado",
  "Rastreamento em tempo real",
  "Gestao de lotes basica",
];

const premiumFeatures = [
  "Tudo do plano Gratuito",
  "Painel de chaves de API para integracao com ERP",
  "Faturas e historico de pagamentos detalhados",
  "Suporte prioritario 24h",
];

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function Subscription() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const subscription = user ? getSubscription(user.email) : null;

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const isPremium = subscription?.plan === "premium";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const digitsOnly = cardNumber.replace(/\D/g, "");
    if (!cardName.trim()) {
      setError("Informe o nome impresso no cartao.");
      return;
    }
    if (digitsOnly.length < 16) {
      setError("Numero de cartao invalido.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Validade invalida. Use o formato MM/AA.");
      return;
    }
    if (cvv.trim().length < 3) {
      setError("CVV invalido.");
      return;
    }

    upgradeToPremium(user.email, { cardName, cardNumber, expiry, cvv });
    setSuccess(true);
  };

  return (
    <div>
      <PageHero
        eyebrow="Checkout de Assinatura"
        title="Faca upgrade para o plano Premium"
        description="Desbloqueie integracoes com ERP, faturas detalhadas e suporte prioritario para sua empresa."
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isPremium ? (
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl mx-auto">
              <ShieldCheck className="w-14 h-14 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sua empresa ja e Premium</h2>
              <p className="text-gray-600 mb-6">
                Aproveite o painel de chaves de API e acompanhe suas faturas na area de gestao de planos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/gestao-planos")}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                >
                  Ver gestao de planos
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/chaves-api")}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  Ir para chaves de API
                </button>
              </div>
            </div>
          ) : success ? (
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl mx-auto">
              <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade confirmado!</h2>
              <p className="text-gray-600 mb-6">
                Sua assinatura Premium esta ativa. A fatura ja esta disponivel na area de gestao de planos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/gestao-planos")}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                >
                  Ver faturas
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/chaves-api")}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  Gerar chave de API
                </button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
              <div className="grid gap-6">
                <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-gray-500" />
                    <h3 className="text-xl font-bold text-gray-900">Plano Gratuito</h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-4">R$ 0<span className="text-base font-normal text-gray-500">/mes</span></div>
                  <ul className="space-y-2">
                    {freeFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                    Recomendado
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-bold">Plano Premium</h3>
                  </div>
                  <div className="text-3xl font-bold mb-4">
                    R$ {PREMIUM_PRICE}<span className="text-base font-normal text-gray-300">/mes</span>
                  </div>
                  <ul className="space-y-2">
                    {premiumFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-gray-100">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-gray-900">Dados de pagamento</h3>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 font-semibold px-4 py-3 rounded-lg mb-5">{error}</div>
                )}

                <div className="grid gap-5">
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">Nome no cartao</span>
                    <input
                      value={cardName}
                      onChange={(event) => setCardName(event.target.value)}
                      placeholder="Como impresso no cartao"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">Numero do cartao</span>
                    <input
                      value={cardNumber}
                      onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Validade</span>
                      <input
                        value={expiry}
                        onChange={(event) => setExpiry(formatExpiry(event.target.value))}
                        placeholder="MM/AA"
                        inputMode="numeric"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">CVV</span>
                      <input
                        value={cvv}
                        onChange={(event) => setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="000"
                        inputMode="numeric"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="bg-orange-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Confirmar upgrade por R$ {PREMIUM_PRICE}/mes
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Ambiente de simulacao. Nenhum dado de cartao e enviado ou armazenado em servidores externos.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
