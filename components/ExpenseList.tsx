"use client";

import { Expense } from "@/lib/types";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  expenses: Expense[];
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
        <p className="text-4xl mb-3">💸</p>
        <p className="text-gray-500 font-medium">No expenses found</p>
        <p className="text-gray-400 text-sm mt-1">Add your first expense or adjust filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Date</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Category</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Description</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Amount</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {expenses.map((e) => (
              <Row key={e.id} expense={e} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({
  expense: e,
  onEdit,
  onDelete,
}: {
  expense: Expense;
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}) {
  const color = CATEGORY_COLORS[e.category];
  const icon = CATEGORY_ICONS[e.category];

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
        {new Date(e.date + "T00:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>
      <td className="px-5 py-3.5">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon} {e.category}
        </span>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-700 max-w-[240px] truncate">{e.description}</td>
      <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 text-right whitespace-nowrap">
        {formatCurrency(e.amount)}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          <button
            onClick={() => onEdit(e)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(e.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
