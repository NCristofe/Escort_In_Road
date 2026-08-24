/**
 * Base de dados de assinatura, faturamento e chaves de API.
 *
 * A fonte de verdade é o preço mensal de cada plano. Ciclo anual, parcelamento,
 * cupom e total do checkout são todos derivados dele, para que o resumo do
 * pedido nunca divirja do valor cobrado na fatura.
 */

export type PlanId = "gratuito" | "premium";

export type BillingCycle = "mensal" | "anual";

/** Desconto aplicado ao contratar o ciclo anual, de 0 a 1. */
export const ANNUAL_DISCOUNT_RATE = 0.2;

/** Numero maximo de parcelas sem juros no ciclo anual. */
export const MAX_INSTALLMENTS = 12;

export type PlanLimits = {
  /** Embarques que o plano comporta por mes. */
  shipmentsPerMonth: number;
  /** Usuarios simultaneos na conta. */
  users: number;
  /** Chamadas de API por mes. Zero significa que o plano nao expoe API. */
  apiCallsPerMonth: number;
  /** Chaves de integracao ativas ao mesmo tempo. */
  apiKeys: number;
};

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  /** Preco cheio por mes, em reais, no ciclo mensal. */
  monthlyPrice: number;
  limits: PlanLimits;
  features: string[];
  /** Recursos ausentes, exibidos riscados no comparativo. */
  missing: string[];
};

export const plans: Record<PlanId, Plan> = {
  gratuito: {
    id: "gratuito",
    name: "Gratuito",
    tagline: "Para quem está começando a organizar a operação.",
    monthlyPrice: 0,
    limits: { shipmentsPerMonth: 50, users: 3, apiCallsPerMonth: 0, apiKeys: 0 },
    features: [
      "Até 50 embarques por mês",
      "3 usuários na conta",
      "Rastreamento de cargas",
      "Cadastro de cargas e gestão de lotes",
      "Suporte por e-mail em horário comercial",
    ],
    missing: [
      "Painel ESG e relatórios de CO2",
      "Comparativo financeiro de frete",
      "Indicadores de performance da frota",
      "Chaves de API para integração com ERP",
      "Suporte 24/7 com gerente dedicado",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    tagline: "Para operações que precisam de dados, integração e escala.",
    monthlyPrice: 890,
    limits: { shipmentsPerMonth: 1500, users: 25, apiCallsPerMonth: 100000, apiKeys: 10 },
    features: [
      "Até 1.500 embarques por mês",
      "25 usuários na conta",
      "Painel ESG com relatório de CO2 em PDF",
      "Comparativo Frete Comum x Frete Escort",
      "Indicadores de tempo de match e eficiência",
      "100.000 chamadas de API por mês",
      "Até 10 chaves de integração com ERP",
      "Suporte 24/7 com gerente de conta dedicado",
    ],
    missing: [],
  },
};

export const planList: Plan[] = [plans.gratuito, plans.premium];

/** Preco do plano no ciclo escolhido, ja com o desconto anual aplicado. */
export function cyclePrice(planId: PlanId, cycle: BillingCycle) {
  const monthly = plans[planId].monthlyPrice;
  if (cycle === "mensal") return monthly;
  return Math.round(monthly * 12 * (1 - ANNUAL_DISCOUNT_RATE));
}

/** Custo mensal equivalente, usado para comparar os dois ciclos lado a lado. */
export function monthlyEquivalent(planId: PlanId, cycle: BillingCycle) {
  const price = cyclePrice(planId, cycle);
  return cycle === "anual" ? price / 12 : price;
}

export type Coupon = {
  code: string;
  label: string;
  /** Desconto percentual sobre o subtotal, de 0 a 1. */
  rate: number;
  /** Ciclos em que o cupom é aceito. */
  cycles: BillingCycle[];
};

export const coupons: Coupon[] = [
  { code: "ESCORT10", label: "10% de desconto", rate: 0.1, cycles: ["mensal", "anual"] },
  { code: "LOGISTICA25", label: "25% no primeiro ano", rate: 0.25, cycles: ["anual"] },
  { code: "MIGRACAO15", label: "15% para migração de ERP", rate: 0.15, cycles: ["mensal", "anual"] },
];

export function findCoupon(code: string) {
  const normalized = code.trim().toUpperCase();
  return coupons.find((coupon) => coupon.code === normalized) ?? null;
}

export type OrderSummary = {
  /** Preco de tabela do ciclo, antes de qualquer desconto. */
  listPrice: number;
  /** Economia obtida ao escolher o ciclo anual. */
  cycleDiscount: number;
  /** Economia obtida pelo cupom aplicado. */
  couponDiscount: number;
  total: number;
  /** Valor de cada parcela, se parcelado. */
  installmentValue: number;
};

export function summarizeOrder(
  planId: PlanId,
  cycle: BillingCycle,
  coupon: Coupon | null,
  installments: number,
): OrderSummary {
  const monthly = plans[planId].monthlyPrice;
  const listPrice = cycle === "anual" ? monthly * 12 : monthly;
  const afterCycle = cyclePrice(planId, cycle);
  const cycleDiscount = listPrice - afterCycle;

  const couponApplies = coupon ? coupon.cycles.includes(cycle) : false;
  const couponDiscount = couponApplies && coupon ? Math.round(afterCycle * coupon.rate) : 0;
  const total = afterCycle - couponDiscount;

  return {
    listPrice,
    cycleDiscount,
    couponDiscount,
    total,
    installmentValue: total / Math.max(installments, 1),
  };
}

/** Parcelas disponiveis para o ciclo. O mensal é sempre cobrado à vista. */
export function installmentOptions(cycle: BillingCycle) {
  if (cycle === "mensal") return [1];
  return Array.from({ length: MAX_INSTALLMENTS }, (_, index) => index + 1);
}

/* -------------------------------------------------------------------------- */
/* Meios de pagamento                                                          */
/* -------------------------------------------------------------------------- */

export type PaymentMethodId = "cartao" | "pix" | "boleto";

export const paymentMethods: { id: PaymentMethodId; label: string; note: string }[] = [
  { id: "cartao", label: "Cartão de crédito", note: "Liberação imediata, renovação automática." },
  { id: "pix", label: "PIX", note: "Confirmação em minutos, sem renovação automática." },
  { id: "boleto", label: "Boleto bancário", note: "Compensação em até 3 dias úteis." },
];

export type CardBrand = "visa" | "mastercard" | "amex" | "elo" | "hipercard" | "desconhecida";

const brandLabels: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  elo: "Elo",
  hipercard: "Hipercard",
  desconhecida: "Cartão",
};

export function cardBrandLabel(brand: CardBrand) {
  return brandLabels[brand];
}

/** Identifica a bandeira pelo BIN. Cobre as bandeiras com presença no Brasil. */
export function detectCardBrand(value: string): CardBrand {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "desconhecida";

  if (/^4/.test(digits)) return "visa";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(38|60)/.test(digits)) return "hipercard";
  if (/^(4011|4312|4389|5041|5067|509|627780|636297|636368|650|6516|6550)/.test(digits)) return "elo";
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(digits)) return "mastercard";
  return "desconhecida";
}

/** Quantidade de digitos esperada pela bandeira (Amex usa 15). */
export function cardLength(brand: CardBrand) {
  return brand === "amex" ? 15 : 16;
}

export function cvvLength(brand: CardBrand) {
  return brand === "amex" ? 4 : 3;
}

/** Agrupamento visual dos digitos. Amex usa 4-6-5, as demais 4-4-4-4. */
export function formatCardNumber(value: string) {
  const brand = detectCardBrand(value);
  const digits = value.replace(/\D/g, "").slice(0, cardLength(brand));
  const groups = brand === "amex" ? [4, 6, 5] : [4, 4, 4, 4];

  const parts: string[] = [];
  let cursor = 0;
  for (const size of groups) {
    if (cursor >= digits.length) break;
    parts.push(digits.slice(cursor, cursor + size));
    cursor += size;
  }
  return parts.join(" ");
}

/** Validacao de digito verificador (algoritmo de Luhn). */
export function isValidCardNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  const brand = detectCardBrand(digits);
  if (digits.length !== cardLength(brand)) return false;

  let sum = 0;
  let double = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Aceita MM/AA e recusa mes invalido ou validade ja vencida. */
export function isValidExpiry(value: string, now = new Date()) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;

  // O cartao vale ate o ultimo instante do mes impresso.
  const expiry = new Date(year, month, 1);
  return expiry > now;
}

export function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

/** Validacao dos dois digitos verificadores do CNPJ. */
export function isValidCnpj(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const checkDigit = (length: number) => {
    let weight = length - 7;
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(digits[index]) * weight;
      weight -= 1;
      if (weight < 2) weight = 9;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  return checkDigit(12) === Number(digits[12]) && checkDigit(13) === Number(digits[13]);
}

/* -------------------------------------------------------------------------- */
/* Faturas e consumo                                                           */
/* -------------------------------------------------------------------------- */

export type InvoiceStatus = "paga" | "aberta" | "vencida" | "estornada";

export type Invoice = {
  id: string;
  /** Competencia no formato AAAA-MM. */
  period: string;
  issuedAt: string;
  dueAt: string;
  paidAt: string | null;
  amount: number;
  status: InvoiceStatus;
  method: PaymentMethodId;
  description: string;
};

export const invoiceStatusLabels: Record<InvoiceStatus, { label: string; className: string }> = {
  paga: { label: "Paga", className: "bg-green-50 text-green-700" },
  aberta: { label: "Em aberto", className: "bg-amber-50 text-amber-700" },
  vencida: { label: "Vencida", className: "bg-red-50 text-red-700" },
  estornada: { label: "Estornada", className: "bg-gray-100 text-gray-600" },
};

export const invoices: Invoice[] = [
  {
    id: "FAT-2026-0812",
    period: "2026-08",
    issuedAt: "2026-08-01",
    dueAt: "2026-08-10",
    paidAt: null,
    amount: 890,
    status: "aberta",
    method: "boleto",
    description: "Premium mensal · agosto/2026",
  },
  {
    id: "FAT-2026-0711",
    period: "2026-07",
    issuedAt: "2026-07-01",
    dueAt: "2026-07-10",
    paidAt: "2026-07-08",
    amount: 890,
    status: "paga",
    method: "cartao",
    description: "Premium mensal · julho/2026",
  },
  {
    id: "FAT-2026-0610",
    period: "2026-06",
    issuedAt: "2026-06-01",
    dueAt: "2026-06-10",
    paidAt: "2026-06-09",
    amount: 890,
    status: "paga",
    method: "cartao",
    description: "Premium mensal · junho/2026",
  },
  {
    id: "FAT-2026-0509",
    period: "2026-05",
    issuedAt: "2026-05-01",
    dueAt: "2026-05-10",
    paidAt: "2026-05-15",
    amount: 890,
    status: "paga",
    method: "pix",
    description: "Premium mensal · maio/2026",
  },
  {
    id: "FAT-2026-0408",
    period: "2026-04",
    issuedAt: "2026-04-01",
    dueAt: "2026-04-10",
    paidAt: "2026-04-07",
    amount: 890,
    status: "paga",
    method: "cartao",
    description: "Premium mensal · abril/2026",
  },
  {
    id: "FAT-2026-0307",
    period: "2026-03",
    issuedAt: "2026-03-01",
    dueAt: "2026-03-10",
    paidAt: "2026-03-06",
    amount: 140,
    status: "estornada",
    method: "cartao",
    description: "Excedente de embarques · março/2026",
  },
  {
    id: "FAT-2026-0206",
    period: "2026-02",
    issuedAt: "2026-02-01",
    dueAt: "2026-02-10",
    paidAt: "2026-02-05",
    amount: 890,
    status: "paga",
    method: "cartao",
    description: "Premium mensal · fevereiro/2026",
  },
  {
    id: "FAT-2026-0105",
    period: "2026-01",
    issuedAt: "2026-01-01",
    dueAt: "2026-01-10",
    paidAt: "2026-01-09",
    amount: 890,
    status: "paga",
    method: "cartao",
    description: "Premium mensal · janeiro/2026",
  },
];

export type UsageMetric = {
  id: string;
  label: string;
  used: number;
  /** Unidade exibida ao lado do numero. */
  unit: string;
  /** Le o teto correspondente no plano contratado. */
  limitOf: (limits: PlanLimits) => number;
};

export const usageMetrics: UsageMetric[] = [
  {
    id: "shipments",
    label: "Embarques no mês",
    used: 1183,
    unit: "embarques",
    limitOf: (limits) => limits.shipmentsPerMonth,
  },
  { id: "users", label: "Usuários ativos", used: 17, unit: "usuários", limitOf: (limits) => limits.users },
  {
    id: "apiCalls",
    label: "Chamadas de API",
    used: 64820,
    unit: "chamadas",
    limitOf: (limits) => limits.apiCallsPerMonth,
  },
];

/* -------------------------------------------------------------------------- */
/* Chaves de API                                                               */
/* -------------------------------------------------------------------------- */

export type ApiScope = "shipments:read" | "shipments:write" | "tracking:read" | "invoices:read" | "webhooks:manage";

export const apiScopes: { id: ApiScope; label: string; description: string }[] = [
  { id: "shipments:read", label: "Ler embarques", description: "Consultar cargas, status e histórico de coletas." },
  { id: "shipments:write", label: "Criar embarques", description: "Registrar cargas e lotes direto do ERP." },
  { id: "tracking:read", label: "Rastreamento", description: "Posição do veículo e eventos de entrega." },
  { id: "invoices:read", label: "Faturamento", description: "Baixar faturas e conciliar pagamentos." },
  { id: "webhooks:manage", label: "Webhooks", description: "Registrar endpoints para notificações de evento." },
];

export type ApiEnvironment = "producao" | "sandbox";

export type ApiKey = {
  id: string;
  name: string;
  environment: ApiEnvironment;
  /** Prefixo visivel da chave. O segredo completo só existe no momento da criação. */
  prefix: string;
  scopes: ApiScope[];
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

export const initialApiKeys: ApiKey[] = [
  {
    id: "key_8f21c4",
    name: "Integração TOTVS Protheus",
    environment: "producao",
    prefix: "eir_live_8f21c4",
    scopes: ["shipments:read", "shipments:write", "tracking:read"],
    createdAt: "2026-03-14",
    lastUsedAt: "2026-08-24",
    revokedAt: null,
  },
  {
    id: "key_2b90de",
    name: "Conciliação financeira",
    environment: "producao",
    prefix: "eir_live_2b90de",
    scopes: ["invoices:read"],
    createdAt: "2026-05-02",
    lastUsedAt: "2026-08-23",
    revokedAt: null,
  },
  {
    id: "key_55ac10",
    name: "Homologação SAP",
    environment: "sandbox",
    prefix: "eir_test_55ac10",
    scopes: ["shipments:read", "shipments:write", "tracking:read", "webhooks:manage"],
    createdAt: "2026-06-19",
    lastUsedAt: "2026-08-20",
    revokedAt: null,
  },
  {
    id: "key_c7e330",
    name: "Piloto e-commerce (desativada)",
    environment: "producao",
    prefix: "eir_live_c7e330",
    scopes: ["shipments:read"],
    createdAt: "2026-01-08",
    lastUsedAt: "2026-04-30",
    revokedAt: "2026-05-04",
  },
];

/**
 * Gera um segredo de API com entropia criptografica.
 *
 * `crypto.getRandomValues` é obrigatorio aqui: `Math.random` não é seguro para
 * material de autenticacao. Em producao a chave deve nascer no servidor, que
 * guarda apenas o hash — o texto puro é exibido uma unica vez, na criacao.
 */
export function generateApiSecret(environment: ApiEnvironment) {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  const secret = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  const scope = environment === "producao" ? "live" : "test";
  return `eir_${scope}_${secret}`;
}

/** O prefixo é a parte da chave que pode ser reexibida com segurança. */
export function secretPrefix(secret: string) {
  return secret.slice(0, secret.lastIndexOf("_") + 7);
}

export const apiBaseUrl = "https://api.escortinroad.com.br/v1";
