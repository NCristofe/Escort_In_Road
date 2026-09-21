import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Lock, LogIn, Mail, ShieldCheck } from "lucide-react";
import { useAuth, type Role } from "../auth/AuthContext";

type LocationState = {
  from?: string;
};

const demoAccounts: { role: Role; label: string; email: string; password: string }[] = [
  { role: "admin", label: "Administrador", email: "admin@escortinroad.com.br", password: "admin123" },
  { role: "empresa", label: "Empresa", email: "empresa@escortinroad.com.br", password: "empresa123" },
  { role: "motorista", label: "Motorista", email: "motorista@escortinroad.com.br", password: "motorista123" },
];

const homeByRole: Record<Role, string> = {
  admin: "/admin-usuarios",
  empresa: "/cadastro-cargas",
  motorista: "/mapa-operacional",
};

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@escortinroad.com.br");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const from = (location.state as LocationState | null)?.from;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = login(email, password);

    if (!success) {
      setError("E-mail ou senha invalidos. Use uma das contas de demonstracao ou crie um cadastro.");
      return;
    }

    setError("");
    navigate(from ?? homeByRole[demoAccounts.find((account) => account.email === email)?.role ?? "empresa"], {
      replace: true,
    });
  };

  return (
    <section className="min-h-[calc(100vh-220px)] bg-gray-50 py-16 flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_430px] gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold text-sm mb-6">
            <ShieldCheck className="w-4 h-4" />
            Acesso administrativo
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Entre para acessar as telas operacionais
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-8">
            As areas de cargas, lotes, mapa, documentos e usuarios ficam disponiveis somente apos autenticacao. O acesso a
            Central de Documentacao e a Gestao de Usuarios e restrito ao perfil Administrador.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="font-bold text-gray-900 mb-4">Contas de demonstracao</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                    setError("");
                  }}
                  className="text-left border-2 border-gray-200 rounded-lg p-4 hover:border-orange-400 hover:bg-orange-50 transition-colors"
                >
                  <div className="font-bold text-gray-900">{account.label}</div>
                  <div className="text-xs text-gray-500 break-words">{account.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                />
              </div>
            </label>

            {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}

            <button className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Entrar
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-6 text-center">
            Ainda nao tem conta?{" "}
            <Link to="/cadastro" className="font-bold text-orange-600 hover:text-orange-700">
              Criar cadastro
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
