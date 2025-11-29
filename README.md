# BudgetX - Student Budget Simulator

A smart budget management app for students built during HackDecouverte hackathon.

## Features

- **Expense Tracking**: Input your monthly income, fixed expenses (rent, tuition), and variable expenses
- **What-If Simulator**: AI-powered scenario simulation to explore financial decisions
- **Stats & Insights**: Visual charts and predictions to understand your spending

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **AI**: Vercel AI SDK + Google Gemini
- **Charts**: Recharts
- **Auth**: Better Auth

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/app/
├── dashboard/
│   ├── page.tsx          # Expense input
│   ├── simulator/        # What-If simulator
│   └── stats/            # Charts & insights
└── page.tsx              # Landing page
```
