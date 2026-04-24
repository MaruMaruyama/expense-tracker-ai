# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # Type check without building
```

## Architecture

**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Recharts · lucide-react

**Data layer:** All expense data is persisted in `localStorage` (no backend). The `useExpenses` hook (`hooks/useExpenses.ts`) owns all CRUD state and syncs to storage on every change. `lib/storage.ts` handles serialization and CSV export.

**Key data flow:**
1. `app/page.tsx` (single-page app) holds all UI state: active tab, modal visibility, filter state.
2. It calls `useExpenses` for data mutations and passes subsets of data down to pure display components.
3. Filtering/aggregation logic lives in `lib/utils.ts` — never inside components.

**Component responsibilities:**
- `SummaryCards` — four KPI cards (total, monthly, top category, avg)
- `Charts` — bar chart (6-month trend) + pie chart (by category) via Recharts
- `ExpenseList` — sortable table with hover-revealed edit/delete actions
- `ExpenseFiltersBar` — search + date range + category filter
- `ExpenseForm` — modal form (add and edit), client-side validated
- `DeleteConfirm` — confirmation modal before deletion

**Types & constants:**
- `lib/types.ts` — `Expense`, `Category`, `ExpenseFilters` interfaces
- `lib/constants.ts` — `CATEGORIES`, `CATEGORY_COLORS`, `CATEGORY_ICONS`, `STORAGE_KEY`
