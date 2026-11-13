import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Accessibility,
  Bell,
  CheckCircle,
  Download,
  Eye,
  EyeOff,
  LayoutDashboard,
  Lock,
  LogOut,
  RotateCcw,
  ShieldCheck,
  Trash2,
  User,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "../components/PageHero";
import { useAuth, type Role } from "../auth/AuthContext";
import { defaultHomeByRole, panelItems, panelsForRole, type PanelPath } from "../data/panels";
import {
  fontScalePx,
  useSettings,
  type FontScale,
  type NotificationChannel,
  type NotificationEvent,
} from "../settings/SettingsContext";

type SectionId = "perfil" | "seguranca" | "notificacoes" | "paineis" | "acessibilidade" | "privacidade";

const sections: { id: SectionId; label: string; description: string; icon: LucideIcon }[] = [
  { id: "perfil", label: "Perfil", description: "Seus dados de contato", icon: User },
  { id: "seguranca", label: "Segurança", description: "Senha e sessão", icon: Lock },
  { id: "notificacoes", label: "Notificações", description: "Canais e alertas", icon: Bell },
  { id: "paineis", label: "Painéis", description: "Menu e página inicial", icon: LayoutDashboard },
  { id: "acessibilidade", label: "Acessibilidade", description: "Texto e animações", icon: Accessibility },
  { id: "privacidade", label: "Privacidade e dados", description: "Cookies e seus dados", icon: ShieldCheck },
];

const channelLabels: Record<NotificationChannel, { label: string; description: string }> = {
  email: { label: "E-mail", description: "Enviado para o e-mail do seu perfil" },
  sms: { label: "SMS", description: "Enviado para o telefone do seu perfil" },
  whatsapp: { label: "WhatsApp", description: "Mensagens pelo número do seu perfil" },
};

const eventLabels: Record<NotificationEvent, { label: string; description: string }> = {
  cargoStatus: { label: "Mudança de status da carga", description: "Coleta, em trânsito, chegada ao destino" },
  delays: { label: "Atrasos e ocorrências", description: "Desvios de rota, paradas longas e previsão de atraso" },
  deliveries: { label: "Entrega concluída", description: "Confirmação com comprovante de entrega" },
  documents: { label: "Documentos a vencer", description: "CNH, ANTT e licenças perto do vencimento" },
  weeklyReport: { label: "Resumo semanal", description: "Indicadores de ESG, economia de frete e performance" },
};

const fontScaleLabels: Record<FontScale, string> = {
  small: "Pequeno",
  normal: "Padrão",
  large: "Grande",
  xlarge: "Muito grande",
};

const roleLabels: Record<Role, string> = {
  admin: "Administrador",
  empresa: "Empresa",
  motorista: "Motorista",
};

const inputClass =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600";

function isSectionId(value: string | null): value is SectionId {
  return sections.some((section) => section.id === value);
}

export function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionParam = searchParams.get("secao");
  const activeSection: SectionId = isSectionId(sectionParam) ? sectionParam : "perfil";
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, [activeSection]);

  const selectSection = (id: SectionId) => setSearchParams({ secao: id }, { replace: true });

  return (
    <div>
      <PageHero
        eyebrow="Configurações"
        title="Ajuste a plataforma do seu jeito"
        description="Gerencie seu perfil, segurança, notificações, painéis e preferências de acessibilidade."
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          <nav aria-label="Seções de configuração" className="bg-white rounded-2xl shadow-xl p-3 lg:sticky lg:top-28">
            <ul className="flex lg:flex-col gap-1 overflow-x-auto">
              {sections.map((section) => {
                const active = section.id === activeSection;
                return (
                  <li key={section.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => selectSection(section.id)}
                      aria-current={active ? "page" : undefined}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        active ? "bg-orange-50 text-orange-700" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <section.icon className={`w-5 h-5 shrink-0 ${active ? "text-orange-600" : "text-gray-400"}`} />
                      <span>
                        <span className="block font-bold text-sm whitespace-nowrap">{section.label}</span>
                        <span className="hidden lg:block text-xs text-gray-500">{section.description}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-6 min-w-0">
            {message && (
              <div role="status" className="bg-white rounded-2xl shadow-md p-5 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 shrink-0" />
                <p className="font-semibold text-gray-900">{message}</p>
              </div>
            )}

            {activeSection === "perfil" && <ProfileSection onSaved={setMessage} />}
            {activeSection === "seguranca" && <SecuritySection onSaved={setMessage} />}
            {activeSection === "notificacoes" && <NotificationsSection />}
            {activeSection === "paineis" && <PanelsSection />}
            {activeSection === "acessibilidade" && <AccessibilitySection />}
            {activeSection === "privacidade" && <PrivacySection onSaved={setMessage} />}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Blocos reutilizáveis ---------- */

function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-6 py-4 ${disabled ? "opacity-50" : ""}`}>
      <div>
        <div className="font-bold text-gray-900">{label}</div>
        {description && <div className="text-sm text-gray-600">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 ${
          checked ? "bg-orange-600" : "bg-gray-300"
        } ${disabled ? "cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-gray-700 mb-2">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
    </label>
  );
}

/* ---------- Perfil ---------- */

function ProfileSection({ onSaved }: { onSaved: (message: string) => void }) {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    company: user?.company ?? "",
    jobTitle: user?.jobTitle ?? "",
  });
  const [error, setError] = useState("");

  const setField = (field: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!updateProfile(form)) {
      setError("O nome é obrigatório.");
      return;
    }
    setError("");
    onSaved("Perfil atualizado com sucesso.");
  };

  const initials = (form.name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Card title="Perfil" description="Esses dados aparecem para a sua equipe e são usados nas notificações.">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold">
          {initials}
        </div>
        <div>
          <div className="font-bold text-gray-900 text-lg">{form.name || "Sem nome"}</div>
          <div className="text-sm text-gray-600">{user ? roleLabels[user.role] : ""}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
        <Field label="Nome completo">
          <input required value={form.name} onChange={(e) => setField("name")(e.target.value)} className={inputClass} />
        </Field>
        <Field label="E-mail" hint="O e-mail é o seu login e não pode ser alterado por aqui.">
          <input
            type="email"
            value={user?.email ?? ""}
            readOnly
            className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`}
          />
        </Field>
        <Field label="Telefone / WhatsApp">
          <input
            type="tel"
            value={form.phone}
            placeholder="(11) 99999-0000"
            onChange={(e) => setField("phone")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Empresa">
          <input value={form.company} onChange={(e) => setField("company")(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Cargo">
          <input
            value={form.jobTitle}
            placeholder="Ex.: Coordenador de logística"
            onChange={(e) => setField("jobTitle")(e.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
          <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors">
            Salvar perfil
          </button>
          {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}
        </div>
      </form>
    </Card>
  );
}

/* ---------- Segurança ---------- */

function SecuritySection({ onSaved }: { onSaved: (message: string) => void }) {
  const navigate = useNavigate();
  const { logout, changePassword } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!current) return setError("Informe a senha atual.");
    if (next.length < 8) return setError("A nova senha precisa ter pelo menos 8 caracteres.");
    if (!/[A-Za-z]/.test(next) || !/\d/.test(next)) return setError("Use letras e números na nova senha.");
    if (next === current) return setError("A nova senha precisa ser diferente da atual.");
    if (next !== confirm) return setError("A confirmação não confere com a nova senha.");

    const result = changePassword(current, next);
    if (result === "wrong-password") return setError("A senha atual está incorreta.");
    if (result === "demo-account") return setError("A senha das contas de demonstração não pode ser alterada.");

    setError("");
    setCurrent("");
    setNext("");
    setConfirm("");
    onSaved("Senha alterada com sucesso.");
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const passwordType = showPasswords ? "text" : "password";

  return (
    <>
      <Card title="Alterar senha" description="Use pelo menos 8 caracteres, com letras e números.">
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Field label="Senha atual">
              <input
                type={passwordType}
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Nova senha">
            <input
              type={passwordType}
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Confirmar nova senha">
            <input
              type={passwordType}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </Field>

          <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors">
              Alterar senha
            </button>
            <button
              type="button"
              onClick={() => setShowPasswords((value) => !value)}
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-600"
            >
              {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPasswords ? "Ocultar senhas" : "Mostrar senhas"}
            </button>
            {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}
          </div>
        </form>
      </Card>

      <Card title="Sessão" description="Encerre o acesso neste navegador.">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 border-2 border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold hover:border-orange-600 hover:text-orange-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair da conta
        </button>
      </Card>
    </>
  );
}

/* ---------- Notificações ---------- */

function NotificationsSection() {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const { channels, events } = settings.notifications;
  const anyChannel = Object.values(channels).some(Boolean);

  const setChannel = (channel: NotificationChannel, value: boolean) =>
    updateSettings({ notifications: { ...settings.notifications, channels: { ...channels, [channel]: value } } });
  const setEvent = (event: NotificationEvent, value: boolean) =>
    updateSettings({ notifications: { ...settings.notifications, events: { ...events, [event]: value } } });

  const needsPhone = (channels.sms || channels.whatsapp) && !user?.phone;

  return (
    <>
      <Card title="Canais" description="Por onde você quer receber os avisos. As alterações são salvas na hora.">
        <div className="divide-y divide-gray-100">
          {(Object.keys(channelLabels) as NotificationChannel[]).map((channel) => (
            <ToggleRow
              key={channel}
              label={channelLabels[channel].label}
              description={channelLabels[channel].description}
              checked={channels[channel]}
              onChange={(value) => setChannel(channel, value)}
            />
          ))}
        </div>
        {needsPhone && (
          <p className="mt-4 text-sm font-semibold text-amber-700 bg-amber-50 rounded-lg p-3">
            Cadastre um telefone na aba Perfil para receber SMS e WhatsApp.
          </p>
        )}
      </Card>

      <Card
        title="O que avisar"
        description={anyChannel ? "Escolha os eventos que geram notificação." : "Ative pelo menos um canal para escolher os eventos."}
      >
        <div className="divide-y divide-gray-100">
          {(Object.keys(eventLabels) as NotificationEvent[]).map((event) => (
            <ToggleRow
              key={event}
              label={eventLabels[event].label}
              description={eventLabels[event].description}
              checked={events[event]}
              disabled={!anyChannel}
              onChange={(value) => setEvent(event, value)}
            />
          ))}
        </div>
      </Card>
    </>
  );
}

/* ---------- Painéis ---------- */

function PanelsSection() {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const hidden = new Set(settings.hiddenPanels);
  const available = user ? panelsForRole(user.role) : [];
  const defaultHome = user ? panelItems.find((item) => item.path === defaultHomeByRole[user.role]) : undefined;
  const homeValue = settings.homePage && available.some((item) => item.path === settings.homePage) ? settings.homePage : "";

  const togglePanel = (path: PanelPath, visible: boolean) => {
    const next = new Set(hidden);
    if (visible) next.delete(path);
    else next.add(path);
    updateSettings({ hiddenPanels: panelItems.map((item) => item.path).filter((p) => next.has(p)) });
  };

  return (
    <>
      <Card title="Página inicial" description="Para onde você vai depois de fazer login.">
        <Field label="Abrir após o login">
          <select
            value={homeValue}
            onChange={(e) => updateSettings({ homePage: (e.target.value || null) as PanelPath | null })}
            className={`${inputClass} bg-white`}
          >
            <option value="">Padrão do perfil{defaultHome ? ` (${defaultHome.label})` : ""}</option>
            {available.map((item) => (
              <option key={item.path} value={item.path}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
      </Card>

      <Card
        title="Painéis no menu"
        description="Escolha quais painéis aparecem no menu. Os escondidos continuam acessíveis pelo endereço."
      >
        <div className="divide-y divide-gray-100">
          {available.map((item) => (
            <ToggleRow
              key={item.path}
              label={item.label}
              checked={!hidden.has(item.path)}
              onChange={(visible) => togglePanel(item.path, visible)}
            />
          ))}
        </div>
      </Card>
    </>
  );
}

/* ---------- Acessibilidade ---------- */

function AccessibilitySection() {
  const { settings, updateSettings } = useSettings();

  return (
    <Card title="Acessibilidade" description="Vale para o site inteiro e é aplicado na hora.">
      <div className="mb-2">
        <div className="font-bold text-gray-900 mb-3">Tamanho do texto</div>
        <div role="radiogroup" aria-label="Tamanho do texto" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(fontScaleLabels) as FontScale[]).map((scale) => {
            const active = settings.fontScale === scale;
            return (
              <button
                key={scale}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => updateSettings({ fontScale: scale })}
                className={`rounded-xl border-2 px-4 py-3 text-center transition-colors ${
                  active ? "border-orange-600 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="block font-bold" style={{ fontSize: `${fontScalePx[scale]}px` }}>
                  Aa
                </span>
                <span className="block text-xs mt-1">{fontScaleLabels[scale]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-100 mt-6">
        <ToggleRow
          label="Reduzir animações"
          description="Remove transições e movimentos da interface."
          checked={settings.reduceMotion}
          onChange={(value) => updateSettings({ reduceMotion: value })}
        />
      </div>
    </Card>
  );
}

/* ---------- Privacidade e dados ---------- */

function PrivacySection({ onSaved }: { onSaved: (message: string) => void }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { settings, updateSettings, resetSettings } = useSettings();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const exportData = () => {
    const data = { exportadoEm: new Date().toISOString(), perfil: user, configuracoes: settings };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "escortinroad-meus-dados.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    resetSettings();
    onSaved("Preferências restauradas para o padrão.");
  };

  const deleteLocalData = () => {
    logout();
    resetSettings();
    navigate("/", { replace: true });
  };

  return (
    <>
      <Card title="Cookies" description="Os cookies essenciais mantêm você conectado e não podem ser desligados.">
        <div className="divide-y divide-gray-100">
          <ToggleRow label="Essenciais" description="Login e preferências deste navegador." checked onChange={() => {}} disabled />
          <ToggleRow
            label="Análise de uso"
            description="Estatísticas anônimas para melhorar a plataforma."
            checked={settings.analyticsCookies}
            onChange={(value) => updateSettings({ analyticsCookies: value })}
          />
        </div>
      </Card>

      <Card title="Seus dados" description="Baixe uma cópia ou volte as preferências ao padrão.">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={exportData}
            className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold hover:border-orange-600 hover:text-orange-600 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar meus dados
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold hover:border-orange-600 hover:text-orange-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Restaurar preferências
          </button>
        </div>
      </Card>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-red-100">
        <div className="p-6">
          <h2 className="text-xl font-bold text-red-700">Apagar dados deste navegador</h2>
          <p className="text-gray-600 text-sm mt-1 mb-5">
            Remove seu perfil e todas as preferências salvas aqui e encerra a sessão. Não dá para desfazer.
          </p>
          {confirmDelete ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={deleteLocalData}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Sim, apagar e sair
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-6 py-3 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 border-2 border-red-200 text-red-700 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Apagar dados
            </button>
          )}
        </div>
      </div>
    </>
  );
}
