import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

type LegalPageProps = {
  title: string;
  updatedAt: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

function LegalPage({ title, updatedAt, sections }: LegalPageProps) {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-orange-100 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o início
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">{title}</h1>
          <p className="text-orange-100">Última atualização: {updatedAt}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.heading}</h2>
              <p className="text-gray-700 leading-7">{section.body}</p>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalPage
      title="Política de Privacidade"
      updatedAt="22/05/2026"
      sections={[
        {
          heading: "Coleta de dados",
          body: "Coletamos apenas as informações enviadas voluntariamente nos formulários de contato e cotação, como nome, e-mail, telefone, empresa e detalhes da solicitação logística.",
        },
        {
          heading: "Uso das informações",
          body: "Os dados são usados para responder solicitações, preparar propostas comerciais, prestar atendimento e melhorar a experiência nos canais digitais da ESCORTinRoad.",
        },
        {
          heading: "Contato",
          body: "Para dúvidas sobre privacidade ou atualização de informações, entre em contato pelo e-mail contato@escortinroad.com.br.",
        },
      ]}
    />
  );
}

export function TermsOfUse() {
  return (
    <LegalPage
      title="Termos de Uso"
      updatedAt="22/05/2026"
      sections={[
        {
          heading: "Uso do site",
          body: "Este site apresenta informações institucionais, serviços logísticos, canais de contato e uma experiência demonstrativa de rastreamento de cargas.",
        },
        {
          heading: "Cotações e atendimento",
          body: "As solicitações enviadas pelo formulário estão sujeitas à análise comercial. Prazos, valores e disponibilidade devem ser confirmados pela equipe da ESCORTinRoad.",
        },
        {
          heading: "Rastreamento demonstrativo",
          body: "Os dados exibidos na página de rastreamento são simulados para fins de demonstração e devem ser integrados a um sistema real antes do uso em produção.",
        },
      ]}
    />
  );
}
