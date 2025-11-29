"use client";

import { useState, useEffect, useRef } from "react";
import DashboardPageTitle from "../dashboard-page-title";
import {
  Sparkles,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUp,
  Loader2,
} from "lucide-react";
import {
  BudgetEntry,
  MonthlySnapshot,
  loadBudgetEntries,
  loadMonthlyHistory,
} from "@/lib/budget";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Demo scenarios for quick access
const demoScenarios = [
  {
    question: "What if I spend $100 more on dining out each month?",
    icon: TrendingDown,
  },
  {
    question: "What if I get a part-time job earning $500/month?",
    icon: TrendingUp,
  },
  {
    question: "What if I need to buy a $1200 laptop for school?",
    icon: AlertTriangle,
  },
  {
    question: "What if I reduce my entertainment budget by half?",
    icon: Lightbulb,
  },
];

function formatBudgetContext(
  entries: BudgetEntry[],
  history: MonthlySnapshot[]
): string {
  const incomeEntries = entries.filter((e) => e.type === "income");
  const expenseEntries = entries.filter((e) => e.type === "expense");

  const totalIncome = incomeEntries.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = expenseEntries.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalIncome - totalExpenses;

  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  for (const entry of expenseEntries) {
    const category = entry.category || "Other";
    expensesByCategory[category] = (expensesByCategory[category] || 0) + entry.amount;
  }

  let context = `## Current Monthly Budget Summary
- Total Monthly Income: $${totalIncome.toFixed(2)}
- Total Monthly Expenses: $${totalExpenses.toFixed(2)}
- Monthly Remaining/Savings: $${remaining.toFixed(2)}
- Savings Rate: ${totalIncome > 0 ? ((remaining / totalIncome) * 100).toFixed(1) : 0}%

## Income Sources
${incomeEntries.map((e) => `- ${e.label}: $${e.amount.toFixed(2)} (${e.recurrence}${e.frequency ? `, ${e.frequency}` : ""})`).join("\n")}

## Expense Breakdown by Category
${Object.entries(expensesByCategory)
  .sort((a, b) => b[1] - a[1])
  .map(([cat, amount]) => `- ${cat}: $${amount.toFixed(2)}`)
  .join("\n")}

## Detailed Expenses
${expenseEntries.map((e) => `- ${e.label}: $${e.amount.toFixed(2)} (${e.category || "Uncategorized"}, ${e.recurrence})`).join("\n")}`;

  // Add recent history if available
  if (history.length > 0) {
    const recentHistory = history.slice(-3);
    context += `\n\n## Recent Monthly History (Last ${recentHistory.length} months)
${recentHistory.map((h) => `- ${h.label}: Income $${h.income}, Expenses $${h.expenses}, Net $${h.income - h.expenses}`).join("\n")}`;
  }

  return context;
}

export default function SimulatorPage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [history, setHistory] = useState<MonthlySnapshot[]>([]);
  const responseRef = useRef<HTMLDivElement>(null);

  // Load budget data on mount
  useEffect(() => {
    setEntries(loadBudgetEntries());
    setHistory(loadMonthlyHistory());
  }, []);

  // Auto-scroll to bottom when response updates
  useEffect(() => {
    if (responseRef.current && response) {
      responseRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [response]);

  const handleSubmit = async () => {
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setResponse("");

    try {
      const budgetContext = formatBudgetContext(entries, history);

      const res = await fetch("/api/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, budgetContext }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedText = "";
      const appendResponse = (chunk: string) => {
        let handledAsSSE = false;
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("0:")) {
            handledAsSSE = true;
            try {
              const text = JSON.parse(line.slice(2));
              accumulatedText += text;
            } catch {
              // If parsing fails, fall back to using the raw line
              accumulatedText += line.slice(2);
            }
          }
        }

        if (!handledAsSSE) {
          accumulatedText += chunk;
        }

        setResponse(accumulatedText);
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        appendResponse(chunk);
      }

      const finalChunk = decoder.decode();
      if (finalChunk) {
        appendResponse(finalChunk);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse(
        "Sorry, I encountered an error while analyzing your scenario. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleScenarioClick = (scenarioQuestion: string) => {
    setQuestion(scenarioQuestion);
  };

  const renderFormattedResponse = (text: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="text-ds-gray-1000 mb-2">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mt-6 mb-3 text-ds-gray-1000">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mt-5 mb-2 text-ds-gray-1000">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mt-4 mb-2 text-ds-gray-1000">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-ds-gray-1000 ml-4">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-ds-gray-1000">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-ds-gray-1000">{children}</em>
          ),
          code: ({ children }) => (
            <code className="bg-ds-gray-alpha-200 px-1.5 py-0.5 rounded text-sm font-mono text-ds-gray-1000">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-ds-gray-alpha-200 p-3 rounded-lg overflow-x-auto mb-3">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-ds-gray-1000 underline hover:text-ds-gray-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-ds-gray-alpha-400 pl-4 italic text-ds-gray-900 mb-3">
              {children}
            </blockquote>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <DashboardPageTitle>
        <h2 className="text-lg font-semibold tracking-tight leading-none flex items-center gap-2">
          What-If Simulator
        </h2>
        <p className="text-ds-gray-700 text-sm">
          Ask &quot;what if&quot; questions about your budget and get AI-powered
          insights on how changes would impact your finances.
        </p>
      </DashboardPageTitle>

      <div className="overflow-auto pb-32">
        {/* Response Area */}
        {(response || isLoading) && (
          <section className="p-6" ref={responseRef}>
            <h3 className="text-sm font-semibold text-ds-gray-1000 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ds-gray-700" />
              AI Analysis
              {isLoading && (
                <Loader2 className="h-4 w-4 text-ds-gray-700 animate-spin" />
              )}
            </h3>
            <div className="text-sm leading-relaxed">
              {response ? (
                renderFormattedResponse(response)
              ) : (
                <p className="text-ds-gray-700 italic">Analyzing your scenario...</p>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Fixed Input Area */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
        {/* Floating Suggestion Blobs */}
        <div className="flex gap-2 mb-3 justify-center">
          {demoScenarios.slice(0, 2).map((scenario, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-ds-gray-alpha-400 bg-ds-background-200 shadow-md hover:bg-ds-gray-alpha-100 transition-colors text-sm text-ds-gray-900"
              onClick={() => handleScenarioClick(scenario.question)}
              disabled={isLoading}
            >
              <scenario.icon className="h-4 w-4 shrink-0 text-ds-gray-700" />
              <span className="whitespace-nowrap">{scenario.question}</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="What if I..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="w-full px-6 py-4 pr-16 rounded-full border border-ds-gray-alpha-400 bg-ds-background-200 shadow-lg focus:outline-none focus:ring focus:ring-ds-gray-alpha-500 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={!question.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ds-gray-1000 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ds-gray-900 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-ds-gray-100 animate-spin" />
            ) : (
              <ArrowUp className="h-5 w-5 text-ds-gray-100" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
