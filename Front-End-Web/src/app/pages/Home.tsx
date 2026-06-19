import { Link } from "react-router";
import { Truck, Clock, Shield, MapPin, ArrowRight, CheckCircle, Package, Star, TrendingUp, Users } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Home() {
  const features = [
    {
      icon: Clock,
      title: "Agilidade nas Entregas",
      description: "Prazos garantidos e cumpridos com pontualidade em todas as rotas do Brasil.",
    },
    {
      icon: Shield,
      title: "Segurança Garantida",
      description: "Rastreamento 24h, seguros completos e equipe especializada.",
    },
    {
      icon: TrendingUp,
      title: "Tecnologia Avançada",
      description: "Plataforma digital para gestão completa de suas cargas.",
    },
    {
      icon: Users,
      title: "Atendimento Personalizado",
      description: "Equipe dedicada para atender suas necessidades específicas.",
    },
  ];

  const services = [
    {
      slug: "carga-fracionada",
      title: "Carga Fracionada",
      description: "Entregas rápidas de pequenos e médios volumes com segurança e eficiência",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      slug: "carga-completa",
      title: "Carga Completa (FTL)",
      description: "Dedicação exclusiva para grandes volumes com rotas otimizadas",
      icon: Truck,
      color: "bg-orange-500",
    },
    {
      slug: "armazenagem",
      title: "Armazenagem",
      description: "Centros de distribuição estratégicos com gestão inteligente de estoque",
      icon: MapPin,
      color: "bg-green-500",
    },
  ];

  const stats = [
    { value: "15+", label: "Anos de Mercado" },
    { value: "800+", label: "Caminhões" },
    { value: "100k+", label: "Entregas/Mês" },
    { value: "99%", label: "Satisfação" },
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      company: "Indústria XYZ",
      text: "Parceria de anos! A ESCORTinRoad sempre cumpre os prazos e tem um excelente custo-benefício.",
      rating: 5,
    },
    {
      name: "João Santos",
      company: "Comércio ABC",
      text: "Profissionalismo e comprometimento em todas as entregas. Recomendo!",
      rating: 5,
    },
    {
      name: "Ana Costa",
      company: "E-commerce Tech",
      text: "Sistema de rastreamento impecável. Sempre sabemos onde está nossa carga.",
      rating: 5,
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
                #1 EM TRANSPORTE RODOVIÁRIO
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Logística que <span className="text-orange-500">Move o Brasil</span>
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                A ESCORTinRoad oferece soluções completas em transporte rodoviário com tecnologia, segurança e eficiência para sua empresa crescer.
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
                  <span>Atendimento 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Cobertura Nacional</span>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-orange-600 rounded-full opacity-20 blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1760662052295-f84068499a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwbG9naXN0aWNzfGVufDF8fHx8MTc3NDM2MDUyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
              Somos referência em transporte rodoviário com diferenciais que fazem a diferença
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
              Soluções completas e personalizadas para cada tipo de necessidade
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
              O que Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-gray-600">
              Confiança conquistada através de resultados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl shadow-md"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.company}</div>
                </div>
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
            Faça uma cotação gratuita e descubra como podemos otimizar sua logística
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
