import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ArrowRight } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      content: "0800 777 1234",
      secondary: "(11) 3456-7890",
      description: "Atendimento 24h",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Mail,
      title: "E-mail",
      content: "contato@escortinroad.com.br",
      secondary: "comercial@escortinroad.com.br",
      description: "Respondemos em até 2h",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: MapPin,
      title: "Endereço",
      content: "Av. Logística, 1000",
      secondary: "São Paulo - SP, 01234-567",
      description: "Matriz São Paulo",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Segunda a Sexta",
      secondary: "8h às 18h",
      description: "Final de semana via WhatsApp",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Estamos prontos para atender você com as melhores soluções em transporte e logística
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className={`${info.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <info.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{info.title}</h3>
                <p className="text-lg font-bold text-gray-900 mb-1">{info.content}</p>
                <p className="text-sm text-gray-600 mb-2">{info.secondary}</p>
                <p className="text-xs text-gray-500">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Solicite uma Cotação Grátis
            </h2>
            <p className="text-lg text-gray-600">
              Preencha o formulário e receba uma proposta personalizada em até 2 horas
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl shadow-xl p-8 lg:p-12">
            {submitted ? (
              <div className="text-center py-12">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Mensagem Enviada!
                </h3>
                <p className="text-lg text-gray-600 mb-2">
                  Obrigado pelo contato, {formData.name}!
                </p>
                <p className="text-gray-500">
                  Nossa equipe entrará em contato em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                      E-mail Corporativo *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      placeholder="seu@email.com.br"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                      Telefone/WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      placeholder="(11) 98765-4321"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-bold text-gray-700 mb-2">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-bold text-gray-700 mb-2">
                    Serviço de Interesse *
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  >
                    <option value="">Selecione o serviço</option>
                    <option value="carga-fracionada">Carga Fracionada (LTL)</option>
                    <option value="carga-completa">Carga Completa (FTL)</option>
                    <option value="armazenagem">Armazenagem e Distribuição</option>
                    <option value="entrega-expressa">Entrega Expressa</option>
                    <option value="carga-especial">Cargas Especiais</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="consultoria">Consultoria Logística</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent resize-none"
                    placeholder="Descreva sua necessidade: origem, destino, frequência, tipo de carga, etc."
                  />
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    ✓ Resposta em até 2 horas úteis<br />
                    ✓ Orçamento sem compromisso<br />
                    ✓ Atendimento especializado
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-lg shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    Enviar Solicitação
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  * Campos obrigatórios
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA Alternative */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Prefere Falar Direto com um Especialista?
              </h2>
              <p className="text-lg text-gray-300">
                Ligue agora e tire todas as suas dúvidas com nossa equipe comercial
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <a
                href="tel:08007771234"
                className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <Phone className="w-5 h-5" />
                Ligar: 0800 777 1234
              </a>
              <a
                href="https://wa.me/5511987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                WhatsApp: (11) 98765-4321
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossa Sede em São Paulo
            </h2>
            <p className="text-lg text-gray-600">
              Visite-nos pessoalmente e conheça nossa estrutura
            </p>
          </div>

          <div className="bg-gray-300 rounded-2xl overflow-hidden h-96 flex items-center justify-center shadow-xl">
            <div className="text-center">
              <MapPin className="w-20 h-20 text-gray-500 mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-700">Av. Logística, 1000</p>
              <p className="text-gray-600">São Paulo - SP, 01234-567</p>
              <p className="text-sm text-gray-500 mt-2">Próximo ao Terminal de Cargas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}