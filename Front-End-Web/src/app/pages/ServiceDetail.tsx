import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, CheckCircle, Package } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { getServiceBySlug } from "../data/services";

export function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) {
    return (
      <div>
        <PageHero
          eyebrow="Serviço"
          title="Serviço não encontrado"
          description="A solução que você procurou não está disponível ou foi movida."
        />
        <section className="py-16 text-center">
          <Link to="/servicos" className="text-orange-600 font-bold inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Voltar para serviços
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero eyebrow="Serviço" title={service.title} description={service.summary} />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Link to="/servicos" className="text-orange-600 font-bold inline-flex items-center gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Todos os serviços
            </Link>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5">
              Como funciona
            </h2>
            <p className="text-lg text-gray-600 mb-8">{service.description}</p>
            <Link
              to="/cotacao"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
            >
              Cotar este serviço
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img src={service.image} alt={service.title} className="w-full h-[420px] object-cover" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">O que está incluso</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {service.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 bg-gray-50 rounded-xl p-5">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-semibold">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl p-7 shadow-md">
              <Package className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ideal para</h3>
              <div className="flex flex-wrap gap-2">
                {service.idealFor.map((item) => (
                  <span key={item} className="bg-orange-50 text-orange-700 px-3 py-2 rounded-lg text-sm font-bold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              {service.metrics.map((metric) => (
                <div key={metric.label} className="bg-white rounded-xl p-5 shadow-md">
                  <div className="text-3xl font-bold text-orange-600">{metric.value}</div>
                  <div className="text-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
