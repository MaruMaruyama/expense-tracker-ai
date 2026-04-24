"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, QrCode, Clock } from "lucide-react";
import QRCode from "qrcode";

interface Props {
  url: string;
  onClose: () => void;
}

const EXPIRY_OPTIONS = [
  { label: "24 hours",  value: "24h" },
  { label: "7 days",   value: "7d"  },
  { label: "30 days",  value: "30d" },
  { label: "Never",    value: "∞"   },
];

export default function SharePanel({ url, onClose }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expiry, setExpiry] = useState("7d");
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 180,
      margin: 1,
      color: { dark: "#1e1b4b", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [url]);

  function copy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
              <QrCode size={14} className="text-indigo-600" />
            </div>
            <p className="text-sm font-bold text-gray-900">Share Report</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* URL */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Shareable Link
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 truncate font-mono">{url}</p>
              </div>
              <button
                onClick={copy}
                className={`shrink-0 p-2 rounded-lg transition-all ${
                  copied
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
          </div>

          {/* Expiry */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Clock size={11} /> Link Expires
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {EXPIRY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setExpiry(opt.value)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    expiry === opt.value
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div>
            <button
              onClick={() => setShowQr((p) => !p)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {showQr ? "Hide QR code" : "Show QR code"}
            </button>
            {showQr && qrDataUrl && (
              <div className="mt-3 flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="QR code"
                  className="w-40 h-40 rounded-xl border border-gray-200 p-1"
                />
                <p className="text-[11px] text-gray-400">Scan to open on mobile</p>
              </div>
            )}
          </div>

          {/* Permissions note */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Anyone with this link</span> can view the exported report. No login required.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
