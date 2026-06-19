import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle,
  Clock,
  FileBadge,
  FileText,
  Filter,
  Search,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { PageHero } from "../components/PageHero";

type DocumentStatus = "pending" | "approved" | "rejected";
type DocumentType = "ANTT" | "CNH";

type DriverDocument = {
  id: string;
  driver: string;
  cpf: string;
  company: string;
  type: DocumentType;
  number: string;
  issuedAt: string;
  expiresAt: string;
  submittedAt: string;
  status: DocumentStatus;
  fileName: string;
  notes: string;
  rejectionReason?: string;
};

const initialDocuments: DriverDocument[] = [
  {
    id: "DOC-1024",
    driver: "Carlos Henrique Silva",
    cpf: "123.456.789-10",
    company: "Trans Alfa Ltda",
    type: "CNH",
    number: "04876543210",
    issuedAt: "2022-05-14",
    expiresAt: "2027-05-14",
    submittedAt: "2026-06-18 09:42",
    status: "pending",
    fileName: "cnh-carlos-silva.pdf",
    notes: "Categoria E, EAR registrada.",
  },
  {
    id: "DOC-1025",
    driver: "Mariana Costa Pereira",
    cpf: "987.654.321-00",
    company: "Rodolog Express",
    type: "ANTT",
    number: "RNTRC 00987654",
    issuedAt: "2025-02-03",
    expiresAt: "2027-02-03",
    submittedAt: "2026-06-18 11:08",
    status: "pending",
    fileName: "antt-mariana-costa.png",
    notes: "Transportador TAC vinculado ao cadastro da empresa.",
  },
  {
    id: "DOC-1026",
    driver: "Rafael Nunes Rocha",
    cpf: "234.567.890-11",
    company: "SulCargo Transportes",
    type: "CNH",
    number: "06234590123",
    issuedAt: "2021-09-22",
    expiresAt: "2026-09-22",
    submittedAt: "2026-06-17 15:31",
    status: "approved",
    fileName: "cnh-rafael-rocha.pdf",
    notes: "Documento legivel e dentro da validade.",
  },
  {
    id: "DOC-1027",
    driver: "Patricia Gomes Lima",
    cpf: "345.678.901-22",
    company: "ViaSul Logistica",
    type: "ANTT",
    number: "RNTRC 00124870",
    issuedAt: "2023-03-10",
    expiresAt: "2026-03-10",
    submittedAt: "2026-06-17 10:19",
    status: "rejected",
    fileName: "antt-patricia-lima.pdf",
    notes: "Cadastro enviado para renovacao.",
    rejectionReason: "Documento vencido. Enviar comprovante ANTT atualizado.",
  },
  {
    id: "DOC-1028",
    driver: "Joao Batista Moreira",
    cpf: "456.789.012-33",
    company: "Prime Rota Cargas",
    type: "CNH",
    number: "07111222333",
    issuedAt: "2024-01-05",
    expiresAt: "2029-01-05",
    submittedAt: "2026-06-19 08:04",
    status: "pending",
    fileName: "cnh-joao-moreira.jpg",
    notes: "Foto enviada pelo aplicativo do motorista.",
  },
];

const statusLabels: Record<DocumentStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

const statusClasses: Record<DocumentStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const filters = [
  { id: "all", label: "Todos" },
  { id: "pending", label: "Pendentes" },
  { id: "approved", label: "Aprovados" },
  { id: "rejected", label: "Rejeitados" },
] as const;

function formatDate(value: string) {
  if (!value.includes("-")) return value;
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function DocumentAdmin() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("pending");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialDocuments[0].id);
  const [rejectionReason, setRejectionReason] = useState("");
  const [message, setMessage] = useState("");

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesStatus = activeFilter === "all" || document.status === activeFilter;
      const matchesQuery =
        !normalizedQuery ||
        [document.driver, document.cpf, document.company, document.number, document.fileName]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [activeFilter, documents, query]);

  const selectedDocument =
    documents.find((document) => document.id === selectedId) ?? filteredDocuments[0] ?? documents[0];

  const pendingCount = documents.filter((document) => document.status === "pending").length;
  const approvedCount = documents.filter((document) => document.status === "approved").length;
  const rejectedCount = documents.filter((document) => document.status === "rejected").length;

  const updateStatus = (status: DocumentStatus) => {
    if (status === "rejected" && !rejectionReason.trim()) {
      setMessage("Informe o motivo da rejeicao antes de reprovar o documento.");
      return;
    }

    setDocuments((currentDocuments) =>
      currentDocuments.map((document) =>
        document.id === selectedDocument.id
          ? {
              ...document,
              status,
              rejectionReason: status === "rejected" ? rejectionReason.trim() : undefined,
            }
          : document,
      ),
    );
    setMessage(status === "approved" ? "Documento aprovado com sucesso." : "Documento rejeitado e devolvido ao motorista.");
    setRejectionReason("");
  };

  return (
    <div>
      <PageHero
        eyebrow="Central de Documentacao"
        title="Aprove ou rejeite documentos de motoristas"
        description="Administre CNH e ANTT com fila de analise, historico de status e justificativa obrigatoria para reprovacao."
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              { icon: Clock, value: pendingCount, label: "pendentes", color: "text-amber-700", bg: "bg-amber-50" },
              { icon: BadgeCheck, value: approvedCount, label: "aprovados", color: "text-green-700", bg: "bg-green-50" },
              { icon: XCircle, value: rejectedCount, label: "rejeitados", color: "text-red-700", bg: "bg-red-50" },
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

          <div className="grid xl:grid-cols-[420px_1fr] gap-8 items-start">
            <aside className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Filter className="w-5 h-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Fila de analise</h2>
                </div>
                <div className="relative mb-4">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar motorista, CPF ou documento"
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

              <div className="max-h-[640px] overflow-y-auto divide-y divide-gray-100">
                {filteredDocuments.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-bold text-gray-900">Nenhum documento encontrado</p>
                  </div>
                ) : (
                  filteredDocuments.map((document) => (
                    <button
                      key={document.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(document.id);
                        setMessage("");
                        setRejectionReason(document.rejectionReason ?? "");
                      }}
                      className={`w-full text-left p-5 transition-colors ${
                        document.id === selectedDocument.id ? "bg-orange-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="font-bold text-gray-900">{document.driver}</div>
                          <div className="text-sm text-gray-500">{document.company}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClasses[document.status]}`}>
                          {statusLabels[document.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileBadge className="w-4 h-4 text-orange-600" />
                        {document.type} · {document.number}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </aside>

            <div className="space-y-6">
              {message && (
                <div className="bg-white rounded-2xl shadow-md p-5 flex items-start gap-3">
                  {message.includes("sucesso") ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
                  )}
                  <p className="font-semibold text-gray-900">{message}</p>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-orange-600">{selectedDocument.id}</div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedDocument.driver}</h2>
                    <p className="text-gray-600">{selectedDocument.company}</p>
                  </div>
                  <span className={`self-start lg:self-auto px-4 py-2 rounded-lg text-sm font-bold ${statusClasses[selectedDocument.status]}`}>
                    {statusLabels[selectedDocument.status]}
                  </span>
                </div>

                <div className="grid lg:grid-cols-[1fr_320px] gap-6 p-6">
                  <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 min-h-[430px] flex flex-col">
                    <div className="bg-gray-900 text-white px-5 py-3 flex items-center justify-between gap-4">
                      <div className="font-bold">{selectedDocument.fileName}</div>
                      <div className="text-sm text-gray-300">{selectedDocument.type}</div>
                    </div>
                    <div className="flex-1 p-8 flex items-center justify-center">
                      <div className="bg-white border border-gray-200 shadow-md rounded-lg w-full max-w-md p-8">
                        <div className="flex items-center justify-between gap-4 mb-8">
                          <div>
                            <div className="text-xs font-bold text-gray-500">DOCUMENTO</div>
                            <div className="text-3xl font-bold text-gray-900">{selectedDocument.type}</div>
                          </div>
                          <ShieldCheck className="w-12 h-12 text-orange-600" />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="text-xs font-bold text-gray-500">MOTORISTA</div>
                            <div className="font-bold text-gray-900">{selectedDocument.driver}</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-500">NUMERO</div>
                            <div className="font-bold text-gray-900">{selectedDocument.number}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs font-bold text-gray-500">EMISSAO</div>
                              <div className="font-bold text-gray-900">{formatDate(selectedDocument.issuedAt)}</div>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-gray-500">VALIDADE</div>
                              <div className="font-bold text-gray-900">{formatDate(selectedDocument.expiresAt)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <aside className="space-y-5">
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-4">Dados cadastrais</h3>
                      <div className="space-y-4">
                        {[
                          ["CPF", selectedDocument.cpf],
                          ["Enviado em", selectedDocument.submittedAt],
                          ["Arquivo", selectedDocument.fileName],
                          ["Observacao", selectedDocument.notes],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <div className="text-xs font-bold text-gray-500">{label}</div>
                            <div className="font-semibold text-gray-900 break-words">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedDocument.rejectionReason && (
                      <div className="bg-red-50 rounded-xl p-5">
                        <h3 className="font-bold text-red-900 mb-2">Motivo da rejeicao</h3>
                        <p className="text-red-700">{selectedDocument.rejectionReason}</p>
                      </div>
                    )}

                    <label className="block">
                      <span className="block text-sm font-bold text-gray-700 mb-2">
                        Motivo para rejeicao
                      </span>
                      <textarea
                        rows={5}
                        value={rejectionReason}
                        onChange={(event) => setRejectionReason(event.target.value)}
                        placeholder="Informe inconsistencias, vencimento, baixa legibilidade ou divergencia cadastral."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 resize-none"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => updateStatus("rejected")}
                        className="bg-red-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Rejeitar
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus("approved")}
                        className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Aprovar
                      </button>
                    </div>
                  </aside>
                </div>
              </div>

              <div className="bg-orange-600 rounded-2xl shadow-lg p-6 text-white flex flex-col md:flex-row md:items-center gap-4">
                <User className="w-9 h-9" />
                <div>
                  <h3 className="font-bold text-xl">Revisao administrativa</h3>
                  <p className="text-orange-100">
                    A aprovacao libera o motorista para operacoes. A rejeicao exige justificativa para reenvio do documento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
