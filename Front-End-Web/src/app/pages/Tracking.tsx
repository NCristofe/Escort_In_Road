import { useState } from "react";
import { Search, Package, MapPin, Clock, CheckCircle, Truck, Calendar, ArrowRight } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("pt-BR");
const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function withTime(date: Date, hours: number, minutes: number) {
  const nextDate = new Date(date);
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

export function Tracking() {
  const [trackingCode, setTrackingCode] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      setSearchPerformed(true);
    }
  };

  const now = new Date();
  const deliveryDate = withTime(addDays(now, 1), 14, 0);
  const currentEventDate = withTime(now, 14, 30);
  const departureDate = withTime(now, 8, 15);
  const collectedDate = withTime(addDays(now, -1), 16, 45);
  const scheduledDate = withTime(addDays(now, -1), 9, 0);

  // Mock tracking data
  const trackingData = {
    code: trackingCode || "TRL123456789",
    status: "Em Trânsito",
    origin: "São Paulo - SP",
    destination: "Rio de Janeiro - RJ",
    estimatedDelivery: `${dateFormatter.format(deliveryDate)} às ${timeFormatter.format(deliveryDate)}`,
    currentLocation: "Rodovia Presidente Dutra - KM 180 - Guarulhos/SP",
    driver: "Carlos Silva",
    vehicle: "Caminhão Mercedes-Benz Actros - Placa ABC-1234",
    progress: 65,
    events: [
      {
        date: dateFormatter.format(currentEventDate),
        time: timeFormatter.format(currentEventDate),
        description: "Mercadoria em trânsito",
        location: "Rodovia Presidente Dutra - KM 180 - Guarulhos/SP",
        status: "current",
      },
      {
        date: dateFormatter.format(departureDate),
        time: timeFormatter.format(departureDate),
        description: "Saída do Centro de Distribuição",
        location: "CD São Paulo - Zona Leste",
        status: "completed",
      },
      {
        date: dateFormatter.format(collectedDate),
        time: timeFormatter.format(collectedDate),
        description: "Mercadoria coletada no remetente",
        location: "São Paulo - SP",
        status: "completed",
      },
      {
        date: dateFormatter.format(scheduledDate),
        time: timeFormatter.format(scheduledDate),
        description: "Coleta agendada",
        location: "Sistema ESCORTinRoad",
        status: "completed",
      },
    ],
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Rastreamento de Cargas
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
            Acompanhe sua entrega em tempo real. Transparência total do início ao fim.
          </p>

          {/* Search Form */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Digite o código de rastreamento (ex: TRL123456789)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-300 text-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Search className="w-5 h-5" />
                Rastrear
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Tracking Results */}
      {searchPerformed && (
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Progress Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Status da Entrega</h2>
                <span className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                  {trackingData.status}
                </span>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progresso da Entrega</span>
                  <span className="font-bold text-orange-600">{trackingData.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${trackingData.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-1">Código de Rastreamento</div>
              <div className="text-xl font-bold text-gray-900 mb-6">{trackingData.code}</div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2.5 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Origem</div>
                    <div className="font-bold text-gray-900">{trackingData.origin}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2.5 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Destino</div>
                    <div className="font-bold text-gray-900">{trackingData.destination}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2.5 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Previsão de Entrega</div>
                    <div className="font-bold text-gray-900">{trackingData.estimatedDelivery}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Location */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl shadow-xl p-6 lg:p-8 mb-6 text-white">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg mb-1">Localização Atual</div>
                  <div className="text-orange-100 mb-3">{trackingData.currentLocation}</div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-orange-100">Motorista:</span>
                      <span className="font-semibold ml-2">{trackingData.driver}</span>
                    </div>
                    <div>
                      <span className="text-orange-100">Veículo:</span>
                      <span className="font-semibold ml-2">{trackingData.vehicle}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                Histórico de Movimentação
              </h2>
              
              <div className="space-y-6">
                {trackingData.events.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          event.status === "current"
                            ? "bg-orange-600 ring-4 ring-orange-100"
                            : "bg-green-500"
                        }`}
                      >
                        {event.status === "current" ? (
                          <Truck className="w-6 h-6 text-white" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                      {index < trackingData.events.length - 1 && (
                        <div className="w-0.5 h-full min-h-[80px] bg-gray-300 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                        <span className={`font-bold text-lg ${event.status === "current" ? "text-orange-600" : "text-gray-900"}`}>
                          {event.description}
                        </span>
                        <span className="text-sm text-gray-500">
                          {event.date} às {event.time}
                        </span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Info Section */}
      {!searchPerformed && (
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Como Funciona o Rastreamento?
              </h2>
              <p className="text-lg text-gray-600">
                Simples, rápido e em tempo real
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Digite o Código</h3>
                <p className="text-gray-600">
                  Insira o código de rastreamento fornecido no momento da coleta
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Acompanhe em Tempo Real</h3>
                <p className="text-gray-600">
                  Veja onde sua mercadoria está e todo o histórico de movimentação
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Receba sua Entrega</h3>
                <p className="text-gray-600">
                  Fique informado sobre a previsão e prepare-se para receber
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <h3 className="font-bold text-xl text-gray-900 mb-4">
                Precisa de Ajuda?
              </h3>
              <p className="text-gray-600 mb-6">
                Nossa equipe está disponível 24h para esclarecer dúvidas sobre sua entrega
              </p>
              <a
                href="tel:08007771234"
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
              >
                Ligar: 0800 777 1234
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
