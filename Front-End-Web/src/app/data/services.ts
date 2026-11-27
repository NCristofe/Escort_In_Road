export type Service = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  features: string[];
  idealFor: string[];
  metrics: Array<{
    value: string;
    label: string;
  }>;
  image: string;
};

/*
 * The ESCORTinRoad is a backhaul matching platform, not a carrier: it has no
 * fleet or warehouses. Every service here is part of filling the return trip
 * of an ECF (Empresa com Frota) truck with a load from an ESF (Empresa Sem
 * Frota), under the MVP rules in REGRAS_NEGOCIO_MVP.md.
 */
export const services: Service[] = [
  {
    slug: "frete-de-retorno",
    title: "Frete de Retorno",
    summary: "Sua carga no caminhão que já faria a viagem de volta vazio, por um preço menor.",
    description:
      "Depois de uma entrega, muitos caminhões voltam vazios. A ESCORTinRoad encontra, para a sua carga, um caminhão de transportadora (ECF) que já faria esse trajeto de volta. Como o custo da ida já foi pago, o frete de retorno sai mais barato do que um frete dedicado.",
    features: [
      "Busca por origem, destino e janela de datas",
      "Desvio máximo definido por quem contrata",
      "Horário específico, quando há caminhão disponível",
      "Somente transportadoras com frota verificada",
      "Rastreamento por GPS durante a viagem",
      "Pagamento liberado só após a entrega",
    ],
    idealFor: ["Indústrias", "Distribuidores", "Atacadistas", "Empresas sem frota própria"],
    metrics: [
      { value: "ESF", label: "contrata o frete" },
      { value: "ECF", label: "realiza a viagem" },
      { value: "GPS", label: "acompanhamento da carga" },
    ],
    image:
      "https://images.unsplash.com/photo-1760662052295-f84068499a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwbG9naXN0aWNzfGVufDF8fHx8MTc3NDM2MDUyOXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    slug: "ocupacao-de-frota",
    title: "Ocupação de Frota",
    summary: "Para transportadoras: receita extra no trecho em que o caminhão voltaria vazio.",
    description:
      "A transportadora (ECF) cadastra seus caminhões e informa quando cada um fica livre e qual rota fará na volta. A plataforma sugere as cargas compatíveis, e a ECF decide quais aceitar e quais desvios autorizar. O motorista continua sendo empregado da ECF e executa a viagem pelo aplicativo.",
    features: [
      "Cadastro de caminhões e de disponibilidade",
      "Sugestão de cargas compatíveis com o retorno",
      "Autorização de desvio de rota pela ECF",
      "Aplicativo do motorista com mapa e canhoto",
      "Repasse de 85% do frete bruto à ECF",
      "Painel de desempenho da frota",
    ],
    idealFor: ["Transportadoras regionais", "Frotas dedicadas", "Rotas com retorno ocioso", "Operações recorrentes"],
    metrics: [
      { value: "85%", label: "do frete bruto para a ECF" },
      { value: "1 app", label: "para o motorista" },
      { value: "0 km", label: "a mais sem autorização" },
    ],
    image:
      "https://images.unsplash.com/photo-1620059116993-398c21ce8406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGZsZWV0JTIwdHJhbnNwb3J0fGVufDF8fHx8MTc3NDQzODkyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    slug: "pagamento-protegido",
    title: "Pagamento Protegido",
    summary: "O valor fica retido e só é repassado à transportadora depois da entrega confirmada.",
    description:
      "Quem contrata paga o frete à Escort, que retém o valor em escrow. Quando o motorista envia a foto do canhoto e a entrega é confirmada, a Escort repassa 85% à transportadora (ECF) e fica com 15%. Sem entrega confirmada, o valor não é liberado.",
    features: [
      "Valor retido em escrow até a entrega",
      "Liberação automática com o canhoto confirmado",
      "Divisão transparente: 85% ECF e 15% Escort",
      "Reembolso quando o frete não é realizado",
      "Notificações do gateway com assinatura verificada",
      "Histórico de cada pagamento",
    ],
    idealFor: ["Primeiras contratações", "Novos parceiros", "Cargas de maior valor", "Operações auditadas"],
    metrics: [
      { value: "85/15", label: "divisão padrão do frete" },
      { value: "100%", label: "liberações com entrega confirmada" },
      { value: "HMAC", label: "webhooks assinados" },
    ],
    image:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1080&q=80",
  },
  {
    slug: "rastreamento-e-canhoto",
    title: "Rastreamento e Canhoto",
    summary: "Acompanhe a viagem por GPS e receba a foto do canhoto assim que a carga é entregue.",
    description:
      "Durante a viagem, o aplicativo do motorista envia a localização do caminhão. Na entrega, o motorista fotografa o canhoto assinado, que comprova a entrega e libera o pagamento retido.",
    features: [
      "Posição do caminhão durante a viagem",
      "Etapas: coleta, em trânsito e entrega",
      "Foto do canhoto pelo aplicativo",
      "Envio guardado quando falta sinal",
      "Consulta pelo código de rastreamento",
      "Histórico de cada viagem",
    ],
    idealFor: ["Quem contrata", "Transportadoras", "Equipes de atendimento", "Conferência de entregas"],
    metrics: [
      { value: "GPS", label: "durante a viagem" },
      { value: "Foto", label: "do canhoto assinado" },
      { value: "24/7", label: "consulta online" },
    ],
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1080&q=80",
  },
  {
    slug: "indicadores-esg",
    title: "Indicadores ESG",
    summary: "Quilômetros vazios evitados e emissões de CO₂ que deixaram de acontecer.",
    description:
      "Cada viagem de retorno ocupada evita que outro caminhão rode só para levar a mesma carga. O painel ESG estima os quilômetros vazios evitados, o diesel economizado e as emissões de CO₂ evitadas, com relatório em PDF.",
    features: [
      "Quilômetros vazios evitados",
      "Diesel economizado",
      "Emissões de CO₂ evitadas",
      "Visão por período e por rota",
      "Relatório em PDF",
      "Dados para relatórios de sustentabilidade",
    ],
    idealFor: ["Metas de sustentabilidade", "Relatórios ESG", "Áreas de compras", "Diretoria"],
    metrics: [
      { value: "CO₂", label: "emissões evitadas" },
      { value: "km", label: "vazios evitados" },
      { value: "PDF", label: "relatório exportável" },
    ],
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1080&q=80",
  },
];

export function getServiceBySlug(slug: string | undefined) {
  return services.find((service) => service.slug === slug);
}
