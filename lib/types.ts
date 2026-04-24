export type Category =
  | "Food"
  | "Transportation"
  | "Entertainment"
  | "Shopping"
  | "Bills"
  | "Other";

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string;
}

export interface ExpenseFilters {
  dateFrom: string;
  dateTo: string;
  category: Category | "";
  search: string;
}
