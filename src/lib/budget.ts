export type EntryType = "income" | "expense";
export type RecurrenceType = "one-time" | "recurring";
export type FrequencyType = "monthly" | "weekly" | "yearly";

export type BudgetEntry = {
  id: string;
  type: EntryType;
  label: string;
  amount: number;
  category?: string;
  recurrence: RecurrenceType;
  frequency?: FrequencyType;
  notes?: string;
};

// Historical monthly snapshot for trends
export type MonthlySnapshot = {
  month: string; // e.g. "2025-11", "2025-10"
  label: string; // e.g. "Nov", "Oct"
  income: number;
  expenses: number;
  expensesByCategory: Record<string, number>;
};

const STORAGE_KEY = "budgetx.entries.v1";
const HISTORY_STORAGE_KEY = "budgetx.history.v1";

export const initialEntries: BudgetEntry[] = [
  // Income sources
  {
    id: "income-1",
    type: "income",
    label: "Part-time Job",
    amount: 1400,
    category: "Primary",
    recurrence: "recurring",
    frequency: "monthly",
  },
  {
    id: "income-2",
    type: "income",
    label: "Freelance Gig",
    amount: 450,
    category: "Side Hustle",
    recurrence: "recurring",
    frequency: "monthly",
  },
  {
    id: "income-3",
    type: "income",
    label: "Tutoring",
    amount: 200,
    category: "Side Hustle",
    recurrence: "recurring",
    frequency: "monthly",
  },
  // Fixed expenses
  {
    id: "expense-1",
    type: "expense",
    label: "Rent",
    amount: 750,
    category: "Housing",
    recurrence: "recurring",
    frequency: "monthly",
  },
  {
    id: "expense-2",
    type: "expense",
    label: "Tuition Payment",
    amount: 380,
    category: "Education",
    recurrence: "recurring",
    frequency: "monthly",
  },
  {
    id: "expense-3",
    type: "expense",
    label: "Phone Bill",
    amount: 42,
    category: "Utilities",
    recurrence: "recurring",
    frequency: "monthly",
  },
  {
    id: "expense-4",
    type: "expense",
    label: "Internet",
    amount: 38,
    category: "Utilities",
    recurrence: "recurring",
    frequency: "monthly",
  },
  // Variable expenses
  {
    id: "expense-5",
    type: "expense",
    label: "Groceries",
    amount: 185,
    category: "Food",
    recurrence: "recurring",
    frequency: "monthly",
  },
  {
    id: "expense-6",
    type: "expense",
    label: "Dining Out",
    amount: 95,
    category: "Food",
    recurrence: "recurring",
    frequency: "monthly",
  },
  {
    id: "expense-7",
    type: "expense",
    label: "Coffee Shops",
    amount: 35,
    category: "Food",
    recurrence: "recurring",
    frequency: "monthly",
  },
  {
    id: "expense-8",
    type: "expense",
    label: "Bus Pass",
    amount: 55,
    category: "Transport",
    recurrence: "recurring",
    frequency: "monthly",
  },
  {
    id: "expense-9",
    type: "expense",
    label: "Streaming Services",
    amount: 28,
    category: "Fun",
    recurrence: "recurring",
    frequency: "monthly",
  },
  {
    id: "expense-10",
    type: "expense",
    label: "Going Out",
    amount: 60,
    category: "Fun",
    recurrence: "recurring",
    frequency: "monthly",
  },
  // One-time expenses (recent purchases)
  {
    id: "expense-11",
    type: "expense",
    label: "Textbooks",
    amount: 120,
    category: "Education",
    recurrence: "one-time",
    notes: "Fall semester books",
  },
  {
    id: "expense-12",
    type: "expense",
    label: "New Headphones",
    amount: 65,
    category: "Fun",
    recurrence: "one-time",
  },
];

// Realistic historical data with month-to-month variation
export const initialHistory: MonthlySnapshot[] = [
  {
    month: "2025-06",
    label: "Jun",
    income: 1850,
    expenses: 1420,
    expensesByCategory: {
      Housing: 750,
      Education: 280,
      Food: 195,
      Utilities: 75,
      Transport: 45,
      Fun: 75,
    },
  },
  {
    month: "2025-07",
    label: "Jul",
    income: 2100,
    expenses: 1680,
    expensesByCategory: {
      Housing: 750,
      Education: 380,
      Food: 280,
      Utilities: 80,
      Transport: 60,
      Fun: 130,
    },
  },
  {
    month: "2025-08",
    label: "Aug",
    income: 1950,
    expenses: 1890,
    expensesByCategory: {
      Housing: 750,
      Education: 520, // Back to school expenses
      Food: 310,
      Utilities: 82,
      Transport: 68,
      Fun: 160,
    },
  },
  {
    month: "2025-09",
    label: "Sep",
    income: 2050,
    expenses: 1720,
    expensesByCategory: {
      Housing: 750,
      Education: 400,
      Food: 290,
      Utilities: 78,
      Transport: 52,
      Fun: 150,
    },
  },
  {
    month: "2025-10",
    label: "Oct",
    income: 2000,
    expenses: 1580,
    expensesByCategory: {
      Housing: 750,
      Education: 380,
      Food: 245,
      Utilities: 80,
      Transport: 55,
      Fun: 70,
    },
  },
  {
    month: "2025-11",
    label: "Nov",
    income: 2050,
    expenses: 1750,
    expensesByCategory: {
      Housing: 750,
      Education: 500, // Exam prep materials
      Food: 270,
      Utilities: 85,
      Transport: 60,
      Fun: 85,
    },
  },
];

const isBrowser = () => typeof window !== "undefined";

export function loadBudgetEntries(): BudgetEntry[] {
  if (!isBrowser()) {
    return initialEntries;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialEntries;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return initialEntries;
    }

    const normalized = parsed
      .map((entry) => normalizeEntry(entry))
      .filter((entry): entry is BudgetEntry => entry !== null);

    return normalized.length ? normalized : initialEntries;
  } catch (error) {
    console.warn("Failed to load budget entries from storage", error);
    return initialEntries;
  }
}

export function saveBudgetEntries(entries: BudgetEntry[]): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn("Failed to persist budget entries to storage", error);
  }
}

export function clearBudgetEntriesStorage(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(HISTORY_STORAGE_KEY);
}

// History storage functions
export function loadMonthlyHistory(): MonthlySnapshot[] {
  if (!isBrowser()) {
    return initialHistory;
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      return initialHistory;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return initialHistory;
    }

    const normalized = parsed
      .map((snapshot) => normalizeSnapshot(snapshot))
      .filter((snapshot): snapshot is MonthlySnapshot => snapshot !== null);

    return normalized.length ? normalized : initialHistory;
  } catch (error) {
    console.warn("Failed to load monthly history from storage", error);
    return initialHistory;
  }
}

export function saveMonthlyHistory(history: MonthlySnapshot[]): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn("Failed to persist monthly history to storage", error);
  }
}

function normalizeSnapshot(snapshot: unknown): MonthlySnapshot | null {
  if (!snapshot || typeof snapshot !== "object") {
    return null;
  }

  const candidate = snapshot as Partial<MonthlySnapshot>;

  if (typeof candidate.month !== "string") return null;
  if (typeof candidate.label !== "string") return null;
  if (typeof candidate.income !== "number") return null;
  if (typeof candidate.expenses !== "number") return null;
  if (
    !candidate.expensesByCategory ||
    typeof candidate.expensesByCategory !== "object"
  )
    return null;

  return {
    month: candidate.month,
    label: candidate.label,
    income: candidate.income,
    expenses: candidate.expenses,
    expensesByCategory: candidate.expensesByCategory,
  };
}

function normalizeEntry(entry: unknown): BudgetEntry | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const candidate = entry as Partial<BudgetEntry> & {
    amount?: number | string;
  };

  if (typeof candidate.id !== "string") {
    return null;
  }

  if (candidate.type !== "income" && candidate.type !== "expense") {
    return null;
  }

  if (
    typeof candidate.label !== "string" ||
    candidate.label.trim().length === 0
  ) {
    return null;
  }

  const amountValue =
    typeof candidate.amount === "number"
      ? candidate.amount
      : Number(candidate.amount);
  if (!Number.isFinite(amountValue)) {
    return null;
  }

  const recurrence =
    candidate.recurrence === "one-time" ? "one-time" : "recurring";
  const frequency =
    recurrence === "recurring" &&
    (candidate.frequency === "weekly" ||
      candidate.frequency === "monthly" ||
      candidate.frequency === "yearly")
      ? candidate.frequency
      : undefined;

  return {
    id: candidate.id,
    type: candidate.type,
    label: candidate.label,
    amount: amountValue,
    category: candidate.category || undefined,
    recurrence,
    frequency,
    notes: candidate.notes || undefined,
  };
}
