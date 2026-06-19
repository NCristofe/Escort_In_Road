import { useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  MapPin,
  Package,
  Route,
  Send,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { PageHero } from "../components/PageHero";

const inputClass =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600";

const selectClass = inputClass;

const textareaClass =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 resize-none";

type CargoOfferForm = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  pickupCity: string;
  deliveryCity: string;
  pickupDate: string;
  deliveryDeadline: string;
  cargoType: string;
  vehicleType: string;
  weight: string;
  volumeCount: string;
  cargoValue: string;
  paymentTerms: string;
  freightValue: string;
  requiresEscort: boolean;
  requiresInsurance: boolean;
  acceptsReturnLoad: boolean;
  notes: string;
};

const initialForm: CargoOfferForm = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  pickupCity: "",
  deliveryCity: "",
  pickupDate: "",
  deliveryDeadline: "",
  cargoType: "",
  vehicleType: "",
  weight: "",
  volumeCount: "",
  cargoValue: "",
  paymentTerms: "",
  freightValue: "",
  requiresEscort: false,
  requiresInsurance: true,
  acceptsReturnLoad: false,
  notes: "",
};

export function CargoRegistration() {
  const [form, setForm] = useState<CargoOfferForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const routePreview = useMemo(() => {
    if (!form.pickupCity && !form.deliveryCity) return "Origem e destino pendentes";
    if (!form.pickupCity) return `Origem pendente -> ${form.deliveryCity}`;
    if (!form.deliveryCity) return `${form.pickupCity} -> destino pendente`;
    return `${form.pickupCity} -> ${form.deliveryCity}`;
  }, [form.deliveryCity, form.pickupCity]);

  const updateField = <Field extends keyof CargoOfferForm>(
    field: Field,
    value: CargoOfferForm[Field],
  ) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <PageHero
        eyebrow="Cadastro de Cargas"
        title="Publique novas ofertas de frete"
        description="Empresas podem informar rota, requisitos, valores e prazos para disponibilizar cargas à operação logística."
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid xl:grid-cols-[1fr_390px] gap-8 items-start">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
            {submitted ? (
              <div className="text-center py-16">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Oferta de frete publicada</h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                  A carga foi registrada no painel. Nossa equipe operacional revisará os dados para seguir com a programação.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialForm);
                    setSubmitted(false);
                  }}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                >
                  Cadastrar nova carga
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Building2 className="w-6 h-6 text-orange-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Dados da empresa</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Empresa *</span>
                      <input
                        required
                        value={form.companyName}
                        onChange={(event) => updateField("companyName", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Responsável *</span>
                      <input
                        required
                        value={form.contactName}
                        onChange={(event) => updateField("contactName", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">E-mail corporativo *</span>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Telefone/WhatsApp *</span>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Route className="w-6 h-6 text-orange-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Rota e agenda</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Origem *</span>
                      <input
                        required
                        placeholder="Cidade/UF"
                        value={form.pickupCity}
                        onChange={(event) => updateField("pickupCity", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Destino *</span>
                      <input
                        required
                        placeholder="Cidade/UF"
                        value={form.deliveryCity}
                        onChange={(event) => updateField("deliveryCity", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Data de coleta *</span>
                      <input
                        required
                        type="date"
                        value={form.pickupDate}
                        onChange={(event) => updateField("pickupDate", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Prazo de entrega *</span>
                      <input
                        required
                        type="date"
                        value={form.deliveryDeadline}
                        onChange={(event) => updateField("deliveryDeadline", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Package className="w-6 h-6 text-orange-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Detalhes da carga</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Tipo de carga *</span>
                      <select
                        required
                        value={form.cargoType}
                        onChange={(event) => updateField("cargoType", event.target.value)}
                        className={selectClass}
                      >
                        <option value="">Selecione</option>
                        <option>Alimentos e bebidas</option>
                        <option>Autopeças</option>
                        <option>E-commerce</option>
                        <option>Industrial</option>
                        <option>Medicamentos</option>
                        <option>Químicos controlados</option>
                        <option>Outros</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Veículo necessário *</span>
                      <select
                        required
                        value={form.vehicleType}
                        onChange={(event) => updateField("vehicleType", event.target.value)}
                        className={selectClass}
                      >
                        <option value="">Selecione</option>
                        <option>VUC</option>
                        <option>3/4</option>
                        <option>Toco</option>
                        <option>Truck</option>
                        <option>Carreta</option>
                        <option>Bitrem</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Peso total *</span>
                      <input
                        required
                        placeholder="Ex: 12.500 kg"
                        value={form.weight}
                        onChange={(event) => updateField("weight", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Volumes *</span>
                      <input
                        required
                        inputMode="numeric"
                        placeholder="Quantidade"
                        value={form.volumeCount}
                        onChange={(event) => updateField("volumeCount", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Valor da mercadoria *</span>
                      <input
                        required
                        placeholder="R$"
                        value={form.cargoValue}
                        onChange={(event) => updateField("cargoValue", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Valor ofertado do frete *</span>
                      <input
                        required
                        placeholder="R$"
                        value={form.freightValue}
                        onChange={(event) => updateField("freightValue", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Condições de pagamento *</span>
                      <select
                        required
                        value={form.paymentTerms}
                        onChange={(event) => updateField("paymentTerms", event.target.value)}
                        className={selectClass}
                      >
                        <option value="">Selecione</option>
                        <option>À vista na coleta</option>
                        <option>À vista na entrega</option>
                        <option>7 dias após entrega</option>
                        <option>15 dias após entrega</option>
                        <option>30 dias após entrega</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <ShieldCheck className="w-6 h-6 text-orange-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Requisitos operacionais</h2>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <label className="flex items-start gap-3 border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.requiresEscort}
                        onChange={(event) => updateField("requiresEscort", event.target.checked)}
                        className="mt-1 w-5 h-5 accent-orange-600"
                      />
                      <span>
                        <span className="block font-bold text-gray-900">Escolta</span>
                        <span className="block text-sm text-gray-600">Carga exige acompanhamento.</span>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.requiresInsurance}
                        onChange={(event) => updateField("requiresInsurance", event.target.checked)}
                        className="mt-1 w-5 h-5 accent-orange-600"
                      />
                      <span>
                        <span className="block font-bold text-gray-900">Seguro</span>
                        <span className="block text-sm text-gray-600">Averbação obrigatória.</span>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.acceptsReturnLoad}
                        onChange={(event) => updateField("acceptsReturnLoad", event.target.checked)}
                        className="mt-1 w-5 h-5 accent-orange-600"
                      />
                      <span>
                        <span className="block font-bold text-gray-900">Carga retorno</span>
                        <span className="block text-sm text-gray-600">Aceita composição de rota.</span>
                      </span>
                    </label>
                  </div>
                </div>

                <label className="block">
                  <span className="block text-sm font-bold text-gray-700 mb-2">Observações para motoristas e operação</span>
                  <textarea
                    rows={5}
                    placeholder="Informe janelas de coleta, necessidade de ajudante, tipo de embalagem, restrições de acesso e documentação exigida."
                    value={form.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    className={textareaClass}
                  />
                </label>

                <button className="w-full bg-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Publicar oferta de frete
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-5 xl:sticky xl:top-28">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-5">
                <ClipboardList className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">Resumo da oferta</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Rota</div>
                    <div className="font-bold text-gray-900 break-words">{routePreview}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Agenda</div>
                    <div className="font-bold text-gray-900">
                      {form.pickupDate || "Coleta pendente"} / {form.deliveryDeadline || "entrega pendente"}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Veículo</div>
                    <div className="font-bold text-gray-900">{form.vehicleType || "Não selecionado"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Carga</div>
                    <div className="font-bold text-gray-900">
                      {form.cargoType || "Tipo pendente"} · {form.weight || "peso pendente"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-600 rounded-2xl shadow-lg p-6 text-white">
              <AlertCircle className="w-8 h-8 mb-4" />
              <h3 className="font-bold text-xl mb-2">Antes de publicar</h3>
              <p className="text-orange-100 text-sm leading-relaxed">
                Revise valores, prazos, documentação e requisitos especiais. Dados completos aceleram a validação e a alocação do veículo.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
