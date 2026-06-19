import { Link } from "react-router";
import { HelpCircle, MessageCircle } from "lucide-react";
import { PageHero } from "../components/PageHero";

export function FAQ() {
  const questions = [
    {
      question: "Como solicito uma cotação?",
      answer: "Você pode preencher a página de cotação informando origem, destino, tipo de carga, volume e frequência. A equipe comercial retorna com a melhor alternativa operacional.",
    },
    {
      question: "O rastreamento é em tempo real?",
      answer: "O site já possui uma experiência demonstrativa de rastreamento. Em produção, ela pode ser conectada ao TMS/GPS para exibir eventos reais da carga.",
    },
    {
      question: "A carga possui seguro?",
      answer: "As operações podem incluir seguro conforme tipo de mercadoria, valor declarado, rota e perfil de risco. A cobertura é validada na cotação.",
    },
    {
      question: "Vocês atendem todo o Brasil?",
      answer: "Sim. A ESCORTinRoad atende todos os estados, com prazos que variam conforme região, rota, tipo de serviço e frequência.",
    },
    {
      question: "Quais dados são necessários para cotar?",
      answer: "Origem, destino, peso, dimensões, quantidade de volumes, valor da mercadoria, prazo desejado, frequência e restrições de coleta ou entrega.",
    },
    {
      question: "Vocês fazem logística reversa?",
      answer: "Sim. A logística reversa pode ser estruturada para e-commerce, varejo, assistência técnica e operações de troca ou devolução.",
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow="FAQ"
        title="Dúvidas frequentes"
        description="Respostas rápidas sobre cotação, prazos, rastreamento, seguro e operação logística."
      />
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          {questions.map((item) => (
            <div key={item.question} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{item.question}</h2>
                  <p className="text-gray-600 leading-7">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-orange-600 text-white rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ainda precisa de ajuda?</h2>
              <p className="text-orange-100">Nossa equipe responde dúvidas operacionais e comerciais.</p>
            </div>
            <Link to="/contato" className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Falar com atendimento
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
