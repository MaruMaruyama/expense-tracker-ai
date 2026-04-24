"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { ExportRecord, addExportRecord, timeAgo } from "@/lib/cloudExport";

interface Props {
  history: ExportRecord[];
  onHistoryUpdate: (records: ExportRecord[]) => void;
  onToast: (msg: string, type?: "success" | "error") => void;
}

const STATUS_CONFIG = {
  success: { icon: <CheckCircle2 size={13} />, label: "Delivered",  cls: "text-emerald-600 bg-emerald-50" },
  pending: { icon: <Clock size={13} />,         label: "Pending",    cls: "text-amber-600  bg-amber-50"   },
  failed:  { icon: <XCircle size={13} />,        label: "Failed",     cls: "text-red-600    bg-red-50"     },
};

export default function HistoryTab({ history, onHistoryUpdate, onToast }: Props) {
  const [rerunning, setRerunning] = useState<string | null>(null);

  async function handleRerun(record: ExportRecord) {
    setRerunning(record.id);
    await new Promise((r) => setTimeout(r, 1200));
    const newRecord: ExportRecord = {
      ...record,
      id: `${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: "success",
    };
    const updated = addExportRecord(newRecord);
    onHistoryUpdate(updated);
    setRerunning(null);
    onToast(`Re-exported ${record.templateName} ✓`);
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="font-medium text-gray-500">No exports yet</p>
        <p className="text-xs mt-1">Use a template to create your first export</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 px-1 pb-1">
        {history.length} export{history.length !== 1 ? "s" : ""} — last 50 shown
      </p>

      {history.map((record) => {
        const status = STATUS_CONFIG[record.status];
        const isRerunning = rerunning === record.id;
        return (
          <div
            key={record.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors group"
          >
            {/* Destination icon */}
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-base shrink-0">
              {record.destinationIcon}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-semibold text-gray-800 truncate">{record.templateName}</p>
                <span className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${status.cls}`}>
                  {status.icon} {status.label}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {record.format} · {record.destination} · {record.recordCount} records · {timeAgo(record.timestamp)}
              </p>
            </div>

            {/* Re-run */}
            <button
              onClick={() => handleRerun(record)}
              disabled={isRerunning}
              className="shrink-0 p-1.5 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-60"
              title="Re-export"
            >
              {isRerunning ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <RefreshCw size={13} />
              )}
            </button>
          </div>
        );
      })}

      <button
        onClick={() => {
          if (confirm("Clear all export history?")) {
            onHistoryUpdate([]);
            localStorage.removeItem("expense-hub-history");
            onToast("History cleared");
          }
        }}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors mx-auto mt-2"
      >
        <Trash2 size={12} /> Clear history
      </button>
    </div>
  );
}
