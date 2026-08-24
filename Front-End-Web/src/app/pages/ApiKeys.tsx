import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Plus,
  ShieldAlert,
  Terminal,
  Trash2,
} from "lucide-react";
import { PageHero } from "../components/PageHero";
import { useSubscription } from "../billing/SubscriptionContext";
import {
  apiBaseUrl,
  apiScopes,
  generateApiSecret,
  type ApiEnvironment,
  type ApiScope,
} from "../data/billing";

const inputClass =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600";

const environments: { id: ApiEnvironment; label: string; note: string }[] = [
  { id: "producao", label: "Produção", note: "Opera sobre cargas e faturas reais." },
  { id: "sandbox", label: "Sandbox", note: "Dados fictícios, ideal para homologar o ERP." },
];

function formatDate(iso: string | null) {
  if (!iso) return "nunca usada";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function ApiKeys() {
  const { apiKeys, isPremium, keyQuota, activeKeyCount, createApiKey, revokeApiKey } = useSubscription();

  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState<ApiEnvironment>("sandbox");
  const [scopes, setScopes] = useState<ApiScope[]>(["shipments:read"]);
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);
  const [freshSecret, setFreshSecret] = useState<{ name: string; secret: string } | null>(null);
  const [secretVisible, setSecretVisible] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmingRevoke, setConfirmingRevoke] = useState<string | null>(null);

  const { active, revoked } = useMemo(
    () => ({
      active: apiKeys.filter((key) => !key.revokedAt),
      revoked: apiKeys.filter((key) => key.revokedAt),
    }),
    [apiKeys],
  );

  const quotaReached = activeKeyCount >= keyQuota;

  async function copyToClipboard(value: string, marker: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(marker);
      window.setTimeout(() => setCopied((current) => (current === marker ? null : current)), 2000);
    } catch {
      setFormError("O navegador bloqueou o acesso à área de transferência. Copie manualmente.");
    }
  }

  function toggleScope(scope: ApiScope) {
    setFormError("");
    setScopes((current) =>
      current.includes(scope) ? current.filter((item) => item !== scope) : [...current, scope],
    );
  }

  function handleCreate(event: FormEvent) {
    event.preventDefault();

    if (name.trim().length < 3) {
      setFormError("Dê um nome de pelo menos 3 caracteres para identificar a integração.");
      return;
    }
    if (scopes.length === 0) {
      setFormError("Selecione ao menos um escopo de acesso.");
      return;
    }
    if (quotaReached) {
      setFormError(`Seu plano permite ${keyQuota} chaves ativas. Revogue uma antes de criar outra.`);
      return;
    }

    const secret = generateApiSecret(environment);
    createApiKey({ name, environment, scopes, secret });

    setFreshSecret({ name: name.trim(), secret });
    setSecretVisible(false);
    setName("");
    setScopes(["shipments:read"]);
    setFormError("");
    setCreating(false);
  }

  if (!isPremium) {
    return (
      <div>
        <PageHero
          eyebrow="Integrações"
          title="Chaves de API"
          description="Conecte a ESCORTinRoad ao seu ERP e troque embarques, rastreamento e faturas automaticamente."
        />
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
                <Lock className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Disponível no plano Premium</h2>
              <p className="text-gray-600 mb-6">
                As chaves de integração liberam a API REST da ESCORTinRoad para o seu TOTVS, SAP, Senior ou
                sistema próprio — com até 100.000 chamadas por mês e 10 chaves ativas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/assinatura"
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                >
                  Migrar para o Premium
                </Link>
                <Link
                  to="/planos"
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Comparar planos
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Integrações"
        title="Chaves de API"
        description="Gere tokens para conectar o seu ERP, defina os escopos de cada integração e revogue o acesso quando precisar."
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Segredo recém-criado: exibido uma única vez */}
          {freshSecret && (
            <div className="bg-white rounded-2xl shadow-xl border-2 border-green-500 p-6">
              <div className="flex items-start gap-3 mb-4">
                <ShieldAlert className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Chave "{freshSecret.name}" criada
                  </h2>
                  <p className="text-gray-600">
                    Copie agora. Por segurança guardamos apenas o hash — este valor não será exibido de novo.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <code className="flex-1 bg-gray-900 text-green-300 rounded-lg px-4 py-3 font-mono text-sm overflow-x-auto">
                  {secretVisible ? freshSecret.secret : `${freshSecret.secret.slice(0, 14)}${"•".repeat(32)}`}
                </code>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSecretVisible((current) => !current)}
                    aria-label={secretVisible ? "Ocultar chave" : "Revelar chave"}
                    className="px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {secretVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(freshSecret.secret, "fresh")}
                    className="px-4 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                  >
                    {copied === "fresh" ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied === "fresh" ? "Copiada" : "Copiar"}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFreshSecret(null)}
                className="mt-4 text-sm font-bold text-gray-600 hover:text-gray-900"
              >
                Já guardei a chave, pode fechar
              </button>
            </div>
          )}

          <div className="grid xl:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="space-y-8">
              {/* Chaves ativas */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Chaves ativas</h2>
                    <p className="text-gray-600">
                      {activeKeyCount} de {keyQuota} chaves em uso no plano Premium.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreating((current) => !current)}
                    disabled={quotaReached}
                    className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                    Nova chave
                  </button>
                </div>

                {quotaReached && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800">
                      Você atingiu o limite de {keyQuota} chaves ativas. Revogue uma chave para liberar espaço.
                    </p>
                  </div>
                )}

                {/* Formulário de criação */}
                {creating && (
                  <form onSubmit={handleCreate} className="border-2 border-orange-200 bg-orange-50/40 rounded-xl p-5 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Criar chave de integração</h3>

                    <label className="block mb-4">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Nome da integração *</span>
                      <input
                        value={name}
                        onChange={(event) => {
                          setName(event.target.value);
                          setFormError("");
                        }}
                        placeholder="Ex: Integração TOTVS Protheus"
                        className={inputClass}
                      />
                    </label>

                    <div className="mb-4">
                      <span className="block text-sm font-bold text-gray-700 mb-2">Ambiente *</span>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {environments.map((option) => (
                          <label
                            key={option.id}
                            className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                              environment === option.id
                                ? "border-orange-500 bg-white"
                                : "border-gray-200 bg-white hover:border-orange-300"
                            }`}
                          >
                            <span className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                              <input
                                type="radio"
                                name="environment"
                                checked={environment === option.id}
                                onChange={() => setEnvironment(option.id)}
                                className="accent-orange-600"
                              />
                              {option.label}
                            </span>
                            <span className="block text-xs text-gray-600 mt-1">{option.note}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <fieldset className="mb-4">
                      <legend className="block text-sm font-bold text-gray-700 mb-2">
                        Escopos de acesso * <span className="font-normal text-gray-500">(dê o mínimo necessário)</span>
                      </legend>
                      <div className="space-y-2">
                        {apiScopes.map((scope) => (
                          <label
                            key={scope.id}
                            className="flex items-start gap-3 bg-white border-2 border-gray-200 rounded-lg p-3 cursor-pointer hover:border-orange-300 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={scopes.includes(scope.id)}
                              onChange={() => toggleScope(scope.id)}
                              className="mt-1 accent-orange-600"
                            />
                            <span>
                              <span className="block font-bold text-gray-900 text-sm">{scope.label}</span>
                              <code className="text-xs text-orange-700 font-mono">{scope.id}</code>
                              <span className="block text-xs text-gray-600 mt-0.5">{scope.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    {formError && (
                      <p role="alert" className="flex items-center gap-2 text-sm text-red-600 mb-4">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {formError}
                      </p>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="bg-orange-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                      >
                        Gerar chave
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCreating(false);
                          setFormError("");
                        }}
                        className="border-2 border-gray-300 text-gray-700 px-5 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {active.map((key) => (
                    <div key={key.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <span className="p-2 rounded-lg bg-orange-50 shrink-0">
                            <KeyRound className="w-5 h-5 text-orange-600" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-gray-900">{key.name}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  key.environment === "producao"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {key.environment === "producao" ? "PRODUÇÃO" : "SANDBOX"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Criada em {formatDate(key.createdAt)} · último uso {formatDate(key.lastUsedAt)}
                            </div>
                          </div>
                        </div>

                        {confirmingRevoke === key.id ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                revokeApiKey(key.id);
                                setConfirmingRevoke(null);
                              }}
                              className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors"
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingRevoke(null)}
                              className="border-2 border-gray-300 text-gray-700 px-3 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
                            >
                              Manter
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmingRevoke(key.id)}
                            className="inline-flex items-center gap-1.5 text-red-600 font-bold text-sm hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            Revogar
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm text-gray-700 overflow-x-auto">
                          {key.prefix}
                          {"•".repeat(24)}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(key.prefix, key.id)}
                          aria-label={`Copiar prefixo da chave ${key.name}`}
                          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          {copied === key.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {key.scopes.map((scope) => (
                          <span
                            key={scope}
                            className="text-xs font-mono px-2 py-1 rounded bg-gray-100 text-gray-700"
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {active.length === 0 && (
                    <div className="text-center py-10">
                      <KeyRound className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="font-bold text-gray-900">Nenhuma chave ativa</p>
                      <p className="text-gray-600 text-sm">Crie a primeira chave para conectar o seu ERP.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chaves revogadas */}
              {revoked.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Chaves revogadas</h2>
                  <p className="text-gray-600 mb-4">
                    Mantidas para auditoria. Requisições com estas chaves recebem 401.
                  </p>
                  <div className="space-y-2">
                    {revoked.map((key) => (
                      <div
                        key={key.id}
                        className="flex flex-wrap items-center justify-between gap-3 border border-gray-200 rounded-lg p-3 bg-gray-50"
                      >
                        <div>
                          <div className="font-bold text-gray-500 line-through">{key.name}</div>
                          <code className="text-xs text-gray-400 font-mono">{key.prefix}…</code>
                        </div>
                        <span className="text-sm text-gray-500">Revogada em {formatDate(key.revokedAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Guia de integração */}
            <aside className="space-y-6 xl:sticky xl:top-28">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="w-5 h-5 text-orange-600" />
                  <h2 className="font-bold text-gray-900">Como usar</h2>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  Envie a chave no cabeçalho <code className="font-mono text-orange-700">Authorization</code> de
                  cada requisição:
                </p>

                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto mb-3">
                  <code>{`curl ${apiBaseUrl}/embarques \\
  -H "Authorization: Bearer eir_live_..." \\
  -H "Content-Type: application/json"`}</code>
                </pre>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `curl ${apiBaseUrl}/embarques -H "Authorization: Bearer eir_live_..." -H "Content-Type: application/json"`,
                      "snippet",
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  {copied === "snippet" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied === "snippet" ? "Copiado" : "Copiar exemplo"}
                </button>

                <dl className="mt-5 space-y-3 text-sm border-t border-gray-200 pt-4">
                  <div>
                    <dt className="text-gray-500">URL base</dt>
                    <dd className="font-mono text-gray-900 break-all">{apiBaseUrl}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Limite de chamadas</dt>
                    <dd className="font-bold text-gray-900">100.000 por mês</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">ERPs homologados</dt>
                    <dd className="font-bold text-gray-900">TOTVS, SAP, Senior, Sankhya</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <h2 className="font-bold text-gray-900">Boas práticas</h2>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    Guarde a chave em variável de ambiente, nunca no código versionado.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    Use uma chave por sistema — assim dá para revogar uma sem derrubar as outras.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    Conceda só os escopos que a integração usa de fato.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    Homologue no sandbox antes de apontar para produção.
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
