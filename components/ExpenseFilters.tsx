"use client";

import { ExpenseFilters, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { Search, X } from "lucide-react";

interface Props {
  filters: ExpenseFilters;
  onChange: (f: ExpenseFilters) => void;
}

export default function ExpenseFiltersBar({ filters, onChange }: Props) {
  const set = (patch: Partial<ExpenseFilters>) => onChange({ ...filters, ...patch });
  const hasActive =
    filters.dateFrom || filters.dateTo || filters.category || filters.search;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search expenses..."
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Date From */}
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set({ dateFrom: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Date To */}
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set({ dateTo: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Category */}
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Category</label>
          <select
            value={filters.category}
            onChange={(e) => set({ category: e.target.value as Category | "" })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {hasActive && (
        <button
          onClick={() => onChange({ dateFrom: "", dateTo: "", category: "", search: "" })}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <X size={13} /> Clear filters
        </button>
      )}
    </div>
  );
}
