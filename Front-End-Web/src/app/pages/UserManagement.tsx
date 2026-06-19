import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Building2,
  CheckCircle,
  Clock,
  Edit3,
  Search,
  ShieldAlert,
  Truck,
  UserCog,
  Users,
  XCircle,
} from "lucide-react";
import { PageHero } from "../components/PageHero";

type UserStatus = "active" | "pending" | "suspended";
type UserKind = "driver" | "company";

type ManagedUser = {
  id: string;
  kind: UserKind;
  name: string;
  document: string;
  email: string;
  phone: string;
  city: string;
  status: UserStatus;
  profile: string;
  joinedAt: string;
  lastAccess: string;
  notes: string;
};

const initialUsers: ManagedUser[] = [
  {
    id: "MOT-2041",
    kind: "driver",
    name: "Carlos Henrique Silva",
    document: "CPF 123.456.789-10",
    email: "carlos.silva@email.com",
    phone: "(11) 98888-1201",
    city: "Sao Paulo/SP",
    status: "active",
    profile: "Motorista carreteiro",
    joinedAt: "12/03/2026",
    lastAccess: "Hoje, 08:41",
    notes: "CNH e ANTT aprovadas. Disponivel para SP -> Curitiba.",
  },
  {
    id: "MOT-2042",
    kind: "driver",
    name: "Joao Batista Moreira",
    document: "CPF 456.789.012-33",
    email: "joao.moreira@email.com",
    phone: "(41) 97777-4102",
    city: "Curitiba/PR",
    status: "pending",
    profile: "Motorista truck",
    joinedAt: "18/06/2026",
    lastAccess: "Hoje, 07:59",
    notes: "Aguardando validacao de CNH enviada pelo app.",
  },
  {
    id: "MOT-2043",
    kind: "driver",
    name: "Patricia Gomes Lima",
    document: "CPF 345.678.901-22",
    email: "patricia.lima@email.com",
    phone: "(11) 96666-2209",
    city: "Osasco/SP",
    status: "suspended",
    profile: "Motorista agregado",
    joinedAt: "22/01/2026",
    lastAccess: "16/06/2026, 18:10",
    notes: "Conta suspensa por documento ANTT vencido.",
  },
  {
    id: "EMP-3101",
    kind: "company",
    name: "Trans Alfa Ltda",
    document: "CNPJ 12.345.678/0001-90",
    email: "operacao@transalfa.com.br",
    phone: "(11) 4002-1100",
    city: "Sao Paulo/SP",
    status: "active",
    profile: "Transportadora",
    joinedAt: "04/02/2026",
    lastAccess: "Hoje, 09:12",
    notes: "Empresa habilitada para publicar cargas e importar lotes.",
  },
  {
    id: "EMP-3102",
    kind: "company",
    name: "Prime Rota Cargas",
    document: "CNPJ 45.678.901/0001-12",
    email: "logistica@primerota.com.br",
    phone: "(41) 3333-8080",
    city: "Curitiba/PR",
    status: "pending",
    profile: "Embarcador",
    joinedAt: "17/06/2026",
    lastAccess: "Ontem, 15:44",
    notes: "Cadastro aguardando conferencia comercial.",
  },
  {
    id: "EMP-3103",
    kind: "company",
    name: "ViaSul Logistica",
    document: "CNPJ 98.765.432/0001-00",
    email: "admin@viasul.com.br",
    phone: "(11) 3555-9090",
    city: "Embu das Artes/SP",
    status: "active",
    profile: "Transportadora",
    joinedAt: "09/01/2026",
    lastAccess: "18/06/2026, 17:02",
    notes: "Opera no corredor Sao Paulo -> Curitiba.",
  },
];

const statusLabels: Record<UserStatus, string> = {
  active: "Ativo",
  pending: "Pendente",
  suspended: "Suspenso",
};

const statusClasses: Record<UserStatus, string> = {
  active: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  suspended: "bg-red-50 text-red-700",
};

const kindLabels: Record<UserKind, string> = {
  driver: "Motorista",
  company: "Empresa",
};

const filters = [
  { id: "all", label: "Todos" },
  { id: "driver", label: "Motoristas" },
  { id: "company", label: "Empresas" },
] as const;

export function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialUsers[0].id);
  const [draftProfile, setDraftProfile] = useState(initialUsers[0].profile);
  const [draftNotes, setDraftNotes] = useState(initialUsers[0].notes);
  const [message, setMessage] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesKind = activeFilter === "all" || user.kind === activeFilter;
      const matchesQuery =
        !normalizedQuery ||
        [user.name, user.document, user.email, user.city, user.profile].join(" ").toLowerCase().includes(normalizedQuery);

      return matchesKind && matchesQuery;
    });
  }, [activeFilter, query, users]);

  const selectedUser = users.find((user) => user.id === selectedId) ?? filteredUsers[0] ?? users[0];
  const driversCount = users.filter((user) => user.kind === "driver").length;
  const companiesCount = users.filter((user) => user.kind === "company").length;
  const pendingCount = users.filter((user) => user.status === "pending").length;

  const selectUser = (user: ManagedUser) => {
    setSelectedId(user.id);
    setDraftProfile(user.profile);
    setDraftNotes(user.notes);
    setMessage("");
  };

  const updateSelectedUser = (changes: Partial<ManagedUser>, feedback: string) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...changes } : user)),
    );
    setMessage(feedback);
  };

  const saveProfile = () => {
    updateSelectedUser(
      {
        profile: draftProfile.trim() || selectedUser.profile,
        notes: draftNotes.trim(),
      },
      "Perfil atualizado com sucesso.",
    );
  };

  return (
    <div>
      <PageHero
        eyebrow="Gestao de Usuarios"
        title="Administre motoristas e empresas cadastradas"
        description="Consulte perfis, acompanhe status cadastral e controle acessos de usuarios da operacao."
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              { icon: Truck, value: driversCount, label: "motoristas", color: "text-blue-700", bg: "bg-blue-50" },
              { icon: Building2, value: companiesCount, label: "empresas", color: "text-orange-700", bg: "bg-orange-50" },
              { icon: Clock, value: pendingCount, label: "cadastros pendentes", color: "text-amber-700", bg: "bg-amber-50" },
            ].map((metric) => (
              <div key={metric.label} className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
                <div className={`${metric.bg} p-3 rounded-lg`}>
                  <metric.icon className={`w-7 h-7 ${metric.color}`} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid xl:grid-cols-[430px_1fr] gap-8 items-start">
            <aside className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Usuarios cadastrados</h2>
                </div>
                <div className="relative mb-4">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar nome, documento, e-mail ou cidade"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-3 py-2 rounded-lg font-bold text-sm transition-colors ${
                        activeFilter === filter.id
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[680px] overflow-y-auto divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => selectUser(user)}
                    className={`w-full text-left p-5 transition-colors ${
                      user.id === selectedUser.id ? "bg-orange-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="font-bold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{kindLabels[user.kind]} · {user.city}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClasses[user.status]}`}>
                        {statusLabels[user.status]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{user.document}</div>
                  </button>
                ))}
              </div>
            </aside>

            <div className="space-y-6">
              {message && (
                <div className="bg-white rounded-2xl shadow-md p-5 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  <p className="font-semibold text-gray-900">{message}</p>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-orange-600">{selectedUser.id}</div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                    <p className="text-gray-600">{kindLabels[selectedUser.kind]} cadastrado em {selectedUser.joinedAt}</p>
                  </div>
                  <span className={`self-start lg:self-auto px-4 py-2 rounded-lg text-sm font-bold ${statusClasses[selectedUser.status]}`}>
                    {statusLabels[selectedUser.status]}
                  </span>
                </div>

                <div className="grid lg:grid-cols-[1fr_330px] gap-6 p-6">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        ["Documento", selectedUser.document],
                        ["E-mail", selectedUser.email],
                        ["Telefone", selectedUser.phone],
                        ["Cidade", selectedUser.city],
                        ["Ultimo acesso", selectedUser.lastAccess],
                        ["Tipo de usuario", kindLabels[selectedUser.kind]],
                      ].map(([label, value]) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-4">
                          <div className="text-xs font-bold text-gray-500 mb-1">{label}</div>
                          <div className="font-bold text-gray-900 break-words">{value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <Edit3 className="w-5 h-5 text-orange-600" />
                        <h3 className="font-bold text-gray-900">Editar perfil operacional</h3>
                      </div>
                      <div className="grid gap-5">
                        <label className="block">
                          <span className="block text-sm font-bold text-gray-700 mb-2">Perfil</span>
                          <input
                            value={draftProfile}
                            onChange={(event) => setDraftProfile(event.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                          />
                        </label>
                        <label className="block">
                          <span className="block text-sm font-bold text-gray-700 mb-2">Observacoes administrativas</span>
                          <textarea
                            rows={5}
                            value={draftNotes}
                            onChange={(event) => setDraftNotes(event.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 resize-none"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={saveProfile}
                          className="bg-orange-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <UserCog className="w-5 h-5" />
                          Salvar perfil
                        </button>
                      </div>
                    </div>
                  </div>

                  <aside className="space-y-5">
                    <div className="bg-gray-900 rounded-xl p-5 text-white">
                      <ShieldAlert className="w-8 h-8 text-orange-300 mb-4" />
                      <h3 className="font-bold text-xl mb-2">Controle de acesso</h3>
                      <p className="text-gray-300 text-sm">
                        Status ativo libera uso da plataforma. Suspensao bloqueia novas cargas e candidaturas.
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <button
                        type="button"
                        onClick={() => updateSelectedUser({ status: "active" }, "Usuario ativado com sucesso.")}
                        className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <BadgeCheck className="w-5 h-5" />
                        Ativar
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSelectedUser({ status: "pending" }, "Usuario marcado como pendente.")}
                        className="bg-amber-500 text-white px-4 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Clock className="w-5 h-5" />
                        Marcar pendente
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSelectedUser({ status: "suspended" }, "Usuario suspenso.")}
                        className="bg-red-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Suspender
                      </button>
                    </div>

                    <div className="bg-white border-2 border-gray-100 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-3">Permissoes</h3>
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-center justify-between gap-3">
                          <span>Publicar cargas</span>
                          <span className="font-bold">{selectedUser.kind === "company" ? "Sim" : "Nao"}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>Aceitar fretes</span>
                          <span className="font-bold">{selectedUser.kind === "driver" ? "Sim" : "Nao"}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>Importar lotes</span>
                          <span className="font-bold">{selectedUser.kind === "company" ? "Sim" : "Nao"}</span>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
