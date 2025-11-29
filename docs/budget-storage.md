# Budget Entry Persistence

This doc explains how the dashboard demo persists income and expense entries entirely on the client using `localStorage`. The goal is to keep the experience lightweight (no auth/backend) while still giving a DB-like API for querying and mutating entries.

## Module layout

All shared budget types, demo data, and storage helpers live in `src/lib/budget.ts`:

- **Types/enums**: `EntryType`, `RecurrenceType`, `FrequencyType`, and `BudgetEntry` describe every entry the dashboard works with.
- **Demo seeds**: `initialEntries` contains the original monthly income and expenses used to pre-populate the dashboard for first-time visitors.
- **Storage helpers**: `loadBudgetEntries`, `saveBudgetEntries`, and `clearBudgetEntriesStorage` handle all access to `localStorage` under the key `budgetx.entries.v1`.

```ts
// simplified example
type BudgetEntry = {
  id: string;
  type: "income" | "expense";
  label: string;
  amount: number;
  category?: string;
  recurrence: "recurring" | "one-time";
  frequency?: "monthly" | "weekly" | "yearly";
  notes?: string;
};
```

The helpers guard against SSR usage (they no-op when `window` is undefined) and normalize data pulled from storage so older payloads do not break the UI.

## Dashboard integration

`src/app/dashboard/page.tsx` imports the shared helpers and wires them into its React state lifecycle:

1. **Hydration** – On mount, `loadBudgetEntries()` is called inside a `useEffect` and the result populates the `entries` state. A `hydrated` flag ensures downstream logic only persists once the initial load is complete.
2. **Persistence** – A second `useEffect` watches `[entries, hydrated]`. Whenever entries change (via add/edit/delete), the effect calls `saveBudgetEntries(entries)` to write the array back to `localStorage`.
3. **Queries** – All income/expense filtering and totals remain simple `Array.filter`/`Array.reduce` operations against the in-memory `entries` array; no server round-trips are required.

Because the storage interface is abstracted, the rest of the page (dialog form, tables, totals) does not need to know whether entries come from demo data or persisted data.

## Resetting / versioning

- To clear stored data, call `clearBudgetEntriesStorage()` (e.g., from the browser console or a future dev-only button) and reload the page—`initialEntries` will seed the state again.
- If the entry schema changes significantly, bump `STORAGE_KEY` (for example, `budgetx.entries.v2`). Older payloads will be ignored and the new demo data will take over automatically.

## Extending the storage layer

If the demo ever needs more advanced querying (indexes, transactions, multi-table relationships), swap the helper implementations for IndexedDB/Dexie while keeping the same `load`/`save` API. The dashboard page can continue to treat the helpers as its persistence boundary, minimizing refactors when the storage backend evolves.
