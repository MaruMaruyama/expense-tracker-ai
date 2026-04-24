import { Expense, Category } from "./types";

export interface ExportFilterOptions {
  dateFrom: string;
  dateTo: string;
  categories: Category[];
}

export function filterForExport(
  expenses: Expense[],
  opts: ExportFilterOptions
): Expense[] {
  return expenses.filter((e) => {
    if (opts.dateFrom && e.date < opts.dateFrom) return false;
    if (opts.dateTo && e.date > opts.dateTo) return false;
    if (opts.categories.length > 0 && !opts.categories.includes(e.category))
      return false;
    return true;
  });
}

export function downloadCSV(expenses: Expense[], filename: string): void {
  const headers = ["Date", "Category", "Amount", "Description"];
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    e.amount.toFixed(2),
    `"${e.description.replace(/"/g, '""')}"`,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  triggerDownload(new Blob([csv], { type: "text/csv" }), `${filename}.csv`);
}

export function downloadJSON(expenses: Expense[], filename: string): void {
  // Strip internal fields before exporting
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const data = expenses.map(({ id: _id, createdAt: _c, ...rest }) => rest);
  triggerDownload(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    `${filename}.json`
  );
}

export async function downloadPDF(
  expenses: Expense[],
  filename: string
): Promise<void> {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  // Title block
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text("Expense Report", 14, 24);

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}`,
    14, 32
  );
  doc.text(`Records: ${expenses.length}`, 14, 38);
  doc.text(`Total: $${total.toFixed(2)}`, 14, 44);

  // Divider
  doc.setDrawColor(230, 230, 230);
  doc.line(14, 48, 196, 48);

  autoTable(doc, {
    startY: 54,
    head: [["Date", "Category", "Amount", "Description"]],
    body: expenses.map((e) => [
      e.date,
      e.category,
      `$${e.amount.toFixed(2)}`,
      e.description,
    ]),
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: { 2: { halign: "right" } },
    foot: [["", "Total", `$${total.toFixed(2)}`, ""]],
    footStyles: {
      fillColor: [245, 245, 255],
      textColor: [99, 102, 241],
      fontStyle: "bold",
    },
  });

  doc.save(`${filename}.pdf`);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
