import { Briefcase, CheckCircle, Mail, MapPin, Users } from "lucide-react";
import { PageHero } from "../components/PageHero";

export function Careers() {
  const jobs = [
    { role: "Motorista carreteiro", location: "São Paulo - SP", type: "Presencial" },
    { role: "Analista de logística", location: "São Paulo - SP", type: "Híbrido" },
    { role: "Assistente de atendimento", location: "Remoto", type: "Remoto" },
    { role: "Conferente de armazém", location: "Guarulhos - SP", type: "Presencial" },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Carreiras"
        title="Trabalhe com quem move operações reais"
        description="Buscamos pessoas comprometidas com segurança, atendimento, tecnologia e eficiência operacional."
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[380px_1fr] gap-10">
          <div>
            <Users className="w-10 h-10 text-orange-600 mb-5" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Faça parte da ESCORTinRoad</h2>
            <p className="text-gray-600 mb-6">
              Temos oportunidades em transporte, armazém, atendimento, comercial, tecnologia e áreas administrativas.
            </p>
            <div className="bg-orange-50 border-l-4 border-orange-600 p-5 rounded">
              <div className="font-bold text-gray-900 mb-1">Envie seu currículo</div>
              <div className="text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-600" />
                rh@escortinroad.com.br
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.role} className="bg-gray-50 border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
                <Briefcase className="w-7 h-7 text-orange-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{job.role}</h3>
                  <div className="text-gray-600 flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                </div>
                <span className="bg-white text-orange-700 px-4 py-2 rounded-lg font-bold text-sm">{job.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-5">
          {["Treinamento contínuo", "Cultura de segurança", "Crescimento por mérito"].map((item) => (
            <div key={item} className="bg-white rounded-xl p-6 shadow-md flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="font-bold text-gray-900">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
