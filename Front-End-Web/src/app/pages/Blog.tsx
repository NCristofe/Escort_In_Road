import { ArrowRight, Calendar, Tag } from "lucide-react";
import { Link } from "react-router";
import { PageHero } from "../components/PageHero";

export function Blog() {
  const posts = [
    {
      title: "Como reduzir custos no transporte rodoviário sem perder SLA",
      category: "Gestão logística",
      date: "22/05/2026",
      text: "Veja como consolidação de cargas, roteirização e indicadores ajudam a equilibrar custo e prazo.",
    },
    {
      title: "Carga fracionada ou carga completa: quando usar cada modelo",
      category: "Transporte",
      date: "18/05/2026",
      text: "Entenda as diferenças entre LTL e FTL para escolher a opção mais eficiente por operação.",
    },
    {
      title: "Rastreamento de cargas como diferencial na experiência do cliente",
      category: "Tecnologia",
      date: "10/05/2026",
      text: "Visibilidade, comunicação e previsibilidade reduzem atrito entre embarcador, transportadora e destinatário.",
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Conteúdos"
        title="Blog de logística e transporte"
        description="Materiais para apoiar decisões sobre transporte, armazenagem, rastreamento e eficiência operacional."
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.title} className="bg-gray-50 rounded-xl p-7 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {post.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-6 flex-1">{post.text}</p>
              <Link to="/contato" className="text-orange-600 font-bold inline-flex items-center gap-2 hover:text-orange-700">
                Conversar sobre o tema
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
