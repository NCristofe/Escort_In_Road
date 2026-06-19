import { Link } from "react-router";
import { ArrowRight, CheckCircle, MapPin, Navigation, Warehouse } from "lucide-react";
import { PageHero } from "../components/PageHero";

export function Coverage() {
  const regions = [
    { name: "Sudeste", cities: "São Paulo, Rio de Janeiro, Belo Horizonte, Vitória", time: "D+1 a D+3" },
    { name: "Sul", cities: "Curitiba, Florianópolis, Porto Alegre, Londrina", time: "D+2 a D+5" },
    { name: "Centro-Oeste", cities: "Brasília, Goiânia, Cuiabá, Campo Grande", time: "D+3 a D+6" },
    { name: "Nordeste", cities: "Salvador, Recife, Fortaleza, Natal", time: "D+4 a D+8" },
    { name: "Norte", cities: "Belém, Manaus, Palmas, Porto Velho", time: "Sob consulta" },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Cobertura"
        title="Rotas para todo o Brasil"
        description="Atendimento nacional com rotas regulares, centros de apoio e planejamento para operações dedicadas."
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[420px_1fr] gap-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5">
              Cobertura nacional com prazos por perfil de rota
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Operamos com rotas regulares para capitais, regiões metropolitanas e polos industriais, além de projetos dedicados para destinos específicos.
            </p>
            <Link
              to="/cotacao"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
            >
              Consultar rota
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {regions.map((region) => (
              <div key={region.name} className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{region.name}</h3>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">{region.time}</span>
                </div>
                <p className="text-gray-600">{region.cities}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
          {[
            { icon: Navigation, title: "Rotas regulares", text: "Malha ativa para regiões com alto volume de embarques." },
            { icon: Warehouse, title: "Apoio operacional", text: "Centros parceiros para consolidação, triagem e distribuição." },
            { icon: MapPin, title: "Projetos dedicados", text: "Desenho de rota para plantas, CDs, lojas e operações especiais." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-7 shadow-md">
              <item.icon className="w-9 h-9 text-orange-600 mb-5" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Como validamos uma nova rota</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Origem, destino e janela de entrega", "Tipo de carga e restrições operacionais", "Frequência e volume esperado", "Necessidade de coleta, armazenagem ou distribuição"].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-xl p-5">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
