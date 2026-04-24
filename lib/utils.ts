import { Expense, ExpenseFilters, Category } from "./types";
import { CATEGORY_COLORS } from "./constants";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFilters
): Expense[] {
  return expenses.filter((e) => {
    if (filters.dateFrom && e.date < filters.dateFrom) return false;
    if (filters.dateTo && e.date > filters.dateTo) return false;
    if (filters.category && e.category !== filters.category) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !e.description.toLowerCase().includes(q) &&
        !e.category.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export function getMonthlyTotal(expenses: Expense[]): number {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return expenses
    .filter((e) => e.date.startsWith(month))
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getCategoryTotals(
  expenses: Expense[]
): { name: Category; value: number; color: string }[] {
  const totals: Partial<Record<Category, number>> = {};
  for (const e of expenses) {
    totals[e.category] = (totals[e.category] ?? 0) + e.amount;
  }
  return Object.entries(totals)
    .map(([name, value]) => ({
      name: name as Category,
      value: value as number,
      color: CATEGORY_COLORS[name as Category],
    }))
    .sort((a, b) => b.value - a.value);
}

export function getLast6MonthsData(
  expenses: Expense[]
): { month: string; total: number }[] {
  const result: { month: string; total: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    const total = expenses
      .filter((e) => e.date.startsWith(key))
      .reduce((sum, e) => sum + e.amount, 0);
    result.push({ month: label, total });
  }
  return result;
}
