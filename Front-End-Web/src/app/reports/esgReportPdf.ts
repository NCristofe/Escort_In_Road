import type { jsPDF } from "jspdf";
import {
  BASELINE_KM_PER_LITER,
  DIESEL_EMISSION_FACTOR_KG_PER_LITER,
  TREE_ABSORPTION_KG_PER_YEAR,
  initiatives,
  litersToCo2Tons,
  type ClientCompany,
  type EsgMonth,
  type EsgSummary,
} from "../data/esg";

/**
 * Relatório de impacto ambiental em PDF.
 *
 * O documento é desenhado em vetor (texto, retângulos e linhas), sem captura de
 * tela: o arquivo fica leve, o texto é selecionável e o resultado não depende do
 * tamanho da janela em que a página foi aberta.
 */

type Rgb = [number, number, number];

const palette: Record<string, Rgb> = {
  orange: [234, 88, 12],
  orangeDark: [194, 65, 12],
  emerald: [5, 150, 105],
  ink: [17, 24, 39],
  body: [55, 65, 81],
  muted: [107, 114, 128],
  line: [229, 231, 235],
  softBg: [249, 250, 251],
  white: [255, 255, 255],
};

const page = {
  width: 210,
  height: 297,
  margin: 16,
};

const contentWidth = page.width - page.margin * 2;

const integerFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const decimalFormat = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const percentFormat = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
/** O fator de emissão precisa das duas casas: 2,68 e não 2,7. */
const factorFormat = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const dateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

export type EsgReportInput = {
  /** Empresa destinatária, ou null para o consolidado da operação. */
  company: ClientCompany | null;
  periodLabel: string;
  series: EsgMonth[];
  summary: EsgSummary;
  /** Informado nos testes para manter a data do documento estável. */
  issuedAt?: Date;
};

function setFill(doc: jsPDF, color: Rgb) {
  doc.setFillColor(color[0], color[1], color[2]);
}

function setText(doc: jsPDF, color: Rgb) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function setDraw(doc: jsPDF, color: Rgb) {
  doc.setDrawColor(color[0], color[1], color[2]);
}

function drawHeader(doc: jsPDF, input: EsgReportInput) {
  setFill(doc, palette.orange);
  doc.rect(0, 0, page.width, 34, "F");

  setText(doc, palette.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("ESCORTinRoad", page.margin, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("TRANSPORTE E LOGÍSTICA", page.margin, 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Relatório de Impacto Ambiental", page.width - page.margin, 15, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(input.periodLabel, page.width - page.margin, 21, { align: "right" });
  doc.text(
    `Emitido em ${dateFormat.format(input.issuedAt ?? new Date())}`,
    page.width - page.margin,
    26,
    { align: "right" },
  );
}

function drawCompanyBlock(doc: jsPDF, input: EsgReportInput, top: number) {
  const height = 24;

  setFill(doc, palette.softBg);
  setDraw(doc, palette.line);
  doc.roundedRect(page.margin, top, contentWidth, height, 2, 2, "FD");

  setText(doc, palette.muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("RELATÓRIO PREPARADO PARA", page.margin + 6, top + 8);

  setText(doc, palette.ink);
  doc.setFontSize(14);
  doc.text(input.company?.name ?? "Operação consolidada", page.margin + 6, top + 16);

  const detail = input.company
    ? `${input.company.segment}  •  CNPJ ${input.company.document}  •  Cliente desde ${input.company.since}`
    : "Todos os embarques monitorados pela ESCORTinRoad no período";

  setText(doc, palette.body);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(detail, page.margin + 6, top + 21);

  return top + height;
}

function drawKpis(doc: jsPDF, summary: EsgSummary, top: number) {
  const cards: Array<{ label: string; value: string; hint: string; accent: Rgb }> = [
    {
      label: "CO2 EVITADO",
      value: `${decimalFormat.format(summary.co2AvoidedTons)} t`,
      hint: `${integerFormat.format(summary.equivalentTrees)} árvores por um ano`,
      accent: palette.emerald,
    },
    {
      label: "DIESEL ECONOMIZADO",
      value: `${integerFormat.format(summary.dieselSavedLiters)} L`,
      hint: `Base: ${integerFormat.format(summary.dieselBaselineLiters)} L`,
      accent: palette.orange,
    },
    {
      label: "REDUÇÃO DE CONSUMO",
      value: percentFormat.format(summary.savingsRate),
      hint: `${integerFormat.format(summary.kmTraveled)} km rodados`,
      accent: palette.ink,
    },
    {
      label: "EFICIÊNCIA MÉDIA",
      value: `${decimalFormat.format(summary.kmPerLiter)} km/L`,
      hint: `Linha de base: ${decimalFormat.format(summary.baselineKmPerLiter)} km/L`,
      accent: palette.body,
    },
  ];

  const gap = 4;
  const cardWidth = (contentWidth - gap * (cards.length - 1)) / cards.length;
  const cardHeight = 28;

  cards.forEach((card, index) => {
    const x = page.margin + index * (cardWidth + gap);

    setFill(doc, palette.white);
    setDraw(doc, palette.line);
    doc.roundedRect(x, top, cardWidth, cardHeight, 2, 2, "FD");

    setFill(doc, card.accent);
    doc.rect(x, top, 1.6, cardHeight, "F");

    setText(doc, palette.muted);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text(card.label, x + 5, top + 7);

    setText(doc, card.accent);
    doc.setFontSize(14);
    doc.text(card.value, x + 5, top + 16);

    setText(doc, palette.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(doc.splitTextToSize(card.hint, cardWidth - 8), x + 5, top + 22);
  });

  return top + cardHeight;
}

function drawSectionTitle(doc: jsPDF, title: string, subtitle: string, top: number) {
  setText(doc, palette.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(title, page.margin, top);

  setText(doc, palette.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(subtitle, page.margin, top + 5);

  return top + 9;
}

function drawMonthlyChart(doc: jsPDF, series: EsgMonth[], top: number) {
  const chartHeight = 46;
  const baseline = top + chartHeight;
  const maxValue = Math.max(...series.map((month) => month.co2AvoidedTons), 1);
  const slot = contentWidth / series.length;
  const barWidth = Math.min(slot * 0.55, 12);

  // Linhas de grade em 0%, 50% e 100% do máximo
  setDraw(doc, palette.line);
  doc.setLineWidth(0.2);
  [0, 0.5, 1].forEach((ratio) => {
    const y = baseline - chartHeight * ratio;
    doc.line(page.margin, y, page.margin + contentWidth, y);
    setText(doc, palette.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.text(`${decimalFormat.format(maxValue * ratio)} t`, page.margin + contentWidth, y - 1, {
      align: "right",
    });
  });

  series.forEach((month, index) => {
    const barHeight = (month.co2AvoidedTons / maxValue) * chartHeight;
    const x = page.margin + slot * index + (slot - barWidth) / 2;

    setFill(doc, palette.emerald);
    doc.roundedRect(x, baseline - barHeight, barWidth, barHeight, 0.8, 0.8, "F");

    setText(doc, palette.body);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.text(decimalFormat.format(month.co2AvoidedTons), x + barWidth / 2, baseline - barHeight - 1.5, {
      align: "center",
    });

    setText(doc, palette.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text(month.label, x + barWidth / 2, baseline + 4, { align: "center" });
  });

  return baseline + 8;
}

function drawInitiatives(doc: jsPDF, summary: EsgSummary, top: number) {
  const rowHeight = 8;
  const barMaxWidth = 70;
  const barX = page.margin + 68;

  const rows = initiatives
    .map((initiative) => ({
      initiative,
      liters: summary.savingsByInitiative[initiative.id],
      share: summary.dieselSavedLiters
        ? summary.savingsByInitiative[initiative.id] / summary.dieselSavedLiters
        : 0,
    }))
    .sort((a, b) => b.liters - a.liters);

  rows.forEach((row, index) => {
    const y = top + index * rowHeight;

    setText(doc, palette.body);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(row.initiative.label, page.margin, y + 3.5);

    setFill(doc, palette.line);
    doc.roundedRect(barX, y, barMaxWidth, 3.6, 1.8, 1.8, "F");

    setFill(doc, palette.emerald);
    doc.roundedRect(barX, y, Math.max(barMaxWidth * row.share, 1.5), 3.6, 1.8, 1.8, "F");

    setText(doc, palette.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      `${integerFormat.format(row.liters)} L  (${percentFormat.format(row.share)})`,
      page.width - page.margin,
      y + 3.5,
      { align: "right" },
    );
  });

  return top + rows.length * rowHeight;
}

function drawMonthlyTable(doc: jsPDF, series: EsgMonth[], summary: EsgSummary, top: number) {
  const columns: Array<{ title: string; width: number; align: "left" | "right" }> = [
    { title: "Mês", width: 30, align: "left" },
    { title: "Km rodados", width: 34, align: "right" },
    { title: "Linha de base (L)", width: 36, align: "right" },
    { title: "Economizado (L)", width: 34, align: "right" },
    { title: "CO2 evitado (t)", width: 32, align: "right" },
    { title: "km/L", width: 12, align: "right" },
  ];

  const rowHeight = 7;
  let y = top;

  const columnX = (index: number) =>
    page.margin + columns.slice(0, index).reduce((sum, column) => sum + column.width, 0);

  const cellX = (index: number) =>
    columns[index].align === "right"
      ? columnX(index) + columns[index].width - 2
      : columnX(index) + 2;

  setFill(doc, palette.ink);
  doc.rect(page.margin, y, contentWidth, rowHeight, "F");
  setText(doc, palette.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  columns.forEach((column, index) => {
    doc.text(column.title, cellX(index), y + 4.8, { align: column.align });
  });
  y += rowHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  series.forEach((month, rowIndex) => {
    if (rowIndex % 2 === 1) {
      setFill(doc, palette.softBg);
      doc.rect(page.margin, y, contentWidth, rowHeight, "F");
    }

    const values = [
      month.label,
      integerFormat.format(month.kmTraveled),
      integerFormat.format(month.dieselBaselineLiters),
      integerFormat.format(month.dieselSavedLiters),
      decimalFormat.format(month.co2AvoidedTons),
      decimalFormat.format(month.kmPerLiter),
    ];

    setText(doc, palette.body);
    values.forEach((value, index) => {
      doc.text(value, cellX(index), y + 4.8, { align: columns[index].align });
    });

    y += rowHeight;
  });

  setFill(doc, palette.emerald);
  doc.rect(page.margin, y, contentWidth, rowHeight, "F");
  setText(doc, palette.white);
  doc.setFont("helvetica", "bold");

  const totals = [
    "Total",
    integerFormat.format(summary.kmTraveled),
    integerFormat.format(summary.dieselBaselineLiters),
    integerFormat.format(summary.dieselSavedLiters),
    decimalFormat.format(summary.co2AvoidedTons),
    decimalFormat.format(summary.kmPerLiter),
  ];
  totals.forEach((value, index) => {
    doc.text(value, cellX(index), y + 4.8, { align: columns[index].align });
  });

  return y + rowHeight;
}

function drawEquivalences(doc: jsPDF, summary: EsgSummary, top: number) {
  const items = [
    {
      value: integerFormat.format(summary.equivalentTrees),
      label: "árvores adultas absorvendo CO2 por um ano",
    },
    {
      value: integerFormat.format(summary.equivalentCars),
      label: "carros de passeio fora de circulação por um ano",
    },
    {
      value: integerFormat.format(Math.round(summary.dieselSavedLiters / 550)),
      label: "tanques de carreta que não foram abastecidos",
    },
  ];

  const gap = 4;
  const cardWidth = (contentWidth - gap * (items.length - 1)) / items.length;
  const cardHeight = 20;

  items.forEach((item, index) => {
    const x = page.margin + index * (cardWidth + gap);

    setFill(doc, palette.softBg);
    setDraw(doc, palette.line);
    doc.roundedRect(x, top, cardWidth, cardHeight, 2, 2, "FD");

    setText(doc, palette.emerald);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(item.value, x + 5, top + 9);

    setText(doc, palette.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(doc.splitTextToSize(item.label, cardWidth - 9), x + 5, top + 14);
  });

  return top + cardHeight;
}

function drawMethodology(doc: jsPDF, input: EsgReportInput, top: number) {
  const share = input.company
    ? ` Os valores correspondem à participação de ${percentFormat.format(
        input.company.operationShare,
      )} desta empresa no volume transportado no período.`
    : "";

  const text =
    `A linha de base considera a eficiência média da frota em ${decimalFormat.format(
      BASELINE_KM_PER_LITER,
    )} km/L. ` +
    `O CO2 evitado converte os litros economizados pelo fator de emissão do diesel S10 de ` +
    `${factorFormat.format(DIESEL_EMISSION_FACTOR_KG_PER_LITER)} kg de CO2e por litro, conforme o ` +
    `escopo 1 do GHG Protocol. As equivalências adotam ${integerFormat.format(
      TREE_ABSORPTION_KG_PER_YEAR,
    )} kg de CO2 absorvidos por árvore ao ano.` +
    share;

  setText(doc, palette.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const lines = doc.splitTextToSize(text, contentWidth);
  doc.text(lines, page.margin, top);

  return top + lines.length * 3.2;
}

function drawFooters(doc: jsPDF) {
  const total = doc.getNumberOfPages();

  for (let pageNumber = 1; pageNumber <= total; pageNumber += 1) {
    doc.setPage(pageNumber);

    setDraw(doc, palette.line);
    doc.setLineWidth(0.2);
    doc.line(page.margin, page.height - 14, page.width - page.margin, page.height - 14);

    setText(doc, palette.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(
      "ESCORTinRoad — Documento gerado automaticamente pelo painel ESG.",
      page.margin,
      page.height - 9,
    );
    doc.text(`Página ${pageNumber} de ${total}`, page.width - page.margin, page.height - 9, {
      align: "right",
    });
  }
}

function fileNameFor(input: EsgReportInput) {
  const slug = (input.company?.name ?? "operacao-consolidada")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `relatorio-impacto-ambiental-${slug}.pdf`;
}

/** Monta o documento e devolve a instância pronta para salvar ou inspecionar. */
export async function buildEsgReport(input: EsgReportInput) {
  const { jsPDF: JsPdf } = await import("jspdf");
  const doc = new JsPdf({ unit: "mm", format: "a4", compress: true });

  doc.setProperties({
    title: `Relatório de impacto ambiental — ${input.company?.name ?? "Operação consolidada"}`,
    subject: "Impacto ambiental da operação de transporte",
    author: "ESCORTinRoad",
    creator: "Painel ESG ESCORTinRoad",
  });

  drawHeader(doc, input);

  let cursor = 44;
  cursor = drawCompanyBlock(doc, input, cursor) + 8;
  cursor = drawKpis(doc, input.summary, cursor) + 12;

  cursor = drawSectionTitle(
    doc,
    "Toneladas de CO2 evitadas por mês",
    "Emissões que deixaram de ocorrer em relação à linha de base da frota.",
    cursor,
  );
  cursor = drawMonthlyChart(doc, input.series, cursor) + 8;

  cursor = drawSectionTitle(
    doc,
    "Origem da economia",
    "Contribuição de cada iniciativa para os litros economizados.",
    cursor,
  );
  cursor = drawInitiatives(doc, input.summary, cursor) + 8;

  cursor = drawSectionTitle(
    doc,
    "O que isso representa",
    "Equivalências para comunicação com times e stakeholders.",
    cursor,
  );
  drawEquivalences(doc, input.summary, cursor);

  doc.addPage();
  drawHeader(doc, input);

  cursor = 44;
  cursor = drawSectionTitle(
    doc,
    "Detalhamento mensal",
    "Consumo, economia e emissões evitadas mês a mês.",
    cursor,
  );
  cursor = drawMonthlyTable(doc, input.series, input.summary, cursor) + 10;

  cursor = drawSectionTitle(doc, "Metodologia", "Como cada número foi calculado.", cursor);
  drawMethodology(doc, input, cursor);

  drawFooters(doc);

  return doc;
}

/** Gera o relatório e entrega o arquivo ao navegador. */
export async function generateEsgReport(input: EsgReportInput) {
  const doc = await buildEsgReport(input);
  doc.save(fileNameFor(input));
}
