import { useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Download,
  FileSpreadsheet,
  PackageCheck,
  RefreshCw,
  Send,
  UploadCloud,
} from "lucide-react";
import { PageHero } from "../components/PageHero";

type ImportRow = {
  rowNumber: number;
  pedido: string;
  origem: string;
  destino: string;
  dataColeta: string;
  prazoEntrega: string;
  tipoCarga: string;
  pesoKg: string;
  volumes: string;
  valorNf: string;
  valorFrete: string;
  veiculo: string;
  observacoes: string;
  errors: string[];
};

const requiredColumns = [
  "pedido",
  "origem",
  "destino",
  "data_coleta",
  "prazo_entrega",
  "tipo_carga",
  "peso_kg",
  "volumes",
  "valor_nf",
  "valor_frete",
] as const;

const optionalColumns = ["veiculo", "observacoes"] as const;

const columnAliases: Record<string, string> = {
  numero_pedido: "pedido",
  numero_do_pedido: "pedido",
  origem_cidade_uf: "origem",
  destino_cidade_uf: "destino",
  coleta: "data_coleta",
  entrega: "prazo_entrega",
  prazo: "prazo_entrega",
  carga: "tipo_carga",
  peso: "peso_kg",
  peso_total: "peso_kg",
  quantidade_volumes: "volumes",
  valor_mercadoria: "valor_nf",
  nf: "valor_nf",
  frete: "valor_frete",
  valor_do_frete: "valor_frete",
  tipo_veiculo: "veiculo",
  notas: "observacoes",
};

const templateHeaders = [...requiredColumns, ...optionalColumns];

const templateRows = [
  [
    "PED-1001",
    "Sao Paulo/SP",
    "Rio de Janeiro/RJ",
    "2026-06-22",
    "2026-06-24",
    "Autopecas",
    "1250",
    "18",
    "45000",
    "3200",
    "Truck",
    "Coleta das 08h as 12h",
  ],
];

function normalizeHeader(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getCell(row: string[], index: number | undefined) {
  if (index === undefined || index < 0) return "";
  return String(row[index] ?? "").trim();
}

function validateRow(row: ImportRow) {
  const errors: string[] = [];

  if (!row.pedido) errors.push("Pedido ausente");
  if (!row.origem) errors.push("Origem ausente");
  if (!row.destino) errors.push("Destino ausente");
  if (!row.dataColeta) errors.push("Data de coleta ausente");
  if (!row.prazoEntrega) errors.push("Prazo de entrega ausente");
  if (!row.tipoCarga) errors.push("Tipo de carga ausente");
  if (!row.pesoKg || Number(row.pesoKg.replace(",", ".")) <= 0) errors.push("Peso invalido");
  if (!row.volumes || Number(row.volumes.replace(",", ".")) <= 0) errors.push("Volumes invalidos");
  if (!row.valorNf || Number(row.valorNf.replace(",", ".")) <= 0) errors.push("Valor NF invalido");
  if (!row.valorFrete || Number(row.valorFrete.replace(",", ".")) <= 0) errors.push("Valor frete invalido");

  return errors;
}

function parseWorksheetRows(rows: string[][]) {
  const headerRow = rows[0] ?? [];
  const normalizedHeaders = headerRow.map((header) => {
    const normalized = normalizeHeader(header);
    return columnAliases[normalized] ?? normalized;
  });

  const columnIndex = new Map<string, number>();
  normalizedHeaders.forEach((header, index) => {
    if (header && !columnIndex.has(header)) columnIndex.set(header, index);
  });

  const missingColumns = requiredColumns.filter((column) => !columnIndex.has(column));

  const parsedRows = rows
    .slice(1)
    .map((row, index) => {
      const item: ImportRow = {
        rowNumber: index + 2,
        pedido: getCell(row, columnIndex.get("pedido")),
        origem: getCell(row, columnIndex.get("origem")),
        destino: getCell(row, columnIndex.get("destino")),
        dataColeta: getCell(row, columnIndex.get("data_coleta")),
        prazoEntrega: getCell(row, columnIndex.get("prazo_entrega")),
        tipoCarga: getCell(row, columnIndex.get("tipo_carga")),
        pesoKg: getCell(row, columnIndex.get("peso_kg")),
        volumes: getCell(row, columnIndex.get("volumes")),
        valorNf: getCell(row, columnIndex.get("valor_nf")),
        valorFrete: getCell(row, columnIndex.get("valor_frete")),
        veiculo: getCell(row, columnIndex.get("veiculo")),
        observacoes: getCell(row, columnIndex.get("observacoes")),
        errors: [],
      };

      item.errors = validateRow(item);
      return item;
    })
    .filter((row) =>
      [
        row.pedido,
        row.origem,
        row.destino,
        row.dataColeta,
        row.prazoEntrega,
        row.tipoCarga,
        row.pesoKg,
        row.volumes,
        row.valorNf,
        row.valorFrete,
      ].some(Boolean),
    );

  return { missingColumns, parsedRows };
}

function downloadTemplate() {
  const csvContent = [templateHeaders, ...templateRows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "modelo-importacao-pedidos.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function BulkUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [missingColumns, setMissingColumns] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const stats = useMemo(() => {
    const valid = rows.filter((row) => row.errors.length === 0).length;
    const invalid = rows.length - valid;
    const totalWeight = rows.reduce((sum, row) => sum + Number(row.pesoKg.replace(",", ".")) || sum, 0);

    return { valid, invalid, total: rows.length, totalWeight };
  }, [rows]);

  const hasBlockingErrors = missingColumns.length > 0 || stats.invalid > 0 || rows.length === 0;

  const resetImport = () => {
    setFileName("");
    setRows([]);
    setMissingColumns([]);
    setErrorMessage("");
    setConfirmed(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setConfirmed(false);
    setErrorMessage("");
    setMissingColumns([]);
    setRows([]);
    setFileName(file.name);

    const extension = file.name.split(".").pop()?.toLowerCase();
    const acceptedExtensions = ["csv", "xlsx", "xls"];

    if (!extension || !acceptedExtensions.includes(extension)) {
      setErrorMessage("Envie um arquivo .xlsx, .xls ou .csv.");
      return;
    }

    try {
      const XLSX = await import("xlsx");
      const workbook =
        extension === "csv"
          ? XLSX.read(await file.text(), { type: "string", raw: false })
          : XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true, raw: false });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const worksheetRows = XLSX.utils.sheet_to_json<string[]>(sheet, {
        header: 1,
        defval: "",
        raw: false,
      });
      const parsed = parseWorksheetRows(worksheetRows);

      setMissingColumns([...parsed.missingColumns]);
      setRows(parsed.parsedRows);
      if (parsed.parsedRows.length === 0) setErrorMessage("Nenhum pedido foi encontrado no arquivo.");
    } catch {
      setErrorMessage("Nao foi possivel ler o arquivo. Verifique o formato e tente novamente.");
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Gestao de Lotes"
        title="Importe pedidos em massa"
        description="Suba arquivos Excel ou CSV, valide os dados do lote e prepare multiplos pedidos para programacao operacional."
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid xl:grid-cols-[380px_1fr] gap-8 items-start">
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-5">
                <FileSpreadsheet className="w-7 h-7 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">Arquivo do lote</h2>
              </div>

              <label className="block border-2 border-dashed border-orange-200 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                <UploadCloud className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                <span className="block font-bold text-gray-900 mb-1">Selecionar planilha</span>
                <span className="block text-sm text-gray-600">.xlsx, .xls ou .csv</span>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFile}
                  className="sr-only"
                />
              </label>

              {fileName && (
                <div className="mt-4 bg-gray-50 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 break-words">
                  {fileName}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-xs text-gray-500">Pedidos</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">{stats.valid}</div>
                  <div className="text-xs text-green-700">Validos</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-700">{stats.invalid}</div>
                  <div className="text-xs text-red-700">Erros</div>
                </div>
              </div>

              <button
                type="button"
                onClick={downloadTemplate}
                className="w-full mt-5 border-2 border-orange-600 text-orange-700 px-4 py-3 rounded-lg font-bold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Baixar modelo CSV
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Colunas obrigatorias</h3>
              <div className="flex flex-wrap gap-2">
                {requiredColumns.map((column) => (
                  <span key={column} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                    {column}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {(errorMessage || missingColumns.length > 0) && (
              <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-5 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 mb-1">Importacao pendente de ajuste</h3>
                  {errorMessage && <p className="text-red-700">{errorMessage}</p>}
                  {missingColumns.length > 0 && (
                    <p className="text-red-700">
                      Colunas ausentes: <strong>{missingColumns.join(", ")}</strong>
                    </p>
                  )}
                </div>
              </div>
            )}

            {confirmed && (
              <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-5 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Lote enviado para processamento</h3>
                  <p className="text-green-700">
                    {stats.valid} pedidos foram validados e adicionados a fila operacional.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Previa dos pedidos</h2>
                  <p className="text-gray-600">
                    Peso total validado: <strong>{stats.totalWeight.toLocaleString("pt-BR")} kg</strong>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={resetImport}
                    className="border-2 border-gray-300 text-gray-800 px-4 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Limpar
                  </button>
                  <button
                    type="button"
                    disabled={hasBlockingErrors}
                    onClick={() => setConfirmed(true)}
                    className="bg-orange-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Confirmar lote
                  </button>
                </div>
              </div>

              {rows.length === 0 ? (
                <div className="p-12 text-center">
                  <PackageCheck className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum arquivo importado</h3>
                  <p className="text-gray-600">Selecione uma planilha para visualizar e validar os pedidos.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px]">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Linha", "Pedido", "Origem", "Destino", "Coleta", "Entrega", "Carga", "Peso", "Volumes", "Status"].map(
                          (heading) => (
                            <th key={heading} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                              {heading}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rows.slice(0, 50).map((row) => (
                        <tr key={`${row.rowNumber}-${row.pedido}`} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-semibold text-gray-500">{row.rowNumber}</td>
                          <td className="px-4 py-4 font-bold text-gray-900">{row.pedido || "-"}</td>
                          <td className="px-4 py-4 text-gray-700">{row.origem || "-"}</td>
                          <td className="px-4 py-4 text-gray-700">{row.destino || "-"}</td>
                          <td className="px-4 py-4 text-gray-700">{row.dataColeta || "-"}</td>
                          <td className="px-4 py-4 text-gray-700">{row.prazoEntrega || "-"}</td>
                          <td className="px-4 py-4 text-gray-700">{row.tipoCarga || "-"}</td>
                          <td className="px-4 py-4 text-gray-700">{row.pesoKg || "-"}</td>
                          <td className="px-4 py-4 text-gray-700">{row.volumes || "-"}</td>
                          <td className="px-4 py-4">
                            {row.errors.length === 0 ? (
                              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                <CheckCircle className="w-4 h-4" />
                                Valido
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                                <AlertTriangle className="w-4 h-4" />
                                {row.errors.join("; ")}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {rows.length > 50 && (
                    <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
                      Exibindo os primeiros 50 pedidos de {rows.length} importados.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
