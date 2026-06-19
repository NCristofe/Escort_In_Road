import { ArrowRight, CheckCircle, Clock, Package, Shield, Truck, Users, Warehouse, Zap } from "lucide-react";
import { Link } from "react-router";
import { PageHero } from "../components/PageHero";
import { services } from "../data/services";

const iconBySlug = {
  "carga-fracionada": Package,
  "carga-completa": Truck,
  armazenagem: Warehouse,
  "entregas-expressas": Clock,
  "cargas-especiais": Shield,
  ecommerce: Zap,
  "consultoria-logistica": Users,
};

const differentials = [
  "Frota própria com mais de 800 veículos",
  "Equipe especializada e treinada continuamente",
  "Tecnologia de ponta em rastreamento GPS",
  "Seguro completo de cargas incluso",
  "Atendimento 24 horas, 7 dias por semana",
  "Cobertura nacional em todos os estados",
  "Certificações ISO e SASSMAQ",
  "Sistema de gestão integrado (WMS/TMS)",
];

export function Services() {
  const mainServices = services.slice(0, 3);
  const additionalServices = services.slice(3);

  return (
    <div>
      <PageHero
        eyebrow="Serviços"
        title="Soluções completas em transporte e logística"
        description="Serviços personalizados para reduzir custos, aumentar previsibilidade e sustentar o crescimento da sua operação."
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {mainServices.map((service, index) => {
              const Icon = iconBySlug[service.slug as keyof typeof iconBySlug];

              return (
                <div key={service.slug} className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{service.title}</h2>
                    <p className="text-lg text-gray-600 mb-6">{service.description}</p>
                    <ul className="space-y-3 mb-8">
                      {service.features.slice(0, 6).map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/servicos/${service.slug}`}
                        className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
                      >
                        Ver detalhes
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      <Link
                        to="/cotacao"
                        className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-orange-50 transition-colors"
                      >
                        Solicitar orçamento
                      </Link>
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                      <img src={service.image} alt={service.title} className="w-full h-[400px] object-cover" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Serviços complementares</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ampliamos nosso portfólio com soluções especializadas para cada tipo de operação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service) => {
              const Icon = iconBySlug[service.slug as keyof typeof iconBySlug];

              return (
                <Link
                  key={service.slug}
                  to={`/servicos/${service.slug}`}
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-orange-600 group"
                >
                  <div className="bg-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-5">{service.summary}</p>
                  <span className="text-orange-600 font-bold inline-flex items-center gap-1">
                    Saiba mais
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Nossos diferenciais</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              O que torna a ESCORTinRoad uma parceira estratégica para sua operação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {differentials.map((differential) => (
              <div
                key={differential}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-600 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">{differential}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Solicite uma cotação personalizada</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para apresentar a melhor solução para suas necessidades logísticas.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/cotacao"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              Falar com especialista
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:08007771234"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Ligar: 0800 777 1234
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
