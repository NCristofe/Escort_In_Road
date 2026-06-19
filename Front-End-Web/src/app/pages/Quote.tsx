import { useState, type FormEvent } from "react";
import { CheckCircle, FileText, Package, Send, Truck } from "lucide-react";
import { PageHero } from "../components/PageHero";

export function Quote() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <PageHero
        eyebrow="Cotação"
        title="Receba uma proposta para sua operação"
        description="Informe origem, destino, volume e frequência. Nossa equipe comercial retorna com a melhor alternativa logística."
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            {submitted ? (
              <div className="text-center py-16">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Cotação enviada</h2>
                <p className="text-gray-600">
                  Recebemos sua solicitação. Um especialista da ESCORTinRoad entrará em contato.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">Nome completo *</span>
                    <input required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">Empresa *</span>
                    <input required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">E-mail corporativo *</span>
                    <input required type="email" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">Telefone/WhatsApp *</span>
                    <input required type="tel" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">Origem *</span>
                    <input required placeholder="Cidade/UF" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">Destino *</span>
                    <input required placeholder="Cidade/UF" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">Tipo de serviço *</span>
                    <select required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600">
                      <option value="">Selecione</option>
                      <option>Carga Fracionada</option>
                      <option>Carga Completa</option>
                      <option>Armazenagem</option>
                      <option>Entregas Expressas</option>
                      <option>Cargas Especiais</option>
                      <option>E-commerce</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-700 mb-2">Frequência *</span>
                    <select required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600">
                      <option value="">Selecione</option>
                      <option>Única</option>
                      <option>Semanal</option>
                      <option>Mensal</option>
                      <option>Operação recorrente</option>
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="block text-sm font-bold text-gray-700 mb-2">Detalhes da carga *</span>
                  <textarea
                    required
                    rows={6}
                    placeholder="Informe peso, dimensões, quantidade de volumes, valor aproximado, prazo desejado e observações."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
                  />
                </label>
                <button className="w-full bg-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Enviar cotação
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-5">
            {[
              { icon: FileText, title: "Resposta comercial", text: "Retorno com análise de viabilidade e próximos passos." },
              { icon: Package, title: "Dados da carga", text: "Quanto mais detalhes, mais precisa fica a proposta." },
              { icon: Truck, title: "Operação sob medida", text: "Escolhemos veículo, rota e serviço conforme sua necessidade." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-md">
                <item.icon className="w-8 h-8 text-orange-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </div>
  );
}
