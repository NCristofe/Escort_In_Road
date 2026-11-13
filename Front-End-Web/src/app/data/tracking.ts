/**
 * Base de cargas rastreaveis.
 *
 * Enquanto nao existe backend, a consulta roda contra esta lista. O importante
 * e que ela se comporte como uma busca de verdade: codigo desconhecido nao
 * encontra nada, em vez de devolver uma carga qualquer com o texto digitado.
 *
 * As datas sao relativas a hoje, calculadas no momento da consulta, para que a
 * linha do tempo continue plausivel em qualquer dia em que a pagina for aberta.
 */

export type ShipmentStatus = "Coleta Agendada" | "Em Trânsito" | "Saiu para Entrega" | "Entregue";

type EventSeed = {
  /** Dias em relacao a hoje; negativo e passado. */
  dayOffset: number;
  hour: number;
  minute: number;
  description: string;
  location: string;
  /** Etapa em andamento, destacada na linha do tempo. Uma por carga, no maximo. */
  current?: boolean;
};

type ShipmentSeed = {
  code: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  currentLocation: string;
  driver: string;
  vehicle: string;
  /** Percentual do trajeto concluido. */
  progress: number;
  /** Previsao de entrega. Ausente quando a carga ja foi entregue. */
  delivery?: { dayOffset: number; hour: number; minute: number };
  /** Preenchido somente nas cargas entregues. */
  delivered?: { dayOffset: number; hour: number; minute: number };
  events: EventSeed[];
};

export type TrackingEvent = {
  at: Date;
  description: string;
  location: string;
  current: boolean;
};

export type Shipment = {
  code: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  currentLocation: string;
  driver: string;
  vehicle: string;
  progress: number;
  estimatedDelivery: Date | null;
  deliveredAt: Date | null;
  /** Do evento mais recente para o mais antigo. */
  events: TrackingEvent[];
};

/** Codigo de rastreamento: TRL seguido de nove digitos. */
export const TRACKING_CODE_PATTERN = /^TRL\d{9}$/;

const shipmentSeeds: ShipmentSeed[] = [
  {
    code: "TRL123456789",
    status: "Em Trânsito",
    origin: "São Paulo - SP",
    destination: "Rio de Janeiro - RJ",
    currentLocation: "Rodovia Presidente Dutra - KM 180 - Guarulhos/SP",
    driver: "Carlos Silva",
    vehicle: "Caminhão Mercedes-Benz Actros - Placa ABC-1234",
    progress: 65,
    delivery: { dayOffset: 1, hour: 14, minute: 0 },
    events: [
      {
        dayOffset: 0,
        hour: 14,
        minute: 30,
        description: "Mercadoria em trânsito",
        location: "Rodovia Presidente Dutra - KM 180 - Guarulhos/SP",
        current: true,
      },
      {
        dayOffset: 0,
        hour: 8,
        minute: 15,
        description: "Saída do Centro de Distribuição",
        location: "CD São Paulo - Zona Leste",
      },
      {
        dayOffset: -1,
        hour: 16,
        minute: 45,
        description: "Mercadoria coletada no remetente",
        location: "São Paulo - SP",
      },
      {
        dayOffset: -1,
        hour: 9,
        minute: 0,
        description: "Coleta agendada",
        location: "Sistema ESCORTinRoad",
      },
    ],
  },
  {
    code: "TRL555000111",
    status: "Saiu para Entrega",
    origin: "Belo Horizonte - MG",
    destination: "Vitória - ES",
    currentLocation: "Em rota de entrega - Vitória/ES",
    driver: "Daniela Rocha",
    vehicle: "Caminhão VW Delivery - Placa EIR-7J21",
    progress: 90,
    delivery: { dayOffset: 0, hour: 18, minute: 0 },
    events: [
      {
        dayOffset: 0,
        hour: 9,
        minute: 10,
        description: "Saiu para entrega",
        location: "CD Vitória - ES",
        current: true,
      },
      {
        dayOffset: -1,
        hour: 22,
        minute: 35,
        description: "Chegada ao centro de distribuição de destino",
        location: "Vitória - ES",
      },
      {
        dayOffset: -1,
        hour: 10,
        minute: 15,
        description: "Mercadoria em trânsito",
        location: "BR-262 - KM 95 - João Monlevade/MG",
      },
      {
        dayOffset: -2,
        hour: 15,
        minute: 50,
        description: "Mercadoria coletada no remetente",
        location: "Belo Horizonte - MG",
      },
    ],
  },
  {
    code: "TRL987654321",
    status: "Entregue",
    origin: "Curitiba - PR",
    destination: "Florianópolis - SC",
    currentLocation: "Entregue em Florianópolis - SC",
    driver: "Marcos Ferreira",
    vehicle: "Caminhão Volvo FH - Placa QPR-5C88",
    progress: 100,
    delivered: { dayOffset: -1, hour: 11, minute: 20 },
    events: [
      {
        dayOffset: -1,
        hour: 11,
        minute: 20,
        description: "Entrega realizada - recebido por M. ANDRADE",
        location: "Florianópolis - SC",
      },
      {
        dayOffset: -1,
        hour: 7,
        minute: 40,
        description: "Saiu para entrega",
        location: "CD Florianópolis - SC",
      },
      {
        dayOffset: -2,
        hour: 19,
        minute: 5,
        description: "Chegada ao centro de distribuição de destino",
        location: "Florianópolis - SC",
      },
      {
        dayOffset: -3,
        hour: 13,
        minute: 30,
        description: "Mercadoria coletada no remetente",
        location: "Curitiba - PR",
      },
    ],
  },
  {
    code: "TRL444222333",
    status: "Coleta Agendada",
    origin: "Campinas - SP",
    destination: "Ribeirão Preto - SP",
    currentLocation: "Aguardando coleta no remetente - Campinas/SP",
    driver: "Juliana Prado",
    vehicle: "Caminhão Iveco Tector - Placa KLM-3011",
    progress: 10,
    delivery: { dayOffset: 2, hour: 17, minute: 0 },
    events: [
      {
        dayOffset: 0,
        hour: 8,
        minute: 0,
        description: "Coleta agendada",
        location: "Sistema ESCORTinRoad",
        current: true,
      },
    ],
  },
];

/** Aceita minusculas e espacos sobrando: "trl 123456789" vira "TRL123456789". */
export function normalizeTrackingCode(code: string) {
  return code.replace(/\s+/g, "").toUpperCase();
}

export function isValidTrackingCode(code: string) {
  return TRACKING_CODE_PATTERN.test(normalizeTrackingCode(code));
}

function toDate({ dayOffset, hour, minute }: { dayOffset: number; hour: number; minute: number }) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
}

/** Devolve a carga do codigo informado, ou null quando nao existe nenhuma. */
export function findShipment(code: string): Shipment | null {
  const normalized = normalizeTrackingCode(code);
  const seed = shipmentSeeds.find((shipment) => shipment.code === normalized);
  if (!seed) return null;

  return {
    code: seed.code,
    status: seed.status,
    origin: seed.origin,
    destination: seed.destination,
    currentLocation: seed.currentLocation,
    driver: seed.driver,
    vehicle: seed.vehicle,
    progress: seed.progress,
    estimatedDelivery: seed.delivery ? toDate(seed.delivery) : null,
    deliveredAt: seed.delivered ? toDate(seed.delivered) : null,
    events: seed.events.map((event) => ({
      at: toDate(event),
      description: event.description,
      location: event.location,
      current: event.current ?? false,
    })),
  };
}

/** Codigos oferecidos na tela para teste, como as contas de demonstracao do login. */
export const sampleTrackingCodes = shipmentSeeds.map(({ code, status }) => ({ code, status }));
