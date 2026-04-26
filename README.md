# Expense Tracker AI

A modern personal finance tracker built with Next.js 14.

**Live app:** https://expense-tracker-ai-flax.vercel.app

## Features

**Expense Management**
- Add, edit, and delete expenses with amount, category, date, and description
- 6 categories: Food, Transportation, Entertainment, Shopping, Bills, Other
- Search and filter by date range, category, or keyword

**Dashboard**
- Summary cards: total spending, monthly spending, top category, average per expense
- Monthly bar chart (last 6 months) and category donut chart
- Recent expenses at a glance

**Export Hub** (🚀)
- 5 export templates: Tax Report, Monthly Summary, Category Analysis, Budget Review, Year in Review
- 8 cloud destinations: Email, Google Sheets, Notion, Dropbox, OneDrive, Slack, Zapier, Airtable
- Recurring auto-export scheduler (daily / weekly / monthly)
- Export history with status tracking and one-click re-export
- Shareable report links with QR code generation and expiry settings

## Tech Stack

- Next.js 14 (App Router) · TypeScript · Tailwind CSS
- Recharts · jsPDF · qrcode · lucide-react

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.
