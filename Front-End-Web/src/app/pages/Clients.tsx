import { Building2, CheckCircle, Quote, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import { PageHero } from "../components/PageHero";

export function Clients() {
  const cases = [
    { segment: "Indústria", result: "18% menos custo por rota", text: "Reorganização de coletas e consolidação semanal para distribuição nacional." },
    { segment: "E-commerce", result: "32% mais agilidade na expedição", text: "Integração entre armazenagem, separação e transportes para picos de venda." },
    { segment: "Atacado", result: "99% de visibilidade", text: "Rastreamento e rotina de status para pedidos B2B em capitais e interior." },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Clientes e Cases"
        title="Operações pensadas para cada segmento"
        description="Atendemos empresas que precisam de previsibilidade logística, comunicação clara e capacidade para crescer."
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
          {cases.map((item) => (
            <div key={item.segment} className="bg-gray-50 rounded-xl p-7 border border-gray-100">
              <Building2 className="w-8 h-8 text-orange-600 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{item.segment}</h2>
              <div className="text-2xl font-bold text-orange-600 mb-3">{item.result}</div>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <Quote className="w-10 h-10 text-orange-600 mb-6" />
            <p className="text-2xl text-gray-800 font-semibold mb-6">
              "A ESCORTinRoad trouxe clareza para nossa operação. Hoje acompanhamos prazos, ocorrências e custos com muito mais previsibilidade."
            </p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="font-bold text-gray-900">Mariana Alves</div>
                <div className="text-gray-600">Diretora de Operações, Grupo Nexus</div>
              </div>
              <Link to="/cotacao" className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors">
                Quero um resultado assim
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-5">
          {["Indústria alimentícia", "Autopeças", "Farmacêutico", "Varejo", "Marketplace", "Bens de consumo"].map((segment) => (
            <div key={segment} className="flex items-center gap-3 bg-gray-50 rounded-xl p-5">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-gray-800">{segment}</span>
              <TrendingUp className="w-5 h-5 text-orange-600 ml-auto" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
