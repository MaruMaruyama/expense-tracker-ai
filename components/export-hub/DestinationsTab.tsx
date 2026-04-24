"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Unplug, Plug } from "lucide-react";
import { CLOUD_SERVICES } from "@/lib/cloudExport";

interface Props {
  connectedIds: string[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onToast: (msg: string, type?: "success" | "error") => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  storage: "Cloud Storage",
  productivity: "Productivity",
  communication: "Communication",
  automation: "Automation",
};

export default function DestinationsTab({ connectedIds, onConnect, onDisconnect, onToast }: Props) {
  const [connecting, setConnecting] = useState<string | null>(null);

  async function handleConnect(id: string) {
    const svc = CLOUD_SERVICES.find((s) => s.id === id)!;
    setConnecting(id);
    // Simulate OAuth redirect + callback
    await new Promise((r) => setTimeout(r, 1800));
    onConnect(id);
    setConnecting(null);
    onToast(`Connected to ${svc.name} ✓`);
  }

  function handleDisconnect(id: string) {
    const svc = CLOUD_SERVICES.find((s) => s.id === id)!;
    onDisconnect(id);
    onToast(`Disconnected from ${svc.name}`);
  }

  const categories = Array.from(new Set(CLOUD_SERVICES.map((s) => s.category)));

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-400 px-1">
        Connect your accounts to send exports directly. Data is never stored on our servers.
      </p>

      {categories.map((cat) => (
        <div key={cat}>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
            {CATEGORY_LABELS[cat]}
          </p>
          <div className="space-y-2">
            {CLOUD_SERVICES.filter((s) => s.category === cat).map((svc) => {
              const isConnected = connectedIds.includes(svc.id);
              const isConnecting = connecting === svc.id;
              return (
                <div
                  key={svc.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isConnected
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: `${svc.brandColor}15` }}
                  >
                    {svc.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-gray-800">{svc.name}</p>
                      {isConnected && (
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{svc.description}</p>
                  </div>

                  {/* Action */}
                  {isConnected ? (
                    <button
                      onClick={() => handleDisconnect(svc.id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0 px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                      <Unplug size={12} /> Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(svc.id)}
                      disabled={isConnecting}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition-colors shrink-0"
                    >
                      {isConnecting ? (
                        <><Loader2 size={12} className="animate-spin" /> Connecting…</>
                      ) : (
                        <><Plug size={12} /> Connect</>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
        <p className="text-xs text-blue-700 font-medium">🔒 Privacy note</p>
        <p className="text-xs text-blue-600 mt-0.5">
          Connections use OAuth 2.0. Your credentials are never stored — only access tokens scoped to export folders.
        </p>
      </div>
    </div>
  );
}
