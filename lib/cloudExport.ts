import { Expense } from "./types";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge: string;
  badgeColor: string;
  formats: string[];
  purpose: string;
}

export interface CloudService {
  id: string;
  name: string;
  emoji: string;
  brandColor: string;
  description: string;
  category: "storage" | "productivity" | "communication" | "automation";
}

export interface ExportRecord {
  id: string;
  templateId: string;
  templateName: string;
  format: string;
  destination: string;
  destinationIcon: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
  recordCount: number;
}

export interface ScheduleConfig {
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly";
  templateId: string;
  destinationId: string;
  time: string;
  nextRun: string;
}

// ── Static Data ───────────────────────────────────────────────────────────────

export const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: "tax",
    name: "Tax Report",
    description: "Full year itemized expenses for tax filing. Includes all categories with totals.",
    icon: "🧾",
    badge: "Finance",
    badgeColor: "bg-amber-100 text-amber-700",
    formats: ["PDF", "CSV"],
    purpose: "Send to accountant or import into tax software",
  },
  {
    id: "monthly",
    name: "Monthly Summary",
    description: "This month's spending overview with category breakdown and trends.",
    icon: "📅",
    badge: "Summary",
    badgeColor: "bg-blue-100 text-blue-700",
    formats: ["PDF"],
    purpose: "Review personal budget performance",
  },
  {
    id: "category",
    name: "Category Analysis",
    description: "Deep dive into spending patterns across all categories with percentages.",
    icon: "🏷️",
    badge: "Analytics",
    badgeColor: "bg-violet-100 text-violet-700",
    formats: ["CSV", "JSON"],
    purpose: "Import into BI tools or spreadsheets",
  },
  {
    id: "budget",
    name: "Budget Review",
    description: "Side-by-side comparison of expenses versus estimated budget targets.",
    icon: "💰",
    badge: "Finance",
    badgeColor: "bg-emerald-100 text-emerald-700",
    formats: ["PDF", "CSV"],
    purpose: "Identify overspending and adjust budgets",
  },
  {
    id: "year-review",
    name: "Year in Review",
    description: "Annual spending trends, record highs, top categories, and month-over-month changes.",
    icon: "📈",
    badge: "Insights",
    badgeColor: "bg-rose-100 text-rose-700",
    formats: ["PDF"],
    purpose: "Annual financial health check",
  },
];

export const CLOUD_SERVICES: CloudService[] = [
  { id: "email",         name: "Email",         emoji: "✉️",  brandColor: "#6366f1", description: "Send to any email address",         category: "communication" },
  { id: "google-sheets", name: "Google Sheets", emoji: "📊",  brandColor: "#0f9d58", description: "Sync to a Google Sheets spreadsheet", category: "productivity" },
  { id: "notion",        name: "Notion",        emoji: "📝",  brandColor: "#000000", description: "Push data to a Notion database",      category: "productivity" },
  { id: "dropbox",       name: "Dropbox",       emoji: "📦",  brandColor: "#0061ff", description: "Save to your Dropbox folder",         category: "storage" },
  { id: "onedrive",      name: "OneDrive",      emoji: "☁️",  brandColor: "#0078d4", description: "Microsoft cloud storage sync",        category: "storage" },
  { id: "slack",         name: "Slack",         emoji: "💬",  brandColor: "#4a154b", description: "Post a summary to a Slack channel",   category: "communication" },
  { id: "zapier",        name: "Zapier",        emoji: "⚡",  brandColor: "#ff4a00", description: "Trigger automations with 5,000+ apps", category: "automation" },
  { id: "airtable",      name: "Airtable",      emoji: "🗂️", brandColor: "#fcb400", description: "Import into an Airtable base",        category: "productivity" },
];

// ── localStorage Helpers ──────────────────────────────────────────────────────

const HISTORY_KEY   = "expense-hub-history";
const SCHEDULE_KEY  = "expense-hub-schedule";
const CONNECTED_KEY = "expense-hub-connected";

// Pre-seeded demo history entries (shown on first load)
const SEED_HISTORY: ExportRecord[] = [
  {
    id: "seed-1",
    templateId: "monthly",
    templateName: "Monthly Summary",
    format: "PDF",
    destination: "Email",
    destinationIcon: "✉️",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "success",
    recordCount: 34,
  },
  {
    id: "seed-2",
    templateId: "category",
    templateName: "Category Analysis",
    format: "CSV",
    destination: "Google Sheets",
    destinationIcon: "📊",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "success",
    recordCount: 87,
  },
  {
    id: "seed-3",
    templateId: "tax",
    templateName: "Tax Report",
    format: "PDF",
    destination: "Dropbox",
    destinationIcon: "📦",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "failed",
    recordCount: 212,
  },
];

export function loadExportHistory(): ExportRecord[] {
  if (typeof window === "undefined") return SEED_HISTORY;
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : SEED_HISTORY;
  } catch {
    return SEED_HISTORY;
  }
}

export function addExportRecord(record: ExportRecord): ExportRecord[] {
  const history = loadExportHistory();
  const updated = [record, ...history].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function loadSchedule(): ScheduleConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSchedule(config: ScheduleConfig): void {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(config));
}

export function loadConnectedServices(): string[] {
  if (typeof window === "undefined") return ["email"];
  try {
    const raw = localStorage.getItem(CONNECTED_KEY);
    return raw ? JSON.parse(raw) : ["email"];
  } catch {
    return ["email"];
  }
}

export function saveConnectedServices(ids: string[]): void {
  localStorage.setItem(CONNECTED_KEY, JSON.stringify(ids));
}

// ── Utilities ─────────────────────────────────────────────────────────────────

export function generateShareId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function calcNextRun(frequency: ScheduleConfig["frequency"], time: string): string {
  const now = new Date();
  const [h, m] = time.split(":").map(Number);
  const next = new Date(now);
  next.setHours(h, m, 0, 0);
  if (next <= now) {
    if (frequency === "daily") next.setDate(next.getDate() + 1);
    else if (frequency === "weekly") next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
  }
  return next.toISOString();
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function buildCSVBlob(expenses: Expense[]): Blob {
  const rows = [
    ["Date", "Category", "Amount", "Description"],
    ...expenses.map((e) => [e.date, e.category, e.amount.toFixed(2), `"${e.description.replace(/"/g, '""')}"`]),
  ];
  return new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
