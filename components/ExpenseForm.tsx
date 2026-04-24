"use client";

import { useState, useEffect } from "react";
import { Expense, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { X } from "lucide-react";

interface Props {
  onSubmit: (data: Omit<Expense, "id" | "createdAt">) => void;
  onCancel: () => void;
  initial?: Expense | null;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ onSubmit, onCancel, initial }: Props) {
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "Food");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ?? today());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setAmount(String(initial.amount));
      setCategory(initial.category);
      setDescription(initial.description);
      setDate(initial.date);
    }
  }, [initial]);

  function validate() {
    const errs: Record<string, string> = {};
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) errs.amount = "Enter a valid positive amount";
    if (!description.trim()) errs.description = "Description is required";
    if (!date) errs.date = "Date is required";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({ amount: parseFloat(parseFloat(amount).toFixed(2)), category, description: description.trim(), date });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {initial ? "Edit Expense" : "Add Expense"}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setErrors((p) => ({ ...p, amount: "" })); }}
              className={`w-full px-4 py-2.5 rounded-lg border text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.amount ? "border-red-400 bg-red-50" : "border-gray-300"}`}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: "" })); }}
              className={`w-full px-4 py-2.5 rounded-lg border text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.description ? "border-red-400 bg-red-50" : "border-gray-300"}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              max={today()}
              onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: "" })); }}
              className={`w-full px-4 py-2.5 rounded-lg border text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.date ? "border-red-400 bg-red-50" : "border-gray-300"}`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              {initial ? "Save Changes" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
