"use client";

import { useState } from "react";
import { Loader2, Share2, Download, ChevronRight } from "lucide-react";
import { Expense } from "@/lib/types";
import {
  EXPORT_TEMPLATES,
  CLOUD_SERVICES,
  ExportTemplate,
  ExportRecord,
  addExportRecord,
  buildCSVBlob,
  triggerDownload,
  generateShareId,
} from "@/lib/cloudExport";

interface Props {
  expenses: Expense[];
  connectedIds: string[];
  onHistoryUpdate: (records: ExportRecord[]) => void;
  onShare: (url: string) => void;
  onToast: (msg: string, type?: "success" | "error") => void;
}

export default function TemplatesTab({
  expenses,
  connectedIds,
  onHistoryUpdate,
  onShare,
  onToast,
}: Props) {
  const [exporting, setExporting] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedDest, setSelectedDest] = useState<Record<string, string>>({});

  const connected = CLOUD_SERVICES.filter((s) => connectedIds.includes(s.id));

  async function handleExport(template: ExportTemplate) {
    const dest = selectedDest[template.id] || connected[0]?.id || "email";
    const service = CLOUD_SERVICES.find((s) => s.id === dest);
    setExporting(template.id);
    await new Promise((r) => setTimeout(r, 1400));

    // Simulate actual file download for CSV templates
    if (template.formats.includes("CSV") && expenses.length > 0) {
      triggerDownload(buildCSVBlob(expenses), `${template.id}-export.csv`);
    }

    const record: ExportRecord = {
      id: `${Date.now()}`,
      templateId: template.id,
      templateName: template.name,
      format: template.formats[0],
      destination: service?.name ?? "Email",
      destinationIcon: service?.emoji ?? "✉️",
      timestamp: new Date().toISOString(),
      status: "success",
      recordCount: expenses.length,
    };

    const updated = addExportRecord(record);
    onHistoryUpdate(updated);
    setExporting(null);
    onToast(`${template.name} sent to ${service?.name ?? "Email"} ✓`);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 px-1">
        Pre-built templates optimized for common reporting needs.
      </p>

      {EXPORT_TEMPLATES.map((t) => {
        const isExpanded = expanded === t.id;
        const isExporting = exporting === t.id;
        const dest = selectedDest[t.id] || connected[0]?.id || "email";

        return (
          <div
            key={t.id}
            className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm"
          >
            {/* Card header */}
            <div className="flex items-start gap-3 p-4">
              <span className="text-2xl shrink-0 mt-0.5">{t.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${t.badgeColor}`}>
                    {t.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.description}</p>
                <div className="flex gap-1.5 mt-2">
                  {t.formats.map((f) => (
                    <span key={f} className="text-[10px] font-semibold px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setExpanded(isExpanded ? null : t.id)}
                className="text-gray-300 hover:text-gray-500 transition-colors shrink-0 mt-0.5"
              >
                <ChevronRight
                  size={16}
                  className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>
            </div>

            {/* Expanded destination picker */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-0 border-t border-gray-50 space-y-3">
                <p className="text-xs text-gray-400 pt-3 font-medium">Send to</p>
                <div className="grid grid-cols-2 gap-2">
                  {connected.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() =>
                        setSelectedDest((p) => ({ ...p, [t.id]: svc.id }))
                      }
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        dest === svc.id
                          ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{svc.emoji}</span> {svc.name}
                    </button>
                  ))}
                  {connected.length === 0 && (
                    <p className="col-span-2 text-xs text-gray-400 italic">
                      Connect a service in the Destinations tab first.
                    </p>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">{t.purpose}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport(t)}
                    disabled={isExporting || expenses.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {isExporting ? (
                      <><Loader2 size={13} className="animate-spin" /> Exporting…</>
                    ) : (
                      <><Download size={13} /> Export</>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      onShare(
                        `https://expense-tracker-ai-flax.vercel.app/r/${generateShareId()}`
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Share2 size={13} /> Share
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
