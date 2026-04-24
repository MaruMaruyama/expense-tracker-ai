"use client";

import { useState, useEffect } from "react";
import { Clock, CalendarClock, ToggleLeft, ToggleRight, Save } from "lucide-react";
import {
  EXPORT_TEMPLATES,
  CLOUD_SERVICES,
  ScheduleConfig,
  loadSchedule,
  saveSchedule,
  calcNextRun,
} from "@/lib/cloudExport";

interface Props {
  connectedIds: string[];
  onToast: (msg: string, type?: "success" | "error") => void;
}

const DEFAULT: ScheduleConfig = {
  enabled: false,
  frequency: "weekly",
  templateId: "monthly",
  destinationId: "email",
  time: "09:00",
  nextRun: "",
};

export default function ScheduleTab({ connectedIds, onToast }: Props) {
  const [config, setConfig] = useState<ScheduleConfig>(DEFAULT);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = loadSchedule();
    if (saved) setConfig(saved);
    setLoaded(true);
  }, []);

  const set = (patch: Partial<ScheduleConfig>) =>
    setConfig((prev) => ({ ...prev, ...patch }));

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const nextRun = calcNextRun(config.frequency, config.time);
    const final = { ...config, nextRun };
    saveSchedule(final);
    setConfig(final);
    setSaving(false);
    onToast(config.enabled ? "Schedule saved ✓" : "Schedule disabled");
  }

  const connected = CLOUD_SERVICES.filter((s) => connectedIds.includes(s.id));
  const nextRunDate = config.nextRun
    ? new Date(config.nextRun).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  if (!loaded) return null;

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-400 px-1">
        Set up automatic recurring exports. Exports run in the background and are delivered to your connected destination.
      </p>

      {/* Enable toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white">
        <div>
          <p className="text-sm font-semibold text-gray-800">Auto-export</p>
          <p className="text-xs text-gray-400 mt-0.5">Run exports on a recurring schedule</p>
        </div>
        <button
          onClick={() => set({ enabled: !config.enabled })}
          className="transition-colors"
        >
          {config.enabled ? (
            <ToggleRight size={32} className="text-indigo-600" />
          ) : (
            <ToggleLeft size={32} className="text-gray-300" />
          )}
        </button>
      </div>

      {/* Frequency */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Frequency</p>
        <div className="grid grid-cols-3 gap-2">
          {(["daily", "weekly", "monthly"] as const).map((f) => (
            <button
              key={f}
              onClick={() => set({ frequency: f })}
              className={`py-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                config.frequency === f
                  ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Time</p>
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-gray-400 shrink-0" />
          <input
            type="time"
            value={config.time}
            onChange={(e) => set({ time: e.target.value })}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Template */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Template</p>
        <select
          value={config.templateId}
          onChange={(e) => set({ templateId: e.target.value })}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          {EXPORT_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.icon} {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Destination */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Destination</p>
        {connected.length === 0 ? (
          <p className="text-xs text-gray-400 italic p-3 bg-gray-50 rounded-lg">
            Connect a service in the Destinations tab first.
          </p>
        ) : (
          <select
            value={config.destinationId}
            onChange={(e) => set({ destinationId: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            {connected.map((s) => (
              <option key={s.id} value={s.id}>
                {s.emoji} {s.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Next run info */}
      {nextRunDate && config.enabled && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
          <CalendarClock size={15} className="text-indigo-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-indigo-700">Next scheduled run</p>
            <p className="text-xs text-indigo-500 mt-0.5">{nextRunDate}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
      >
        <Save size={14} />
        {saving ? "Saving…" : "Save Schedule"}
      </button>
    </div>
  );
}
