import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  AlertCircle,
  Barcode,
  Check,
  CreditCard,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { LoadingScreen } from "../components/LoadingScreen";
import { PageHero } from "../components/PageHero";
import { useSubscription } from "../billing/SubscriptionContext";
import {
  ANNUAL_DISCOUNT_RATE,
  cardBrandLabel,
  cvvLength,
  detectCardBrand,
  findCoupon,
  formatCardNumber,
  formatCnpj,
  formatExpiry,
  installmentOptions,
  isValidCardNumber,
  isValidCnpj,
  isValidExpiry,
  monthlyEquivalent,
  paymentMethods,
  plans,
  summarizeOrder,
  type BillingCycle,
  type Coupon,
  type PaymentMethodId,
} from "../data/billing";

const currencyFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percentFormat = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0 });

const inputClass =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600";
const invalidInputClass =
  "w-full px-4 py-3 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500";
const selectClass = inputClass;

const methodIcons: Record<PaymentMethodId, typeof CreditCard> = {
  cartao: CreditCard,
  pix: QrCode,
  boleto: Barcode,
};

type FormState = {
  companyName: string;
  cnpj: string;
  email: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

const emptyForm: FormState = {
  companyName: "",
  cnpj: "",
  email: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

export function SubscriptionCheckout() {
  const navigate = useNavigate();
  const { subscription, isPremium, upgrade } = useSubscription();

  const [cycle, setCycle] = useState<BillingCycle>("anual");
  const [method, setMethod] = useState<PaymentMethodId>("cartao");
  const [installments, setInstallments] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const premium = plans.premium;
  const brand = detectCardBrand(form.cardNumber);
  const summary = useMemo(
    () => summarizeOrder("premium", cycle, coupon, installments),
    [coupon, cycle, installments],
  );

  function updateField<K extends keyof FormState>(field: K, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function changeCycle(next: BillingCycle) {
    setCycle(next);
    // O parcelamento só existe no anual; voltar para o mensal reseta à vista.
    if (next === "mensal") setInstallments(1);
    if (coupon && !coupon.cycles.includes(next)) {
      setCoupon(null);
      setCouponError("O cupom aplicado não vale para este ciclo.");
    }
  }

  function applyCoupon() {
    const found = findCoupon(couponCode);
    if (!found) {
      setCoupon(null);
      setCouponError("Cupom inválido ou expirado.");
      return;
    }
    if (!found.cycles.includes(cycle)) {
      setCoupon(null);
      setCouponError(`O cupom ${found.code} só vale no ciclo anual.`);
      return;
    }
    setCoupon(found);
    setCouponError("");
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  }

  function validate() {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (form.companyName.trim().length < 3) next.companyName = "Informe a razão social.";
    if (!isValidCnpj(form.cnpj)) next.cnpj = "CNPJ inválido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = "E-mail inválido.";

    if (method === "cartao") {
      if (form.cardName.trim().length < 3) next.cardName = "Informe o nome impresso no cartão.";
      if (!isValidCardNumber(form.cardNumber)) next.cardNumber = "Número de cartão inválido.";
      if (!isValidExpiry(form.expiry)) next.expiry = "Validade inválida ou vencida.";
      if (form.cvv.replace(/\D/g, "").length !== cvvLength(brand)) {
        next.cvv = `O código de segurança tem ${cvvLength(brand)} dígitos.`;
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Simula a ida ao provedor de pagamento. Aqui entraria o token do PSP.
    await new Promise((resolve) => setTimeout(resolve, 900));

    const digits = form.cardNumber.replace(/\D/g, "");
    upgrade({
      planId: "premium",
      cycle,
      method,
      // Só os quatro últimos dígitos sobrevivem ao checkout.
      cardLast4: method === "cartao" ? digits.slice(-4) : undefined,
      cardBrand: method === "cartao" ? cardBrandLabel(brand) : undefined,
    });

    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div>
        <PageHero
          eyebrow="Assinatura confirmada"
          title="Bem-vindo ao Premium"
          description="Sua conta já está com todos os painéis e a integração por API liberados."
        />
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                <Check className="w-9 h-9 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento aprovado</h2>
              <p className="text-gray-600 mb-6">
                Cobramos {currencyFormat.format(summary.total)} no ciclo {cycle}
                {method === "cartao" && installments > 1 ? ` em ${installments}x` : ""}. O recibo foi enviado para{" "}
                <strong>{form.email}</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/planos"
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                >
                  Ver meu plano e faturas
                </Link>
                <Link
                  to="/chaves-api"
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Gerar chave de API
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isPremium && !subscription.cancelAtPeriodEnd) {
    return (
      <div>
        <PageHero
          eyebrow="Assinatura"
          title="Você já é Premium"
          description="Sua conta tem todos os painéis, relatórios e a integração por API liberados."
        />
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Sparkles className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Nada a contratar por aqui</h2>
              <p className="text-gray-600 mb-6">
                Para trocar o ciclo, atualizar o cartão ou baixar faturas, use a área de gestão de planos.
              </p>
              <Link
                to="/planos"
                className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
              >
                Ir para gestão de planos
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {submitting && (
        <LoadingScreen
          variant="overlay"
          message="Processando pagamento"
          detail="Não feche nem atualize esta página."
        />
      )}
      <PageHero
        eyebrow="Assinatura"
        title="Migre para o Premium"
        description="Libere os painéis ESG, o comparativo financeiro, os indicadores de frota e a integração com o seu ERP."
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="grid xl:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="space-y-6">
              {/* Ciclo de cobrança */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">1. Ciclo de cobrança</h2>
                <p className="text-gray-600 mb-5">O plano anual sai {percentFormat.format(ANNUAL_DISCOUNT_RATE)} mais barato.</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {(["mensal", "anual"] as const).map((option) => (
                    <label
                      key={option}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                        cycle === option ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="flex items-center gap-2 font-bold text-gray-900 capitalize">
                          <input
                            type="radio"
                            name="cycle"
                            checked={cycle === option}
                            onChange={() => changeCycle(option)}
                            className="accent-orange-600"
                          />
                          {option}
                        </span>
                        {option === "anual" && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                            -{percentFormat.format(ANNUAL_DISCOUNT_RATE)}
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {currencyFormat.format(monthlyEquivalent("premium", option))}
                        <span className="text-sm font-normal text-gray-500">/mês</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {option === "anual"
                          ? `${currencyFormat.format(summarizeOrder("premium", "anual", null, 1).total)} por ano`
                          : "cobrado todo mês"}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dados de faturamento */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-5">2. Dados de faturamento</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <label className="block md:col-span-2">
                    <span className="block text-sm font-bold text-gray-700 mb-2">Razão social *</span>
                    <input
                      value={form.companyName}
                      onChange={(event) => updateField("companyName", event.target.value)}
                      placeholder="Transportadora Exemplo Ltda"
                      autoComplete="organization"
                      className={errors.companyName ? invalidInputClass : inputClass}
                    />
                    <FieldError message={errors.companyName} />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">CNPJ *</span>
                    <input
                      value={form.cnpj}
                      onChange={(event) => updateField("cnpj", formatCnpj(event.target.value))}
                      placeholder="00.000.000/0000-00"
                      inputMode="numeric"
                      className={errors.cnpj ? invalidInputClass : inputClass}
                    />
                    <FieldError message={errors.cnpj} />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">E-mail de cobrança *</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="financeiro@empresa.com.br"
                      autoComplete="email"
                      className={errors.email ? invalidInputClass : inputClass}
                    />
                    <FieldError message={errors.email} />
                  </label>
                </div>
              </div>

              {/* Pagamento */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-5">3. Forma de pagamento</h2>

                <div className="grid sm:grid-cols-3 gap-3 mb-6">
                  {paymentMethods.map((option) => {
                    const Icon = methodIcons[option.id];
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setMethod(option.id)}
                        aria-pressed={method === option.id}
                        className={`text-left border-2 rounded-xl p-4 transition-colors ${
                          method === option.id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-orange-600 mb-2" />
                        <div className="font-bold text-gray-900 text-sm">{option.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{option.note}</div>
                      </button>
                    );
                  })}
                </div>

                {method === "cartao" && (
                  /*
                   * Captura de cartão em campos próprios serve ao protótipo. Antes de
                   * produção estes inputs precisam ser trocados pelos campos hospedados
                   * do provedor (Stripe Elements, Pagar.me, Iugu): assim o número nunca
                   * passa pelo nosso DOM nem pelo nosso servidor, e a empresa fica fora
                   * do escopo pesado de PCI-DSS. Nada aqui é persistido além dos 4 últimos.
                   */
                  <fieldset className="grid md:grid-cols-2 gap-5">
                    <legend className="sr-only">Dados do cartão de crédito</legend>

                    <label className="block md:col-span-2">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Nome impresso no cartão *</span>
                      <input
                        value={form.cardName}
                        onChange={(event) => updateField("cardName", event.target.value.toUpperCase())}
                        placeholder="MARIA S SOUZA"
                        autoComplete="cc-name"
                        className={errors.cardName ? invalidInputClass : inputClass}
                      />
                      <FieldError message={errors.cardName} />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Número do cartão *</span>
                      <div className="relative">
                        <input
                          value={form.cardNumber}
                          onChange={(event) => updateField("cardNumber", formatCardNumber(event.target.value))}
                          placeholder="0000 0000 0000 0000"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          className={errors.cardNumber ? invalidInputClass : inputClass}
                        />
                        {brand !== "desconhecida" && (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                            {cardBrandLabel(brand)}
                          </span>
                        )}
                      </div>
                      <FieldError message={errors.cardNumber} />
                    </label>

                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Validade *</span>
                      <input
                        value={form.expiry}
                        onChange={(event) => updateField("expiry", formatExpiry(event.target.value))}
                        placeholder="MM/AA"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        className={errors.expiry ? invalidInputClass : inputClass}
                      />
                      <FieldError message={errors.expiry} />
                    </label>

                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">
                        Código de segurança *
                      </span>
                      <input
                        value={form.cvv}
                        onChange={(event) =>
                          updateField("cvv", event.target.value.replace(/\D/g, "").slice(0, cvvLength(brand)))
                        }
                        placeholder={"0".repeat(cvvLength(brand))}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        className={errors.cvv ? invalidInputClass : inputClass}
                      />
                      <FieldError message={errors.cvv} />
                    </label>

                    {cycle === "anual" && (
                      <label className="block md:col-span-2">
                        <span className="block text-sm font-bold text-gray-700 mb-2">Parcelamento</span>
                        <select
                          value={installments}
                          onChange={(event) => setInstallments(Number(event.target.value))}
                          className={selectClass}
                        >
                          {installmentOptions(cycle).map((count) => (
                            <option key={count} value={count}>
                              {count}x de {currencyFormat.format(summary.total / count)} sem juros
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </fieldset>
                )}

                {method === "pix" && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <QrCode className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                    <p className="font-bold text-gray-900">O QR Code é gerado ao confirmar</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Você tem 30 minutos para pagar. A liberação é automática após a confirmação do banco.
                    </p>
                  </div>
                )}

                {method === "boleto" && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <Barcode className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                    <p className="font-bold text-gray-900">O boleto é enviado por e-mail</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Compensação em até 3 dias úteis. O plano é liberado assim que o pagamento cair.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Resumo do pedido */}
            <aside className="bg-white rounded-2xl shadow-xl p-6 xl:sticky xl:top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Resumo do pedido</h2>
              <p className="text-gray-600 mb-5">{premium.tagline}</p>

              <ul className="space-y-2 mb-6">
                {premium.features.slice(0, 5).map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Cupom de desconto</label>
                {coupon ? (
                  <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-green-700">
                      <Tag className="w-4 h-4" />
                      {coupon.code} · {coupon.label}
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      aria-label={`Remover cupom ${coupon.code}`}
                      className="text-green-700 hover:text-green-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(event) => {
                        setCouponCode(event.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="ESCORT10"
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
                <FieldError message={couponError} />
              </div>

              <dl className="space-y-2 border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <dt>Premium {cycle}</dt>
                  <dd>{currencyFormat.format(summary.listPrice)}</dd>
                </div>
                {summary.cycleDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <dt>Desconto do plano anual</dt>
                    <dd>-{currencyFormat.format(summary.cycleDiscount)}</dd>
                  </div>
                )}
                {summary.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <dt>Cupom {coupon?.code}</dt>
                    <dd>-{currencyFormat.format(summary.couponDiscount)}</dd>
                  </div>
                )}
                <div className="flex justify-between items-baseline border-t border-gray-200 pt-3 mt-1">
                  <dt className="font-bold text-gray-900">Total</dt>
                  <dd className="text-2xl font-bold text-gray-900">{currencyFormat.format(summary.total)}</dd>
                </div>
                {method === "cartao" && installments > 1 && (
                  <div className="flex justify-between text-gray-600">
                    <dt>Parcelado</dt>
                    <dd>
                      {installments}x de {currencyFormat.format(summary.installmentValue)}
                    </dd>
                  </div>
                )}
              </dl>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 bg-orange-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                {submitting ? "Processando..." : `Confirmar e pagar ${currencyFormat.format(summary.total)}`}
              </button>

              <p className="flex items-start gap-2 text-xs text-gray-500 mt-4">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                Conexão criptografada. Você pode cancelar quando quiser — o plano segue ativo até o fim do
                período já pago.
              </p>

              <button
                type="button"
                onClick={() => navigate("/planos")}
                className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 font-bold"
              >
                Comparar com o plano gratuito
              </button>
            </aside>
          </form>
        </div>
      </section>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span role="alert" className="flex items-center gap-1.5 text-sm text-red-600 mt-1.5">
      <AlertCircle className="w-4 h-4 shrink-0" />
      {message}
    </span>
  );
}
