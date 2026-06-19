import { Link } from "react-router";
import { ArrowRight, MapPin, Phone, Warehouse } from "lucide-react";
import { PageHero } from "../components/PageHero";

export function Units() {
  const units = [
    { name: "Matriz São Paulo", address: "Av. Logística, 1000 - São Paulo/SP", phone: "(11) 3456-7890" },
    { name: "CD Guarulhos", address: "Rod. Presidente Dutra, km 220 - Guarulhos/SP", phone: "(11) 3020-4400" },
    { name: "Unidade Curitiba", address: "Cidade Industrial - Curitiba/PR", phone: "(41) 3344-9000" },
    { name: "Unidade Recife", address: "Distrito Logístico - Recife/PE", phone: "(81) 3222-7800" },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Unidades"
        title="Estrutura próxima dos principais polos logísticos"
        description="Matriz, centros de distribuição e pontos de apoio para coleta, transferência e distribuição regional."
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {units.map((unit) => (
            <div key={unit.name} className="bg-gray-50 rounded-xl p-7 border border-gray-100">
              <Warehouse className="w-9 h-9 text-orange-600 mb-5" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{unit.name}</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                  <span>{unit.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-600" />
                  <span>{unit.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Precisa de apoio em outra região?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Avaliamos rotas dedicadas, parceiros locais e operações sob demanda.
          </p>
          <Link to="/cotacao" className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors inline-flex items-center gap-2">
            Consultar disponibilidade
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
