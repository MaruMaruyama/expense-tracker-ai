"use client";

import { useState, useMemo } from "react";
import {
  X,
  FileText,
  FileJson,
  Sheet,
  Download,
  Loader2,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
} from "lucide-react";
import { Expense, Category } from "@/lib/types";
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import {
  filterForExport,
  downloadCSV,
  downloadJSON,
  downloadPDF,
} from "@/lib/export";
import { formatCurrency } from "@/lib/utils";

interface Props {
  expenses: Expense[];
  onClose: () => void;
}

type Format = "csv" | "json" | "pdf";

const FORMAT_CONFIG: Record<
  Format,
  { label: string; icon: React.ReactNode; description: string; activeClass: string }
> = {
  csv: {
    label: "CSV",
    icon: <Sheet size={18} />,
    description: "Excel & Google Sheets",
    activeClass: "border-emerald-400 bg-emerald-50 text-emerald-700",
  },
  json: {
    label: "JSON",
    icon: <FileJson size={18} />,
    description: "Structured data",
    activeClass: "border-blue-400 bg-blue-50 text-blue-700",
  },
  pdf: {
    label: "PDF",
    icon: <FileText size={18} />,
    description: "Formatted report",
    activeClass: "border-rose-400 bg-rose-50 text-rose-700",
  },
};

const PREVIEW_LIMIT = 8;

export default function ExportModal({ expenses, onClose }: Props) {
  const defaultDate = new Date().toISOString().slice(0, 10);
  const defaultFilename = `expenses-${defaultDate}`;

  const [format, setFormat] = useState<Format>("csv");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCats, setSelectedCats] = useState<Category[]>([...CATEGORIES]);
  const [filename, setFilename] = useState(defaultFilename);
  const [isExporting, setIsExporting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () =>
      filterForExport(expenses, {
        dateFrom,
        dateTo,
        categories: selectedCats,
      }),
    [expenses, dateFrom, dateTo, selectedCats]
  );

  const previewRows = showAll ? filtered : filtered.slice(0, PREVIEW_LIMIT);
  const totalAmount = filtered.reduce((s, e) => s + e.amount, 0);

  const catCounts = useMemo(
    () =>
      filtered.reduce<Record<string, number>>((acc, e) => {
        acc[e.category] = (acc[e.category] ?? 0) + 1;
        return acc;
      }, {}),
    [filtered]
  );

  function toggleCat(cat: Category) {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleAllCats() {
    setSelectedCats((prev) =>
      prev.length === CATEGORIES.length ? [] : [...CATEGORIES]
    );
  }

  async function handleExport() {
    if (filtered.length === 0 || isExporting) return;
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 350));
    try {
      const name = filename.trim() || defaultFilename;
      if (format === "csv") downloadCSV(filtered, name);
      else if (format === "json") downloadJSON(filtered, name);
      else await downloadPDF(filtered, name);
      onClose();
    } finally {
      setIsExporting(false);
    }
  }

  const ext = { csv: ".csv", json: ".json", pdf: ".pdf" }[format];
  const allCatsSelected = selectedCats.length === CATEGORIES.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Export Data</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Configure, preview, and download your expenses
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* Left panel — options */}
          <div className="w-64 shrink-0 border-r border-gray-100 flex flex-col overflow-y-auto">
            <div className="p-5 space-y-6">

              {/* Format */}
              <section>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                  Format
                </p>
                <div className="space-y-1.5">
                  {(Object.keys(FORMAT_CONFIG) as Format[]).map((f) => {
                    const cfg = FORMAT_CONFIG[f];
                    const active = format === f;
                    return (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                          active
                            ? cfg.activeClass + " border-current shadow-sm"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className={active ? "" : "text-gray-400"}>
                          {cfg.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-tight">{cfg.label}</p>
                          <p className="text-xs text-gray-400 leading-tight mt-0.5">
                            {cfg.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Date range */}
              <section>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                  Date Range
                </p>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">From</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">To</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  {(dateFrom || dateTo) && (
                    <button
                      onClick={() => { setDateFrom(""); setDateTo(""); }}
                      className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                    >
                      Clear dates
                    </button>
                  )}
                </div>
              </section>

              {/* Categories */}
              <section>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                    Categories
                  </p>
                  <button
                    onClick={toggleAllCats}
                    className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                  >
                    {allCatsSelected ? (
                      <><CheckSquare size={12} /> All</>
                    ) : (
                      <><Square size={12} /> All</>
                    )}
                  </button>
                </div>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const checked = selectedCats.includes(cat);
                    const color = CATEGORY_COLORS[cat];
                    const count = catCounts[cat] ?? 0;
                    return (
                      <label
                        key={cat}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCat(cat)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
                        />
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm text-gray-700 flex-1">
                          {CATEGORY_ICONS[cat]} {cat}
                        </span>
                        {count > 0 && (
                          <span className="text-xs text-gray-400">{count}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Filename */}
              <section>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                  Filename
                </p>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder={defaultFilename}
                    className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <span className="text-xs text-gray-400 shrink-0 font-medium">{ext}</span>
                </div>
              </section>
            </div>
          </div>

          {/* Right panel — preview */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">

            {/* Summary bar */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-5 shrink-0 bg-gray-50/60">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-gray-900">
                  {filtered.length}
                </span>
                <span className="text-sm text-gray-400">records</span>
              </div>
              <div className="w-px h-7 bg-gray-200" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-semibold text-gray-700">
                  {formatCurrency(totalAmount)}
                </span>
                <span className="text-xs text-gray-400">total</span>
              </div>
              {filtered.length > 0 && (
                <>
                  <div className="w-px h-7 bg-gray-200 hidden sm:block" />
                  <div className="hidden sm:flex gap-1.5 flex-wrap">
                    {Object.entries(catCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 4)
                      .map(([cat, count]) => (
                        <span
                          key={cat}
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[cat as Category]}18`,
                            color: CATEGORY_COLORS[cat as Category],
                          }}
                        >
                          {cat} · {count}
                        </span>
                      ))}
                  </div>
                </>
              )}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16">
                  <p className="text-5xl mb-4">🔍</p>
                  <p className="font-semibold text-gray-500">No records match your filters</p>
                  <p className="text-sm mt-1">Adjust the date range or categories</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white border-b border-gray-100 z-10">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 w-28">
                        Date
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 px-3 py-3 w-36">
                        Category
                      </th>
                      <th className="text-right text-xs font-semibold text-gray-400 px-3 py-3 w-24">
                        Amount
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 px-3 py-3">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {previewRows.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-2.5 text-gray-500 whitespace-nowrap text-xs">
                          {new Date(e.date + "T00:00:00").toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${CATEGORY_COLORS[e.category]}18`,
                              color: CATEGORY_COLORS[e.category],
                            }}
                          >
                            {CATEGORY_ICONS[e.category]} {e.category}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-gray-800 whitespace-nowrap">
                          {formatCurrency(e.amount)}
                        </td>
                        <td className="px-3 py-2.5 text-gray-500 max-w-[200px] truncate">
                          {e.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Show more/less toggle */}
            {filtered.length > PREVIEW_LIMIT && (
              <div className="border-t border-gray-100 py-2.5 text-center shrink-0">
                <button
                  onClick={() => setShowAll((p) => !p)}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                >
                  {showAll ? (
                    <><EyeOff size={13} /> Show less</>
                  ) : (
                    <><Eye size={13} /> Show all {filtered.length} records</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 bg-gray-50/40">
          <p className="text-xs text-gray-400 truncate max-w-[50%]">
            Saving as{" "}
            <span className="font-semibold text-gray-600">
              {(filename.trim() || defaultFilename) + ext}
            </span>
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={filtered.length === 0 || isExporting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[130px] justify-center"
            >
              {isExporting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Exporting…
                </>
              ) : (
                <>
                  <Download size={15} />
                  Export {FORMAT_CONFIG[format].label}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
