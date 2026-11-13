import { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L, {
  type LatLngExpression,
  type LayerGroup,
  type Map as LeafletMap,
  type Marker,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AlertTriangle,
  Coffee,
  Filter,
  Fuel,
  MapPin,
  Package,
  RefreshCw,
  Route,
  Truck,
  Wrench,
} from "lucide-react";
import { PageHero } from "../components/PageHero";

type MapItem = {
  id: string;
  type: "truck" | "load";
  title: string;
  location: string;
  lat: number;
  lng: number;
  route: string;
  status: string;
  priority: "normal" | "alta" | "critica";
  details: string;
};

const corridorBounds: L.LatLngBoundsExpression = [
  [-26.2, -50.2],
  [-22.7, -45.8],
];

const spToCuritibaRoute: LatLngExpression[] = [
  [-23.5505, -46.6333],
  [-23.9631, -46.3923],
  [-24.1858, -46.8978],
  [-24.4979, -47.8449],
  [-25.0916, -48.4391],
  [-25.4284, -49.2733],
];

const mapItems: MapItem[] = [
  {
    id: "TRK-0187",
    type: "truck",
    title: "Truck vazio",
    location: "Sao Paulo/SP",
    lat: -23.5505,
    lng: -46.6333,
    route: "Sao Paulo/SP -> Curitiba/PR",
    status: "Vazio ha 2h",
    priority: "normal",
    details: "Carreta sider, 28 pallets, motorista liberado para carga no corredor Regis Bittencourt.",
  },
  {
    id: "TRK-0264",
    type: "truck",
    title: "Truck vazio",
    location: "Embu das Artes/SP",
    lat: -23.6489,
    lng: -46.8522,
    route: "Sao Paulo/SP -> Curitiba/PR",
    status: "Aguardando carga",
    priority: "alta",
    details: "Truck bau seco proximo ao acesso da BR-116, pronto para coleta imediata.",
  },
  {
    id: "TRK-0441",
    type: "truck",
    title: "Carreta vazia",
    location: "Registro/SP",
    lat: -24.4979,
    lng: -47.8449,
    route: "Sao Paulo/SP -> Curitiba/PR",
    status: "Disponivel",
    priority: "normal",
    details: "Carreta bau seca em ponto intermediario, aceita carga complementar para Curitiba.",
  },
  {
    id: "TRK-0730",
    type: "truck",
    title: "Truck vazio",
    location: "Cajati/SP",
    lat: -24.7366,
    lng: -48.1228,
    route: "Sao Paulo/SP -> Curitiba/PR",
    status: "Janela aberta ate 20h",
    priority: "normal",
    details: "Veiculo no eixo da BR-116, pode seguir com carga complementar para Curitiba.",
  },
  {
    id: "TRK-0912",
    type: "truck",
    title: "Carreta vazia",
    location: "Curitiba/PR",
    lat: -25.4284,
    lng: -49.2733,
    route: "Sao Paulo/SP -> Curitiba/PR",
    status: "Retorno disponivel",
    priority: "alta",
    details: "Carreta posicionada em Curitiba para finalizar ou redistribuir cargas do corredor.",
  },
  {
    id: "LOD-7804",
    type: "load",
    title: "Carga pendente",
    location: "Guarulhos/SP",
    lat: -23.4543,
    lng: -46.5337,
    route: "Sao Paulo/SP -> Curitiba/PR",
    status: "Coleta ate 18h",
    priority: "critica",
    details: "Eletronicos, 14 volumes, seguro obrigatorio. Destino final Curitiba/PR.",
  },
  {
    id: "LOD-7811",
    type: "load",
    title: "Carga pendente",
    location: "Osasco/SP",
    lat: -23.5329,
    lng: -46.7918,
    route: "Sao Paulo/SP -> Curitiba/PR",
    status: "Sem veiculo alocado",
    priority: "alta",
    details: "Autopecas, 9 toneladas, carga paletizada com entrega D+1 em Curitiba.",
  },
  {
    id: "LOD-7820",
    type: "load",
    title: "Carga pendente",
    location: "Sao Jose dos Pinhais/PR",
    lat: -25.5313,
    lng: -49.2031,
    route: "Sao Paulo/SP -> Curitiba/PR",
    status: "Aguardando aceite",
    priority: "normal",
    details: "Bebidas, 18 pallets, descarga na regiao metropolitana de Curitiba.",
  },
  {
    id: "LOD-7836",
    type: "load",
    title: "Carga pendente",
    location: "Itapecerica da Serra/SP",
    lat: -23.7169,
    lng: -46.8497,
    route: "Sao Paulo/SP -> Curitiba/PR",
    status: "Alta demanda",
    priority: "critica",
    details: "Produtos farmaceuticos, temperatura controlada e acompanhamento dedicado ate Curitiba.",
  },
  {
    id: "LOD-7842",
    type: "load",
    title: "Carga pendente",
    location: "Curitiba/PR",
    lat: -25.4284,
    lng: -49.2733,
    route: "Sao Paulo/SP -> Curitiba/PR",
    status: "Coleta programada",
    priority: "alta",
    details: "Industrial, 22 toneladas, precisa escolta no trecho urbano de chegada em Curitiba.",
  },
];

const filters = [
  { id: "all", label: "Todos" },
  { id: "truck", label: "Caminhoes vazios" },
  { id: "load", label: "Cargas pendentes" },
] as const;

type PoiCategory = "parada" | "posto" | "oficina";

type PointOfInterest = {
  id: string;
  category: PoiCategory;
  name: string;
  location: string;
  /** Referencia de quilometragem no corredor, como aparece na sinalizacao da via. */
  km: string;
  lat: number;
  lng: number;
  hours: string;
  /** Convenio ativo com a ESCORTinRoad (tarifa negociada, atendimento prioritario). */
  partner: boolean;
  services: string[];
};

const poiCategories: Record<PoiCategory, { label: string; short: string; color: string; icon: typeof Coffee }> = {
  parada: { label: "Parada parceira", short: "Parada", color: "#059669", icon: Coffee },
  posto: { label: "Posto de combustivel", short: "Posto", color: "#7c3aed", icon: Fuel },
  oficina: { label: "Oficina", short: "Oficina", color: "#0891b2", icon: Wrench },
};

const poiCategoryList = ["parada", "posto", "oficina"] as const;

const pointsOfInterest: PointOfInterest[] = [
  {
    id: "POI-101",
    category: "posto",
    name: "Posto Regis Bittencourt",
    location: "Embu das Artes/SP",
    km: "BR-116 km 279",
    lat: -23.6612,
    lng: -46.873,
    hours: "24 horas",
    partner: true,
    services: ["Diesel S10", "Arla 32", "Balanca", "Estacionamento vigiado"],
  },
  {
    id: "POI-108",
    category: "parada",
    name: "Parada Serra do Cafezal",
    location: "Sao Lourenco da Serra/SP",
    km: "BR-116 km 297",
    lat: -23.8467,
    lng: -46.9436,
    hours: "05h as 23h",
    partner: true,
    services: ["Restaurante", "Banho quente", "Wi-Fi", "Area de descanso"],
  },
  {
    id: "POI-114",
    category: "oficina",
    name: "Oficina Juquitiba Diesel",
    location: "Juquitiba/SP",
    km: "BR-116 km 312",
    lat: -23.9319,
    lng: -47.0686,
    hours: "07h as 19h",
    partner: false,
    services: ["Mecanica pesada", "Borracharia", "Eletrica 24h", "Socorro na via"],
  },
  {
    id: "POI-121",
    category: "posto",
    name: "Posto Miracatu Sul",
    location: "Miracatu/SP",
    km: "BR-116 km 355",
    lat: -24.2789,
    lng: -47.4586,
    hours: "24 horas",
    partner: true,
    services: ["Diesel S10", "Arla 32", "Troca de oleo", "Conveniencia"],
  },
  {
    id: "POI-130",
    category: "parada",
    name: "Parada Vale do Ribeira",
    location: "Registro/SP",
    km: "BR-116 km 400",
    lat: -24.4879,
    lng: -47.8449,
    hours: "24 horas",
    partner: true,
    services: ["Restaurante", "Dormitorio", "Patio para 80 carretas", "Monitoramento 24h"],
  },
  {
    id: "POI-137",
    category: "oficina",
    name: "Oficina Jacupiranga Truck",
    location: "Jacupiranga/SP",
    km: "BR-116 km 440",
    lat: -24.6947,
    lng: -48.0044,
    hours: "08h as 18h",
    partner: true,
    services: ["Suspensao", "Freios", "Borracharia", "Guincho parceiro"],
  },
  {
    id: "POI-145",
    category: "posto",
    name: "Posto Barra do Turvo",
    location: "Barra do Turvo/SP",
    km: "BR-116 km 490",
    lat: -24.7592,
    lng: -48.5028,
    hours: "24 horas",
    partner: false,
    services: ["Diesel comum", "Arla 32", "Lanchonete"],
  },
  {
    id: "POI-152",
    category: "parada",
    name: "Parada Campina Grande",
    location: "Campina Grande do Sul/PR",
    km: "BR-116 km 40 (PR)",
    lat: -25.3055,
    lng: -49.0553,
    hours: "24 horas",
    partner: true,
    services: ["Restaurante", "Banho quente", "Patio vigiado", "Apoio a escolta"],
  },
  {
    id: "POI-160",
    category: "oficina",
    name: "Oficina Contorno Leste",
    location: "Curitiba/PR",
    km: "BR-116 km 84 (PR)",
    lat: -25.4809,
    lng: -49.1867,
    hours: "07h as 20h",
    partner: true,
    services: ["Mecanica pesada", "Diagnostico eletronico", "Ar-condicionado", "Pneus"],
  },
];

function priorityClass(priority: MapItem["priority"]) {
  if (priority === "critica") return "bg-red-50 text-red-700";
  if (priority === "alta") return "bg-amber-50 text-amber-700";
  return "bg-green-50 text-green-700";
}

function buildMarkerIcon(item: MapItem, selected: boolean) {
  const color = item.type === "truck" ? "#2563eb" : "#ea580c";
  const label = item.type === "truck" ? "T" : "C";
  const size = selected ? 42 : 34;
  const ring = selected ? "0 0 0 6px rgba(17, 24, 39, 0.18)" : "0 8px 18px rgba(17, 24, 39, 0.28)";

  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;
      height:${size}px;
      border-radius:999px;
      background:${color};
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:800;
      font-size:14px;
      border:3px solid #fff;
      box-shadow:${ring};
    ">${label}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function popupContent(item: MapItem) {
  return `
    <strong>${item.id} - ${item.title}</strong><br />
    ${item.location}<br />
    <span>${item.route}</span>
  `;
}

function buildPoiIcon(poi: PointOfInterest) {
  const { color, icon: Icon } = poiCategories[poi.category];
  const size = 30;
  const glyph = renderToStaticMarkup(<Icon width={15} height={15} color="#fff" strokeWidth={2.6} />);

  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;
      height:${size}px;
      border-radius:9px;
      background:${color};
      display:flex;
      align-items:center;
      justify-content:center;
      border:2px solid #fff;
      box-shadow:0 6px 14px rgba(17, 24, 39, 0.26);
    ">${glyph}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function poiPopupContent(poi: PointOfInterest) {
  const category = poiCategories[poi.category];
  const badge = poi.partner
    ? '<span style="background:#ecfdf5;color:#047857;font-weight:700;font-size:10px;padding:1px 6px;border-radius:999px;">PARCEIRA</span>'
    : "";

  return `
    <strong>${poi.name}</strong> ${badge}<br />
    <span style="color:${category.color};font-weight:700;">${category.label}</span><br />
    ${poi.location} &middot; ${poi.km}<br />
    <span>Funcionamento: ${poi.hours}</span><br />
    <span>${poi.services.join(", ")}</span>
  `;
}

export function OperationalMap() {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef<Marker[]>([]);
  const poiLayerRef = useRef<LayerGroup | null>(null);
  const poiMarkerRefs = useRef<Record<string, Marker>>({});
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [selectedId, setSelectedId] = useState(mapItems[0].id);
  const [showPois, setShowPois] = useState(true);
  const [poiFilter, setPoiFilter] = useState<PoiCategory | "all">("all");

  const visibleItems = useMemo(() => {
    if (activeFilter === "all") return mapItems;
    return mapItems.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

  const visiblePois = useMemo(() => {
    if (poiFilter === "all") return pointsOfInterest;
    return pointsOfInterest.filter((poi) => poi.category === poiFilter);
  }, [poiFilter]);

  const selectedItem = visibleItems.find((item) => item.id === selectedId) ?? visibleItems[0] ?? mapItems[0];
  const emptyTrucks = mapItems.filter((item) => item.type === "truck").length;
  const pendingLoads = mapItems.filter((item) => item.type === "load").length;
  const criticalLoads = mapItems.filter((item) => item.type === "load" && item.priority === "critica").length;
  const partnerPois = pointsOfInterest.filter((poi) => poi.partner).length;

  function focusPoi(poi: PointOfInterest) {
    setShowPois(true);
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([poi.lat, poi.lng], Math.max(map.getZoom(), 9), { duration: 0.7 });
    window.setTimeout(() => poiMarkerRefs.current[poi.id]?.openPopup(), 750);
  }

  useEffect(() => {
    if (!visibleItems.some((item) => item.id === selectedId)) {
      setSelectedId(visibleItems[0]?.id ?? mapItems[0].id);
    }
  }, [selectedId, visibleItems]);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;

    const map = L.map(mapElementRef.current, {
      center: [-14.235, -51.9253] as LatLngExpression,
      zoom: 7,
      minZoom: 6,
      maxZoom: 13,
      maxBounds: corridorBounds,
      maxBoundsViscosity: 0.85,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.polyline(spToCuritibaRoute, {
      color: "#ea580c",
      weight: 5,
      opacity: 0.82,
      dashArray: "10 10",
    })
      .bindTooltip("Corredor Sao Paulo -> Curitiba", { sticky: true })
      .addTo(map);

    map.fitBounds(corridorBounds, { padding: [18, 18] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRefs.current = [];
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = visibleItems.map((item) => {
      const marker = L.marker([item.lat, item.lng], {
        icon: buildMarkerIcon(item, item.id === selectedItem.id),
        title: `${item.id} - ${item.location}`,
      })
        .addTo(map)
        .bindPopup(popupContent(item));

      marker.on("click", () => setSelectedId(item.id));
      return marker;
    });

    window.setTimeout(() => map.invalidateSize(), 0);
  }, [selectedItem.id, visibleItems]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    poiMarkerRefs.current = {};
    if (!showPois) {
      poiLayerRef.current = null;
      return;
    }

    const layer = L.layerGroup();
    visiblePois.forEach((poi) => {
      const marker = L.marker([poi.lat, poi.lng], {
        icon: buildPoiIcon(poi),
        title: `${poi.name} - ${poi.km}`,
      }).bindPopup(poiPopupContent(poi));

      marker.addTo(layer);
      poiMarkerRefs.current[poi.id] = marker;
    });

    layer.addTo(map);
    poiLayerRef.current = layer;

    return () => {
      layer.remove();
      poiLayerRef.current = null;
    };
  }, [showPois, visiblePois]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedItem) return;
    map.flyTo([selectedItem.lat, selectedItem.lng], Math.max(map.getZoom(), 6), { duration: 0.7 });
  }, [selectedItem]);

  return (
    <div>
      <PageHero
        eyebrow="Visualizacao Geografica"
        title="Mapa operacional Sao Paulo -> Curitiba"
        description="Veja caminhoes vazios, cargas pendentes e pontos de apoio no corredor SP-PR para reduzir ociosidade e acelerar alocacoes."
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { icon: Truck, value: emptyTrucks, label: "caminhoes vazios", color: "text-blue-700", bg: "bg-blue-50" },
              { icon: Package, value: pendingLoads, label: "cargas pendentes", color: "text-orange-700", bg: "bg-orange-50" },
              { icon: AlertTriangle, value: criticalLoads, label: "prioridades criticas", color: "text-red-700", bg: "bg-red-50" },
              { icon: Coffee, value: partnerPois, label: "pontos parceiros", color: "text-emerald-700", bg: "bg-emerald-50" },
            ].map((metric) => (
              <div key={metric.label} className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
                <div className={`${metric.bg} p-3 rounded-lg`}>
                  <metric.icon className={`w-7 h-7 ${metric.color}`} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid xl:grid-cols-[1fr_360px] gap-8 items-start">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Mapa operacional</h2>
                  <p className="text-gray-600">Mapa real do trecho Sao Paulo &rarr; Curitiba com base OpenStreetMap.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                        activeFilter === filter.id
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowPois((current) => !current)}
                    aria-pressed={showPois}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors inline-flex items-center gap-2 ${
                      showPois ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    Pontos de apoio
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div
                  ref={mapElementRef}
                  className="relative z-0 h-[420px] sm:h-[560px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                  aria-label="Mapa real do corredor Sao Paulo Curitiba com caminhoes vazios, cargas pendentes e pontos de apoio"
                />
                <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    Caminhao vazio
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-600" />
                    Carga pendente
                  </span>
                  {showPois &&
                    poiCategoryList.map((category) => (
                      <span key={category} className="inline-flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-[4px]"
                          style={{ backgroundColor: poiCategories[category].color }}
                        />
                        {poiCategories[category].label}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-28">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <div className="text-sm font-bold text-orange-600">{selectedItem.id}</div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${priorityClass(selectedItem.priority)}`}>
                    {selectedItem.priority}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Localizacao</div>
                      <div className="font-bold text-gray-900">{selectedItem.location}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Route className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Rota</div>
                      <div className="font-bold text-gray-900">{selectedItem.route}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="font-bold text-gray-900">{selectedItem.status}</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mt-5">{selectedItem.details}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Filter className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-gray-900">Fila visivel</h3>
                </div>
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {visibleItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full text-left border rounded-lg p-3 transition-colors ${
                        item.id === selectedItem.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-bold text-gray-900">{item.id}</span>
                        <span className={`text-xs font-bold ${item.type === "truck" ? "text-blue-700" : "text-orange-700"}`}>
                          {item.type === "truck" ? "Vazio" : "Pendente"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{item.location}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-1">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-gray-900">Pontos de interesse no trajeto</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Paradas parceiras, postos e oficinas ao longo do corredor SP &rarr; PR.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(["all", ...poiCategoryList] as const).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setPoiFilter(category);
                        setShowPois(true);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        poiFilter === category
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category === "all" ? "Todos" : poiCategories[category].short}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {visiblePois.map((poi) => {
                    const category = poiCategories[poi.category];
                    const Icon = category.icon;

                    return (
                      <button
                        key={poi.id}
                        type="button"
                        onClick={() => focusPoi(poi)}
                        className="w-full text-left border border-gray-200 rounded-lg p-3 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="p-1.5 rounded-md shrink-0"
                            style={{ backgroundColor: `${category.color}1a` }}
                          >
                            <Icon className="w-4 h-4" style={{ color: category.color }} />
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-gray-900">{poi.name}</span>
                              {poi.partner && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                  PARCEIRA
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {poi.location} &middot; {poi.km}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {poi.hours} &middot; {poi.services.join(", ")}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
