import { Link } from "react-router";
import { Truck, Shield, MapPin, ArrowRight, CheckCircle, Package, Leaf, BadgeDollarSign } from "lucide-react";
import { SafeImage } from "../components/media/SafeImage";

export function Home() {
  const features = [
    {
      icon: BadgeDollarSign,
      title: "Frete Mais Barato",
      description: "O caminhão já faria a viagem de volta. Por isso o frete de retorno custa menos que um frete dedicado.",
    },
    {
      icon: Shield,
      title: "Pagamento Protegido",
      description: "O valor fica retido e só é repassado à transportadora depois da entrega confirmada.",
    },
    {
      icon: MapPin,
      title: "Rastreamento e Canhoto",
      description: "Acompanhe a viagem por GPS e receba a foto do canhoto assinado na entrega.",
    },
    {
      icon: Leaf,
      title: "Menos Caminhão Vazio",
      description: "Cada retorno ocupado evita quilômetros rodados sem carga e emissões de CO₂.",
    },
  ];

  const services = [
    {
      slug: "frete-de-retorno",
      title: "Frete de Retorno",
      description: "Para quem não tem frota: sua carga no caminhão que voltaria vazio pela sua rota.",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      slug: "ocupacao-de-frota",
      title: "Ocupação de Frota",
      description: "Para transportadoras: receita extra no trecho em que o caminhão voltaria vazio.",
      icon: Truck,
      color: "bg-orange-500",
    },
    {
      slug: "pagamento-protegido",
      title: "Pagamento Protegido",
      description: "Valor retido até a entrega confirmada e repassado à transportadora: 85% ECF, 15% Escort.",
      icon: Shield,
      color: "bg-green-500",
    },
  ];

  const stats = [
    { value: "2026", label: "Início do Projeto" },
    { value: "24/7", label: "Rastreamento Online" },
    { value: "3", label: "Perfis de Acesso" },
    { value: "ESG", label: "Painel de Emissões" },
  ];

  // How a return freight happens, in the order the platform runs it.
  const steps = [
    {
      title: "A transportadora informa o retorno",
      text: "A empresa com frota (ECF) cadastra o caminhão, a data em que ele fica livre e a rota que fará na volta.",
    },
    {
      title: "Quem contrata pede o frete",
      text: "A empresa sem frota (ESF) informa origem, destino, datas e o desvio máximo aceito. A plataforma sugere os retornos compatíveis.",
    },
    {
      title: "Entrega confirmada, pagamento liberado",
      text: "O motorista envia a foto do canhoto pelo aplicativo. Com a entrega confirmada, a Escort repassa o valor à transportadora.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                FRETE DE RETORNO
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                O caminhão volta. <span className="text-orange-500">Sua carga vai junto.</span>
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                A ESCORTinRoad conecta empresas que precisam transportar cargas a caminhões de transportadoras que fariam a viagem de volta vazios. Frete mais barato para quem contrata, receita extra para quem tem frota.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/cotacao"
                  className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-700 transition-colors inline-flex items-center gap-2 shadow-lg"
                >
                  Solicitar Cotação Grátis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/rastreamento"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Rastrear Carga
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-8 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Pagamento retido até a entrega</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Rastreamento por GPS</span>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-orange-600 rounded-full opacity-20 blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <SafeImage
                  src="https://images.unsplash.com/photo-1760662052295-f84068499a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwbG9naXN0aWNzfGVufDF8fHx8MTc3NDM2MDUyOXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Caminhão de transporte"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Por que Escolher a ESCORTinRoad?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma plataforma feita para o retorno ocioso, não para o frete comum
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-600"
              >
                <div className="bg-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Para quem contrata o frete e para quem tem o caminhão
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-orange-600"
              >
                <div className={`${service.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Link
                  to={`/servicos/${service.slug}`}
                  className="text-orange-600 hover:text-orange-700 font-bold inline-flex items-center gap-1 group"
                >
                  Saiba mais
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/servicos"
              className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
            >
              Ver Todos os Serviços
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600">
              Três passos, da rota de retorno ao pagamento
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="bg-gray-50 p-8 rounded-2xl shadow-md"
              >
                <div className="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-700">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Faça uma cotação gratuita e veja se há um caminhão voltando pela sua rota
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/cotacao"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              Solicitar Cotação Grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:08007771234"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Ligar: 0800 777 1234
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
