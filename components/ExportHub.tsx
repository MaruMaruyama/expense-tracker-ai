"use client";

import { useState, useEffect, useCallback } from "react";
import { X, LayoutTemplate, Globe, CalendarClock, History, CheckCircle2 } from "lucide-react";
import { Expense } from "@/lib/types";
import {
  ExportRecord,
  loadExportHistory,
  loadConnectedServices,
  saveConnectedServices,
} from "@/lib/cloudExport";
import TemplatesTab from "./export-hub/TemplatesTab";
import DestinationsTab from "./export-hub/DestinationsTab";
import ScheduleTab from "./export-hub/ScheduleTab";
import HistoryTab from "./export-hub/HistoryTab";
import SharePanel from "./export-hub/SharePanel";

interface Props {
  expenses: Expense[];
  onClose: () => void;
}

type HubTab = "templates" | "destinations" | "schedule" | "history";

interface Toast {
  id: number;
  msg: string;
  type: "success" | "error";
}

const TABS: { id: HubTab; label: string; icon: React.ReactNode }[] = [
  { id: "templates",    label: "Templates",    icon: <LayoutTemplate size={15} /> },
  { id: "destinations", label: "Destinations", icon: <Globe size={15} />          },
  { id: "schedule",     label: "Schedule",     icon: <CalendarClock size={15} />  },
  { id: "history",      label: "History",      icon: <History size={15} />        },
];

export default function ExportHub({ expenses, onClose }: Props) {
  const [tab, setTab] = useState<HubTab>("templates");
  const [history, setHistory] = useState<ExportRecord[]>([]);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setHistory(loadExportHistory());
    setConnectedIds(loadConnectedServices());
  }, []);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  }, []);

  function handleConnect(id: string) {
    setConnectedIds((prev) => {
      const next = [...prev, id];
      saveConnectedServices(next);
      return next;
    });
  }

  function handleDisconnect(id: string) {
    setConnectedIds((prev) => {
      const next = prev.filter((s) => s !== id);
      saveConnectedServices(next);
      return next;
    });
  }

  const connectedCount = connectedIds.length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-gray-50 z-50 flex flex-col shadow-2xl">

        {/* ── Drawer Header ── */}
        <div className="bg-white border-b border-gray-100 px-5 py-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm">🚀</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Export Hub</p>
                <p className="text-[11px] text-gray-400">
                  {expenses.length} records · {connectedCount} service{connectedCount !== 1 ? "s" : ""} connected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab nav */}
          <div className="flex gap-0.5 bg-gray-100 rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tab === t.id
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
                {t.id === "history" && history.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 text-[9px] font-bold flex items-center justify-center">
                    {history.length > 9 ? "9+" : history.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === "templates" && (
            <TemplatesTab
              expenses={expenses}
              connectedIds={connectedIds}
              onHistoryUpdate={setHistory}
              onShare={setShareUrl}
              onToast={showToast}
            />
          )}
          {tab === "destinations" && (
            <DestinationsTab
              connectedIds={connectedIds}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onToast={showToast}
            />
          )}
          {tab === "schedule" && (
            <ScheduleTab connectedIds={connectedIds} onToast={showToast} />
          )}
          {tab === "history" && (
            <HistoryTab
              history={history}
              onHistoryUpdate={setHistory}
              onToast={showToast}
            />
          )}
        </div>

        {/* ── Toast stack ── */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium text-white animate-fade-in ${
                t.type === "error" ? "bg-red-500" : "bg-gray-900"
              }`}
            >
              <CheckCircle2 size={15} className="shrink-0" />
              {t.msg}
            </div>
          ))}
        </div>
      </div>

      {/* Share Panel (renders on top of drawer) */}
      {shareUrl && (
        <SharePanel url={shareUrl} onClose={() => setShareUrl(null)} />
      )}
    </>
  );
}
