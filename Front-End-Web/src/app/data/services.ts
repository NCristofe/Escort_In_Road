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

export const services: Service[] = [
  {
    slug: "carga-fracionada",
    title: "Carga Fracionada (LTL)",
    summary: "Transporte de pequenos e médios volumes com consolidação inteligente de cargas.",
    description:
      "A carga fracionada é indicada para empresas que precisam enviar volumes menores sem contratar um veículo exclusivo. A ESCORTinRoad consolida cargas compatíveis, otimiza rotas e mantém rastreamento durante toda a operação.",
    features: [
      "Coletas programadas e recorrentes",
      "Rastreamento por código de embarque",
      "Seguro automático de carga",
      "Consolidação para redução de custo",
      "Prazos definidos por região",
      "Atendimento nacional",
    ],
    idealFor: ["Indústrias", "Distribuidores", "E-commerces B2B", "Atacadistas"],
    metrics: [
      { value: "24h", label: "para iniciar coleta" },
      { value: "100%", label: "carga rastreável" },
      { value: "27", label: "UFs atendidas" },
    ],
    image:
      "https://images.unsplash.com/photo-1760662052295-f84068499a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwbG9naXN0aWNzfGVufDF8fHx8MTc3NDM2MDUyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    slug: "carga-completa",
    title: "Carga Completa (FTL)",
    summary: "Veículo dedicado para grandes volumes, rotas diretas e operações urgentes.",
    description:
      "A carga completa atende operações que precisam de exclusividade, previsibilidade e menor manuseio. O veículo sai dedicado ao embarcador, com rota planejada de acordo com o prazo, tipo de carga e destino.",
    features: [
      "Veículo exclusivo para a operação",
      "Rota direta e personalizada",
      "Menor manuseio da mercadoria",
      "Motoristas qualificados",
      "Opções de veículos por perfil de carga",
      "Monitoramento ativo da viagem",
    ],
    idealFor: ["Grandes volumes", "Urgências", "Carga paletizada", "Operações dedicadas"],
    metrics: [
      { value: "800+", label: "veículos na frota" },
      { value: "24/7", label: "monitoramento" },
      { value: "99%", label: "cumprimento de SLA" },
    ],
    image:
      "https://images.unsplash.com/photo-1620059116993-398c21ce8406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGZsZWV0JTIwdHJhbnNwb3J0fGVufDF8fHx8MTc3NDQzODkyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    slug: "armazenagem",
    title: "Armazenagem e Distribuição",
    summary: "Gestão de estoque, separação, expedição e distribuição em centros estratégicos.",
    description:
      "A operação de armazenagem conecta estoque, pedidos e transporte em uma rotina única. A ESCORTinRoad apoia empresas que precisam de visibilidade de inventário, agilidade na expedição e distribuição regional.",
    features: [
      "Controle de estoque em tempo real",
      "Picking, packing e expedição",
      "Cross-docking",
      "Gestão por WMS",
      "Inventários cíclicos",
      "Distribuição integrada",
    ],
    idealFor: ["E-commerces", "Indústrias", "Varejo", "Distribuidores regionais"],
    metrics: [
      { value: "12", label: "CDs parceiros" },
      { value: "98%", label: "acuracidade" },
      { value: "D+0", label: "expedição possível" },
    ],
    image:
      "https://images.unsplash.com/photo-1578351709091-33ee78a1565d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBzaGlwcGluZ3xlbnwxfHx8fDE3NzQ0Mzg5MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    slug: "entregas-expressas",
    title: "Entregas Expressas",
    summary: "Operações rápidas para demandas críticas, com priorização de coleta e entrega.",
    description:
      "Quando o prazo é determinante, a entrega expressa prioriza o embarque, reduz paradas intermediárias e acompanha a carga com comunicação ativa até a finalização.",
    features: [
      "Coleta prioritária",
      "Rotas de menor tempo",
      "Acompanhamento dedicado",
      "Comprovação de entrega",
      "Comunicação proativa",
      "Suporte em janelas críticas",
    ],
    idealFor: ["Reposição urgente", "Peças críticas", "Eventos", "Operações promocionais"],
    metrics: [
      { value: "2h", label: "triagem inicial" },
      { value: "24h", label: "suporte" },
      { value: "SLA", label: "dedicado" },
    ],
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1080&q=80",
  },
  {
    slug: "cargas-especiais",
    title: "Cargas Especiais",
    summary: "Transporte com planejamento técnico para cargas sensíveis, pesadas ou reguladas.",
    description:
      "Cargas especiais exigem análise prévia, documentação adequada, veículo compatível e plano de risco. A equipe técnica dimensiona cada etapa para reduzir exposição e garantir conformidade.",
    features: [
      "Análise técnica da carga",
      "Plano de transporte e risco",
      "Veículos e equipamentos adequados",
      "Documentação operacional",
      "Seguro sob medida",
      "Monitoramento reforçado",
    ],
    idealFor: ["Máquinas", "Equipamentos sensíveis", "Cargas de alto valor", "Produtos regulados"],
    metrics: [
      { value: "100%", label: "operação planejada" },
      { value: "ISO", label: "boas práticas" },
      { value: "24/7", label: "controle de risco" },
    ],
    image:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1080&q=80",
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    summary: "Logística para lojas virtuais com coleta, armazenagem, expedição e tracking.",
    description:
      "A solução para e-commerce integra estoque, pedidos, expedição e entrega para melhorar a previsibilidade do cliente final e reduzir gargalos operacionais.",
    features: [
      "Integração com rotina de pedidos",
      "Separação e embalagem",
      "Rastreamento para cliente final",
      "Logística reversa",
      "Gestão de picos sazonais",
      "Indicadores de entrega",
    ],
    idealFor: ["Lojas virtuais", "Marketplaces", "Assinaturas", "Varejo omnichannel"],
    metrics: [
      { value: "D+0", label: "expedição possível" },
      { value: "360°", label: "visibilidade" },
      { value: "API", label: "integração" },
    ],
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1080&q=80",
  },
  {
    slug: "consultoria-logistica",
    title: "Consultoria Logística",
    summary: "Diagnóstico, redesenho de processos e otimização de custos operacionais.",
    description:
      "A consultoria avalia rotas, custos, prazos, armazenagem e indicadores para propor uma operação mais eficiente, previsível e alinhada ao crescimento da empresa.",
    features: [
      "Diagnóstico de operação",
      "Mapeamento de custos",
      "Redesenho de rotas",
      "Indicadores de performance",
      "Plano de implantação",
      "Acompanhamento executivo",
    ],
    idealFor: ["Operações em crescimento", "Redução de custo", "Reestruturação logística", "Novas regiões"],
    metrics: [
      { value: "30 dias", label: "diagnóstico inicial" },
      { value: "KPI", label: "gestão por dados" },
      { value: "ROI", label: "foco em retorno" },
    ],
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1080&q=80",
  },
];

export function getServiceBySlug(slug: string | undefined) {
  return services.find((service) => service.slug === slug);
}
