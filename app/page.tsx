"use client";

import { useState, useMemo } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { Expense, ExpenseFilters } from "@/lib/types";
import { filterExpenses } from "@/lib/utils";
import { exportToCSV } from "@/lib/storage";
import SummaryCards from "@/components/SummaryCards";
import Charts from "@/components/Charts";
import ExpenseFiltersBar from "@/components/ExpenseFilters";
import ExpenseList from "@/components/ExpenseList";
import ExpenseForm from "@/components/ExpenseForm";
import DeleteConfirm from "@/components/DeleteConfirm";
import { Plus, Download, BarChart2, List } from "lucide-react";

const EMPTY_FILTERS: ExpenseFilters = {
  dateFrom: "",
  dateTo: "",
  category: "",
  search: "",
};

type Tab = "dashboard" | "expenses";

export default function Home() {
  const { expenses, loaded, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [filters, setFilters] = useState<ExpenseFilters>(EMPTY_FILTERS);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => filterExpenses(expenses, filters), [expenses, filters]);

  function handleAdd() {
    setEditTarget(null);
    setShowForm(true);
  }

  function handleEdit(e: Expense) {
    setEditTarget(e);
    setShowForm(true);
  }

  function handleFormSubmit(data: Omit<Expense, "id" | "createdAt">) {
    if (editTarget) {
      updateExpense(editTarget.id, data);
    } else {
      addExpense(data);
    }
    setShowForm(false);
    setEditTarget(null);
  }

  function handleDeleteConfirm() {
    if (deleteId) deleteExpense(deleteId);
    setDeleteId(null);
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <span className="text-lg">💰</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">Expense Tracker</h1>
              <p className="text-xs text-gray-500">Personal finance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToCSV(expenses)}
              disabled={expenses.length === 0}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={15} /> Export CSV
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={16} /> Add Expense
            </button>
          </div>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1">
            {(["dashboard", "expenses"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors capitalize ${
                  tab === t
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "dashboard" ? <BarChart2 size={15} /> : <List size={15} />}
                {t}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {tab === "dashboard" && (
          <>
            <SummaryCards expenses={expenses} />
            <Charts expenses={expenses} />
            {/* Recent expenses */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-700">Recent Expenses</h2>
                <button
                  onClick={() => setTab("expenses")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all →
                </button>
              </div>
              <ExpenseList
                expenses={expenses.slice(0, 5)}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            </div>
          </>
        )}

        {tab === "expenses" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-700">
                  All Expenses
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    ({filtered.length} of {expenses.length})
                  </span>
                </h2>
              </div>
              <button
                onClick={() => exportToCSV(filtered)}
                disabled={filtered.length === 0}
                className="sm:hidden flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-40"
              >
                <Download size={14} /> Export
              </button>
            </div>
            <ExpenseFiltersBar filters={filters} onChange={setFilters} />
            <ExpenseList
              expenses={filtered}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
            />
          </>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <ExpenseForm
          initial={editTarget}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}
      {deleteId && (
        <DeleteConfirm
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
