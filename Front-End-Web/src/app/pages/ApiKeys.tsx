import { useState } from "react";
import { Link } from "react-router";
import { Copy, KeyRound, Lock, Plus, Sparkles, XCircle } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { useAuth } from "../auth/AuthContext";
import { getSubscription } from "../lib/subscription";
import { generateApiKey, getApiKeys, maskToken, revokeApiKey, type ApiKey } from "../lib/apiKeys";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR");
}

export function ApiKeys() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>(() => (user ? getApiKeys(user.email) : []));
  const [label, setLabel] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedId, setRevealedId] = useState<string | null>(null);

  if (!user) return null;

  const subscription = getSubscription(user.email);
  const isPremium = subscription.plan === "premium";

  const handleGenerate = () => {
    const created = generateApiKey(user.email, label);
    setKeys(getApiKeys(user.email));
    setRevealedId(created.id);
    setLabel("");
  };

  const handleRevoke = (id: string) => {
    revokeApiKey(user.email, id);
    setKeys(getApiKeys(user.email));
  };

  const handleCopy = async (key: ApiKey) => {
    try {
      await navigator.clipboard.writeText(key.token);
      setCopiedId(key.id);
      setTimeout(() => setCopiedId((current) => (current === key.id ? null : current)), 2000);
    } catch {
      // clipboard indisponivel - ignora silenciosamente
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Painel de Chaves de API"
        title="Integre sua operacao ao ERP da empresa"
        description="Gere e gerencie tokens de integracao para conectar o Escort in Road ao seu sistema de gestao."
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isPremium ? (
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl mx-auto">
              <Lock className="w-14 h-14 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recurso exclusivo do plano Premium</h2>
              <p className="text-gray-600 mb-6">
                Faca upgrade para gerar chaves de API e integrar o Escort in Road com o ERP da sua empresa.
              </p>
              <Link
                to="/checkout-assinatura"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Fazer upgrade para Premium
              </Link>
            </div>
          ) : (
            <div className="grid gap-8">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <KeyRound className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Gerar nova chave</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                    placeholder="Nome da integracao (ex: ERP SAP producao)"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                  />
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="bg-orange-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Gerar chave
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Chaves geradas</h2>
                </div>

                {keys.length === 0 ? (
                  <div className="p-10 text-center text-gray-500">
                    Nenhuma chave gerada ainda. Crie a primeira integracao acima.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {keys.map((key) => (
                      <div key={key.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{key.label}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                key.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {key.status === "active" ? "Ativa" : "Revogada"}
                            </span>
                          </div>
                          <code className="text-sm text-gray-600 break-all">
                            {revealedId === key.id ? key.token : maskToken(key.token)}
                          </code>
                          <div className="text-xs text-gray-400 mt-1">Criada em {formatDateTime(key.createdAt)}</div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setRevealedId((current) => (current === key.id ? null : key.id))}
                            className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-3 py-2"
                          >
                            {revealedId === key.id ? "Ocultar" : "Mostrar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(key)}
                            className="flex items-center gap-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedId === key.id ? "Copiado!" : "Copiar"}
                          </button>
                          {key.status === "active" && (
                            <button
                              type="button"
                              onClick={() => handleRevoke(key.id)}
                              className="flex items-center gap-2 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              Revogar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
