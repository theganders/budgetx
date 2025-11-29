"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardPageTitle from "../dashboard-page-title";
import { BarChart3 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import {
  BudgetEntry,
  MonthlySnapshot,
  loadBudgetEntries,
  loadMonthlyHistory,
} from "@/lib/budget";

// Color palette for expense categories
const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#3B82F6",
  Education: "#8B5CF6",
  Food: "#10B981",
  Utilities: "#F97316",
  Transport: "#EC4899",
  Fun: "#06B6D4",
  Primary: "#22C55E",
  Other: "#94A3B8",
};

// Fallback colors for categories not in the palette
const FALLBACK_COLORS = [
  "#6366F1",
  "#14B8A6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

function getCategoryColor(category: string, index: number): string {
  return (
    CATEGORY_COLORS[category] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  );
}

const monthlyTrendChartConfig = {
  spent: {
    label: "Spent",
    color: "var(--chart-1)",
  },
  budget: {
    label: "Budget",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const savingsChartConfig = {
  savings: {
    label: "Savings",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [history, setHistory] = useState<MonthlySnapshot[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedEntries = loadBudgetEntries();
    const storedHistory = loadMonthlyHistory();
    setEntries(storedEntries);
    setHistory(storedHistory);
    setHydrated(true);
  }, []);

  // Calculate totals from entries
  const { totalIncome, totalExpenses, expensesByCategory } = useMemo(() => {
    const income = entries
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    const expenses = entries
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);

    // Group expenses by category
    const byCategory = entries
      .filter((e) => e.type === "expense")
      .reduce(
        (acc, entry) => {
          const cat = entry.category || "Other";
          acc[cat] = (acc[cat] || 0) + entry.amount;
          return acc;
        },
        {} as Record<string, number>
      );

    return { totalIncome: income, totalExpenses: expenses, expensesByCategory: byCategory };
  }, [entries]);

  // Build expense breakdown for pie chart
  const expenseBreakdown = useMemo(() => {
    const categories = Object.entries(expensesByCategory)
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        color: getCategoryColor(category, index),
      }))
      .sort((a, b) => b.amount - a.amount);

    return categories;
  }, [expensesByCategory, totalExpenses]);

  // Chart config for pie chart
  const expenseChartConfig = useMemo(() => {
    return expenseBreakdown.reduce((acc, item) => {
      acc[item.category] = {
        label: item.category,
        color: item.color,
      };
      return acc;
    }, {} as ChartConfig);
  }, [expenseBreakdown]);

  // Use historical data for monthly trend
  const monthlyTrend = useMemo(() => {
    return history.map((snapshot) => ({
      month: snapshot.label,
      spent: snapshot.expenses,
      budget: snapshot.income,
    }));
  }, [history]);

  // Calculate savings per month from historical data
  const monthlySavings = useMemo(() => {
    return history.map((snapshot) => {
      const savings = snapshot.income - snapshot.expenses;
      return {
        month: snapshot.label,
        savings,
        savingsRate: snapshot.income > 0 ? (savings / snapshot.income) * 100 : 0,
      };
    });
  }, [history]);

  // Derived stats
  const formattedMonthlyIncome = totalIncome.toLocaleString();
  const formattedTotalExpenses = totalExpenses.toLocaleString();
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  const averageSavings = useMemo(() => {
    if (monthlySavings.length === 0) return 0;
    return Math.round(
      monthlySavings.reduce((sum, entry) => sum + entry.savings, 0) /
        monthlySavings.length
    );
  }, [monthlySavings]);

  const bestSavingsMonth = useMemo(() => {
    if (monthlySavings.length === 0)
      return { month: "—", savings: 0, savingsRate: 0 };
    return monthlySavings.reduce(
      (best, entry) => (entry.savings > best.savings ? entry : best),
      monthlySavings[0]
    );
  }, [monthlySavings]);

  const lowestSavingsMonth = useMemo(() => {
    if (monthlySavings.length === 0)
      return { month: "—", savings: 0, savingsRate: 0 };
    return monthlySavings.reduce(
      (worst, entry) => (entry.savings < worst.savings ? entry : worst),
      monthlySavings[0]
    );
  }, [monthlySavings]);

  const latestMonth = monthlyTrend[monthlyTrend.length - 1] || {
    month: "—",
    spent: 0,
    budget: 0,
  };

  // Show loading state before hydration
  if (!hydrated) {
    return (
      <div className="flex h-full flex-col">
        <DashboardPageTitle>
          <h2 className="flex items-center gap-2 text-lg leading-none font-semibold tracking-tight">
            <BarChart3 className="text-ds-gray-700 h-5 w-5" />
            Stats & Insights
          </h2>
        </DashboardPageTitle>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-ds-gray-700 text-sm">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <DashboardPageTitle>
        <h2 className="flex items-center gap-2 text-lg leading-none font-semibold tracking-tight">
          <BarChart3 className="text-ds-gray-700 h-5 w-5" />
          Stats & Insights
        </h2>
      </DashboardPageTitle>

      <div className="overflow-auto">
        <div className="border-ds-gray-alpha-400 grid grid-cols-12 border-b">
          {/* Summary Grid */}
          <section className="border-ds-gray-alpha-400 col-span-3 flex flex-col border-r p-6">
            <div className="">
              <p className="text-ds-gray-700 mb-1 text-xs">Total Expenses</p>
              <p className="text-ds-gray-1000 font-mono text-3xl font-bold">
                +{"$" + formattedMonthlyIncome}
              </p>
              <p className="text-ds-gray-800 font-mono text-3xl font-bold">
                -${formattedTotalExpenses}
              </p>
            </div>
            <div className="mt-4 border-t py-2">
              <p className="text-ds-gray-1000 text-3xl font-bold font-mono">
                <span className="text-ds-gray-800">{"="}</span>$
                {savings.toLocaleString()}
              </p>
              <p className="text-ds-gray-1000 text-3xl font-bold font-mono">
                <span className="text-ds-gray-800">{"="}</span>$
                {savingsRate}% saved 
              </p>
            </div>
          </section>

          {/* Expense Breakdown */}
          <section className="col-span-9 p-6">
            <h3 className="text-ds-gray-1000 mb-1 text-sm font-semibold">
              Expense Breakdown
            </h3>
            <p className="text-ds-gray-700 mb-4 text-xs">
              Where your money goes each month
            </p>

            {expenseBreakdown.length === 0 ? (
              <p className="text-ds-gray-700 text-sm">
                No expense data yet. Add some expenses to see the breakdown.
              </p>
            ) : (
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="relative w-full lg:max-w-sm">
                  <ChartContainer
                    className="aspect-square min-h-[260px] w-full"
                    config={expenseChartConfig}
                  >
                    <PieChart>
                      <Pie
                        data={expenseBreakdown}
                        dataKey="amount"
                        nameKey="category"
                        innerRadius={70}
                        outerRadius={100}
                        strokeWidth={6}
                      >
                        {expenseBreakdown.map((item) => (
                          <Cell key={item.category} fill={item.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent nameKey="category" />}
                      />
                    </PieChart>
                  </ChartContainer>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-ds-gray-1000 text-xl font-bold">
                        ${totalExpenses}
                      </p>
                      <p className="text-ds-gray-700 text-xs">Total</p>
                    </div>
                  </div>
                </div>

                <div className="grid flex-1 gap-2">
                  {expenseBreakdown.map((item) => (
                    <div
                      key={item.category}
                      className="border-ds-gray-alpha-300 flex items-center justify-between rounded border p-3"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-ds-gray-900 text-sm">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-ds-gray-1000 text-sm font-medium">
                          ${item.amount}
                        </span>
                        <span className="text-ds-gray-700 ml-2 text-xs">
                          ({item.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="border-ds-gray-alpha-400 grid grid-cols-2">
          {/* Monthly Trend */}
          <section className="border-ds-gray-alpha-400 border-r p-6">
            <h3 className="text-ds-gray-1000 mb-1 text-sm font-semibold">
              Monthly Spending Trend
            </h3>
            <p className="text-ds-gray-700 mb-4 text-xs">
              Your spending over the past months
            </p>

            <ChartContainer
              className="mt-2 min-h-[280px] w-full"
              config={monthlyTrendChartConfig}
            >
              <LineChart data={monthlyTrend} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent labelKey="month" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="spent"
                  type="monotone"
                  stroke="var(--color-spent)"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  dataKey="budget"
                  type="monotone"
                  stroke="var(--color-budget)"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2, r: 3 }}
                  strokeDasharray="6 4"
                />
              </LineChart>
            </ChartContainer>

            <div className="text-ds-gray-800 mt-4 text-xs sm:text-sm">
              Latest month ({latestMonth.month}): $
              {latestMonth.spent.toLocaleString()} spent of $
              {latestMonth.budget.toLocaleString()},{" "}
              {latestMonth.budget > 0
                ? Math.round((latestMonth.spent / latestMonth.budget) * 100)
                : 0}
              % of budget.
            </div>
          </section>

          {/* Savings Trend */}
          <section className="border-ds-gray-alpha-400 p-6">
            <h3 className="text-ds-gray-1000 mb-1 text-sm font-semibold">
              Monthly Savings
            </h3>
            <p className="text-ds-gray-700 mb-4 text-xs">
              How much you keep after covering expenses
            </p>

            <div className="flex flex-col gap-6">
              <ChartContainer
                className="min-h-[260px] w-full"
                config={savingsChartConfig}
              >
                <AreaChart data={monthlySavings} accessibilityLayer>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent labelKey="month" />}
                  />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stroke="var(--color-savings)"
                    strokeWidth={2}
                    fill="var(--color-savings)"
                    fillOpacity={0.18}
                  />
                </AreaChart>
              </ChartContainer>

              <div className="border-ds-gray-alpha-300 flex flex-row justify-between gap-4 rounded border p-4 text-sm">
                <div>
                  <p className="text-ds-gray-600 text-xs tracking-wide uppercase">
                    Average per month
                  </p>
                  <p className="text-ds-gray-1000 text-2xl font-semibold">
                    ${averageSavings.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-ds-gray-600 text-xs tracking-wide uppercase">
                    Best month
                  </p>
                  <p className="text-ds-gray-1000 text-base font-semibold">
                    {bestSavingsMonth.month}: $
                    {bestSavingsMonth.savings.toLocaleString()}
                  </p>
                  <p className="text-ds-gray-700 text-xs">
                    {bestSavingsMonth.savingsRate.toFixed(1)}% of income saved
                  </p>
                </div>
                <div>
                  <p className="text-ds-gray-600 text-xs tracking-wide uppercase">
                    Tightest month
                  </p>
                  <p className="text-ds-gray-1000 text-base font-semibold">
                    {lowestSavingsMonth.month}: $
                    {lowestSavingsMonth.savings.toLocaleString()}
                  </p>
                  <p className="text-ds-gray-700 text-xs">
                    {lowestSavingsMonth.savingsRate.toFixed(1)}% of income saved
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
