"use client";

import { Expense } from "@/lib/types";
import { formatCurrency, getMonthlyTotal, getCategoryTotals } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/constants";
import { TrendingUp, Calendar, Tag, DollarSign } from "lucide-react";

interface Props {
  expenses: Expense[];
}

export default function SummaryCards({ expenses }: Props) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const monthly = getMonthlyTotal(expenses);
  const categoryTotals = getCategoryTotals(expenses);
  const topCategory = categoryTotals[0];
  const avgExpense = expenses.length ? total / expenses.length : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon={<DollarSign size={20} />}
        label="Total Spending"
        value={formatCurrency(total)}
        sub={`${expenses.length} expenses`}
        color="indigo"
      />
      <Card
        icon={<Calendar size={20} />}
        label="This Month"
        value={formatCurrency(monthly)}
        sub="current month"
        color="emerald"
      />
      <Card
        icon={<Tag size={20} />}
        label="Top Category"
        value={topCategory ? `${CATEGORY_ICONS[topCategory.name]} ${topCategory.name}` : "—"}
        sub={topCategory ? formatCurrency(topCategory.value) : "no data"}
        color="violet"
      />
      <Card
        icon={<TrendingUp size={20} />}
        label="Avg per Expense"
        value={formatCurrency(avgExpense)}
        sub="average amount"
        color="amber"
      />
    </div>
  );
}

function Card({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: "indigo" | "emerald" | "violet" | "amber";
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className={`inline-flex p-2 rounded-lg ${colors[color]} mb-3`}>{icon}</div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-xl font-bold text-gray-800 mt-0.5 truncate">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
