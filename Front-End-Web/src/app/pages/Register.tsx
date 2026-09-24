import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Building2, Lock, Mail, Truck, UserPlus } from "lucide-react";
import { useAuth, type Role } from "../auth/AuthContext";

const accountTypes: { role: Extract<Role, "empresa" | "motorista">; label: string; description: string; icon: typeof Building2 }[] = [
  { role: "empresa", label: "Empresa", description: "Cadastra cargas e importa lotes.", icon: Building2 },
  { role: "motorista", label: "Motorista", description: "Consulta o mapa operacional.", icon: Truck },
];

const homeByRole: Record<Extract<Role, "empresa" | "motorista">, string> = {
  empresa: "/cadastro-cargas",
  motorista: "/mapa-operacional",
};

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Extract<Role, "empresa" | "motorista">>("empresa");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = register(name, email, password, role);

    if (!success) {
      setError("Preencha nome, e-mail e uma senha com pelo menos 6 caracteres. Verifique se o e-mail ja esta cadastrado.");
      return;
    }

    setError("");
    navigate(homeByRole[role], { replace: true });
  };

  return (
    <section className="min-h-[calc(100vh-220px)] bg-gray-50 py-16 flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_430px] gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold text-sm mb-6">
            <UserPlus className="w-4 h-4" />
            Novo acesso
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Crie seu cadastro
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Escolha o tipo de conta para liberar as telas certas: empresas publicam cargas e importam lotes, motoristas
            acompanham o mapa operacional. Contas administrativas nao sao criadas por aqui.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cadastro</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="block text-sm font-bold text-gray-700 mb-2">Tipo de conta</span>
              <div className="grid grid-cols-2 gap-3">
                {accountTypes.map((type) => (
                  <button
                    key={type.role}
                    type="button"
                    onClick={() => setRole(type.role)}
                    className={`text-left border-2 rounded-lg p-4 transition-colors ${
                      role === type.role ? "border-orange-600 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <type.icon className="w-5 h-5 text-orange-600 mb-2" />
                    <div className="font-bold text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="block text-sm font-bold text-gray-700 mb-2">Nome</span>
              <div className="relative">
                <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                />
              </div>
            </label>
            <label className="block">
              <span className="block text-sm font-bold text-gray-700 mb-2">E-mail</span>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                />
              </div>
            </label>
            <label className="block">
              <span className="block text-sm font-bold text-gray-700 mb-2">Senha</span>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  required
                  minLength={6}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                />
              </div>
            </label>

            {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}

            <button className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Criar conta
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-6 text-center">
            Ja tem acesso?{" "}
            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
