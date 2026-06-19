import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Building2, Lock, Mail, UserPlus } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = register(name, email, password);

    if (!success) {
      setError("Preencha nome, e-mail e uma senha com pelo menos 6 caracteres.");
      return;
    }

    navigate("/admin-usuarios", { replace: true });
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
            Cadastre um administrador
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Ao criar o cadastro, o usuario entra automaticamente e passa a ver as telas administrativas no menu.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cadastro</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
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
