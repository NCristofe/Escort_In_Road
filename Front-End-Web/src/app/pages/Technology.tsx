import { Activity, Bell, Cpu, MapPinned, ShieldCheck, Smartphone } from "lucide-react";
import { Link } from "react-router";
import { PageHero } from "../components/PageHero";

export function Technology() {
  const features = [
    { icon: MapPinned, title: "GPS e telemetria", text: "Acompanhamento de localização, eventos e status da viagem." },
    { icon: Bell, title: "Alertas operacionais", text: "Notificações de atraso, parada, ocorrência e previsão de entrega." },
    { icon: Smartphone, title: "Portal de rastreamento", text: "Consulta simples por código para equipes e clientes." },
    { icon: Cpu, title: "Integrações", text: "Base preparada para conectar TMS, WMS, ERP e e-commerce." },
    { icon: ShieldCheck, title: "Controle de risco", text: "Regras de segurança aplicadas por perfil de carga e rota." },
    { icon: Activity, title: "Indicadores", text: "KPIs para SLA, lead time, ocorrências e performance de entrega." },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Tecnologia"
        title="Visibilidade logística do pedido à entrega"
        description="Ferramentas digitais para monitorar cargas, reduzir ocorrências e transformar dados operacionais em decisões."
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Mais controle para embarcadores e equipes operacionais
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              A tecnologia da ESCORTinRoad organiza eventos logísticos, rastreamento, indicadores e comunicação para que cada operação tenha clareza sobre status, prazo e responsabilidade.
            </p>
            <Link to="/rastreamento" className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors">
              Acessar rastreamento
            </Link>
          </div>
          <div className="bg-gray-900 rounded-2xl p-8 text-white">
            <div className="text-sm text-orange-300 font-bold mb-3">PAINEL OPERACIONAL</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["96%", "entregas no prazo"],
                ["1.284", "cargas monitoradas"],
                ["18", "ocorrências tratadas"],
                ["42 min", "tempo médio de resposta"],
              ].map(([value, label]) => (
                <div key={label} className="bg-white/10 rounded-xl p-5">
                  <div className="text-3xl font-bold mb-1">{value}</div>
                  <div className="text-sm text-gray-300">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-xl p-7 shadow-md">
              <feature.icon className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
