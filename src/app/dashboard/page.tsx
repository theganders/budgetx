"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardPageTitle from "./dashboard-page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  BudgetEntry,
  EntryType,
  FrequencyType,
  RecurrenceType,
  loadBudgetEntries,
  saveBudgetEntries,
} from "@/lib/budget";
import { Camera, Pencil, Plus, Trash2 } from "lucide-react";
import { ReceiptUploadDialog } from "@/components/ui/receipt-upload-dialog";

type EntryFormState = {
  type: EntryType;
  label: string;
  amount: string;
  category: string;
  recurrence: RecurrenceType;
  frequency: FrequencyType;
  notes: string;
};

const makeDefaultFormState = (type: EntryType = "expense"): EntryFormState => ({
  type,
  label: "",
  amount: "",
  category: "",
  recurrence: "recurring",
  frequency: "monthly",
  notes: "",
});

const formatCurrency = (value: number) => value.toFixed(2);
const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const recurrenceLabel = (entry: BudgetEntry) =>
  entry.recurrence === "recurring"
    ? `Recurring${entry.frequency ? ` · ${capitalize(entry.frequency)}` : ""}`
    : "One-time";

export default function DashboardPage() {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [formState, setFormState] = useState<EntryFormState>(() =>
    makeDefaultFormState()
  );

  useEffect(() => {
    const storedEntries = loadBudgetEntries();
    setEntries(storedEntries);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveBudgetEntries(entries);
  }, [entries, hydrated]);

  const incomeEntries = useMemo(
    () => entries.filter((entry) => entry.type === "income"),
    [entries]
  );
  const expenseEntries = useMemo(
    () => entries.filter((entry) => entry.type === "expense"),
    [entries]
  );

  const totalIncome = useMemo(
    () => incomeEntries.reduce((sum, entry) => sum + entry.amount, 0),
    [incomeEntries]
  );
  const totalExpenses = useMemo(
    () => expenseEntries.reduce((sum, entry) => sum + entry.amount, 0),
    [expenseEntries]
  );
  const remaining = totalIncome - totalExpenses;

  const isFormValid =
    formState.label.trim().length > 0 &&
    formState.amount.trim().length > 0 &&
    !Number.isNaN(parseFloat(formState.amount)) &&
    parseFloat(formState.amount) > 0;

  const resetForm = (type: EntryType = "expense") => {
    setFormState(makeDefaultFormState(type));
    setEditingEntryId(null);
  };

  const openForNew = (type: EntryType) => {
    resetForm(type);
    setDialogOpen(true);
  };

  const openForEdit = (entry: BudgetEntry) => {
    setEditingEntryId(entry.id);
    setFormState({
      type: entry.type,
      label: entry.label,
      amount: entry.amount.toString(),
      category: entry.category ?? "",
      recurrence: entry.recurrence,
      frequency: entry.frequency ?? "monthly",
      notes: entry.notes ?? "",
    });
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleSaveEntry = () => {
    if (!isFormValid) return;

    const parsedAmount = parseFloat(formState.amount);
    const entryId = editingEntryId ?? `entry-${Date.now()}`;

    const nextEntry: BudgetEntry = {
      id: entryId,
      type: formState.type,
      label: formState.label.trim(),
      amount: parsedAmount,
      category: formState.category.trim() || undefined,
      recurrence: formState.recurrence,
      frequency:
        formState.recurrence === "recurring" ? formState.frequency : undefined,
      notes: formState.notes.trim() || undefined,
    };

    setEntries((prev) =>
      editingEntryId
        ? prev.map((entry) => (entry.id === editingEntryId ? nextEntry : entry))
        : [...prev, nextEntry]
    );

    handleDialogOpenChange(false);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    if (editingEntryId === id) {
      handleDialogOpenChange(false);
    }
  };

  const handleReceiptExpenseAdd = (data: {
    label: string;
    amount: number;
    category: string;
    recurrence: RecurrenceType;
    frequency?: FrequencyType;
    notes?: string;
  }) => {
    const newEntry: BudgetEntry = {
      id: `receipt-${Date.now()}`,
      type: "expense",
      label: data.label,
      amount: data.amount,
      category: data.category || undefined,
      recurrence: data.recurrence,
      frequency: data.recurrence === "recurring" ? data.frequency : undefined,
      notes: data.notes,
    };

    setEntries((prev) => [...prev, newEntry]);
  };

  const renderEntryTable = (list: BudgetEntry[], emptyLabel: string) => {
    if (list.length === 0) {
      return <p className="text-ds-gray-700 text-xs">{emptyLabel}</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent!">
            <TableHead>Label</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Recurrence</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((entry) => (
            <TableRow
              key={entry.id}
              className="border-b-0 hover:bg-transparent!"
            >
              <TableCell className="text-ds-gray-1000 font-medium">
                {entry.label}
              </TableCell>
              <TableCell className="text-ds-gray-700">
                {entry.category ?? "—"}
              </TableCell>
              <TableCell className="text-ds-gray-700">
                {recurrenceLabel(entry)}
              </TableCell>
              <TableCell className="text-ds-gray-1000 text-right font-semibold">
                ${formatCurrency(entry.amount)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openForEdit(entry)}
                    aria-label="Edit entry"
                  >
                    <Pencil className="text-ds-gray-700 h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeEntry(entry.id)}
                    aria-label="Delete entry"
                  >
                    <Trash2 className="text-ds-gray-700 h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <DashboardPageTitle>
        <div>
          <h2 className="text-lg leading-none font-semibold tracking-tight">
            Expense Tracking
          </h2>
          <p className="text-ds-gray-700 text-sm">
            Track recurring and one-time entries in a single view.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openForNew("income")}
          >
            <Plus className="mr-2 h-4 w-4" /> Add income
          </Button>
          <Button size="sm" onClick={() => openForNew("expense")}>
            <Plus className="mr-2 h-4 w-4" /> Add expense
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReceiptDialogOpen(true)}
          >
            <Camera className="mr-2 h-4 w-4" /> Scan Receipt
          </Button>
        </div>
      </DashboardPageTitle>

      <div className="overflow-auto">
        {/* Remaining Budget */}
        <section className="border-ds-gray-alpha-400 border-b p-6">
          <p className="text-ds-gray-800 mb-1 text-sm">Remaining Budget</p>
          <p className="text-ds-gray-1000 text-4xl font-bold tracking-tight">
            ${formatCurrency(remaining)}
          </p>
          <p className="text-ds-gray-700 mt-1 text-sm">
            Income: ${formatCurrency(totalIncome)} | Expenses: $
            {formatCurrency(totalExpenses)}
          </p>
        </section>

        <div className="border-ds-gray-alpha-400 grid grid-cols-2">
          {/* Income Section */}
          <section className="border-ds-gray-alpha-400 border-r p-6">
            <div className="mb-3">
              <h3 className="text-ds-gray-1000 font-semibold">Income</h3>
              <p className="text-ds-gray-700 text-sm">
                All income sources (Total: ${formatCurrency(totalIncome)})
              </p>
            </div>
            <div className="overflow-auto">
              {renderEntryTable(incomeEntries, "No income entries yet.")}
            </div>
          </section>

          {/* Expenses Section */}
          <section className="p-6">
            <div className="mb-3">
              <h3 className="text-ds-gray-1000 font-semibold">
                Expenses
              </h3>
              <p className="text-ds-gray-700 text-sm">
                All expenses (Total: ${formatCurrency(totalExpenses)})
              </p>
            </div>
            {renderEntryTable(expenseEntries, "No expense entries yet.")}
          </section>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEntryId ? "Edit entry" : "Add entry"}
            </DialogTitle>
            <DialogDescription>
              Track income or expenses with recurrence details to keep your
              budget balanced.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-ds-gray-700 text-xs">Type</span>
                <Select
                  value={formState.type}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      type: value as EntryType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-ds-gray-700 text-xs">Amount</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={formState.amount}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      amount: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-ds-gray-700 text-xs">Label</span>
              <Input
                placeholder="e.g. Freelance gig"
                value={formState.label}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    label: event.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-ds-gray-700 text-xs">Category</span>
              <Input
                placeholder="e.g. Housing, Food"
                value={formState.category}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-ds-gray-700 text-xs">Recurrence</span>
                <Select
                  value={formState.recurrence}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      recurrence: value as RecurrenceType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recurring">Recurring</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formState.recurrence === "recurring" && (
                <div className="flex flex-col gap-1">
                  <span className="text-ds-gray-700 text-xs">Frequency</span>
                  <Select
                    value={formState.frequency}
                    onValueChange={(value) =>
                      setFormState((prev) => ({
                        ...prev,
                        frequency: value as FrequencyType,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-ds-gray-700 text-xs">Notes</span>
              <Textarea
                placeholder="Optional details"
                value={formState.notes}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    notes: event.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => handleDialogOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEntry} disabled={!isFormValid}>
              {editingEntryId ? "Save changes" : "Add entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReceiptUploadDialog
        open={receiptDialogOpen}
        onOpenChange={setReceiptDialogOpen}
        onExpenseAdd={handleReceiptExpenseAdd}
      />
    </div>
  );
}
