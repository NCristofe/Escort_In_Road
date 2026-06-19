import { Award, CheckCircle, MapPin, Shield, Target, Truck, Users } from "lucide-react";
import { Link } from "react-router";
import { PageHero } from "../components/PageHero";

export function About() {
  const values = [
    { icon: Shield, title: "Segurança", text: "Cuidamos da carga, das pessoas e da informação em cada etapa." },
    { icon: Target, title: "Precisão", text: "Planejamos rotas, prazos e capacidade com foco em previsibilidade." },
    { icon: Users, title: "Parceria", text: "Atendimento próximo para entender a operação real de cada cliente." },
    { icon: Award, title: "Excelência", text: "Processos monitorados, indicadores claros e melhoria contínua." },
  ];

  const timeline = [
    { year: "2011", text: "Início da operação com foco em transporte rodoviário regional." },
    { year: "2016", text: "Expansão da frota e abertura de rotas para todos os estados do Sudeste." },
    { year: "2021", text: "Implantação de rastreamento digital e gestão integrada de cargas." },
    { year: "2026", text: "Cobertura nacional com operação multimodal apoiada por tecnologia." },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Quem Somos"
        title="Logística com escala, presença e responsabilidade"
        description="A ESCORTinRoad conecta empresas, cargas e destinos com transporte rodoviário, armazenagem e tecnologia para operações de todos os portes."
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Uma transportadora preparada para operações exigentes
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Atuamos em transporte rodoviário de cargas, distribuição, armazenagem e projetos logísticos. Nossa estrutura combina frota, centros parceiros, equipe de atendimento e monitoramento ativo.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              O objetivo é simples: reduzir incertezas da operação logística e dar visibilidade para que cada cliente tome decisões com confiança.
            </p>
            <Link
              to="/cotacao"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
            >
              Solicitar cotação
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: Truck, value: "800+", label: "veículos monitorados" },
              { icon: MapPin, value: "27", label: "estados atendidos" },
              { icon: Users, value: "100k+", label: "entregas por mês" },
              { icon: Shield, value: "24h", label: "controle operacional" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <item.icon className="w-8 h-8 text-orange-600 mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-1">{item.value}</div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Nossos valores</h2>
            <p className="text-xl text-gray-600">A base que orienta cada coleta, viagem e entrega.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-7 rounded-xl shadow-md">
                <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
                  <value.icon className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-10 text-center">
            Nossa trajetória
          </h2>
          <div className="space-y-6">
            {timeline.map((item) => (
              <div key={item.year} className="flex gap-5 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="text-2xl font-bold text-orange-600 w-24 flex-shrink-0">{item.year}</div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
