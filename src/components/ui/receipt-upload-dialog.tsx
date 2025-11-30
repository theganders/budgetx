"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, Loader2, X, ImageIcon } from "lucide-react";
import type { ParsedReceipt } from "@/app/api/receipt/route";

const CATEGORIES = [
  "Housing",
  "Education",
  "Food",
  "Utilities",
  "Transport",
  "Fun",
  "Health",
  "Shopping",
  "Other",
];

type RecurrenceType = "one-time" | "recurring";
type FrequencyType = "weekly" | "monthly" | "yearly";

type ReceiptUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdd: (data: {
    label: string;
    amount: number;
    category: string;
    recurrence: RecurrenceType;
    frequency?: FrequencyType;
    notes?: string;
  }) => void;
};

type Step = "upload" | "processing" | "review";

export function ReceiptUploadDialog({
  open,
  onOpenChange,
  onExpenseAdd,
}: ReceiptUploadDialogProps) {
  const [step, setStep] = useState<Step>("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Form fields for review step
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("one-time");
  const [frequency, setFrequency] = useState<FrequencyType>("monthly");
  const [notes, setNotes] = useState("");

  const resetState = useCallback(() => {
    setStep("upload");
    setImagePreview(null);
    setImageData(null);
    setMimeType("image/jpeg");
    setError(null);
    setIsDragOver(false);
    setLabel("");
    setAmount("");
    setCategory("");
    setRecurrence("one-time");
    setFrequency("monthly");
    setNotes("");
  }, []);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        resetState();
      }
      onOpenChange(newOpen);
    },
    [onOpenChange, resetState]
  );

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB");
      return;
    }

    setError(null);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      // Extract base64 data without the prefix
      const base64Data = result.split(",")[1];
      setImageData(base64Data);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const clearImage = useCallback(() => {
    setImagePreview(null);
    setImageData(null);
    setError(null);
  }, []);

  const analyzeReceipt = useCallback(async () => {
    if (!imageData) return;

    setStep("processing");
    setError(null);

    try {
      const response = await fetch("/api/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, mimeType }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze receipt");
      }

      const data: ParsedReceipt = await response.json();

      setLabel(data.label || "");
      setAmount(data.amount?.toString() || "");
      setCategory(data.category || "Other");
      setRecurrence(data.recurrence || "one-time");
      setFrequency(data.frequency || "monthly");
      setNotes(data.notes || "");
      setStep("review");
    } catch (err) {
      console.error("Receipt analysis error:", err);
      setError("Failed to analyze receipt. Please try again or enter details manually.");
      setStep("upload");
    }
  }, [imageData, mimeType]);

  const handleAddExpense = useCallback(() => {
    const parsedAmount = parseFloat(amount);
    if (!label.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please provide a valid label and amount");
      return;
    }

    onExpenseAdd({
      label: label.trim(),
      amount: parsedAmount,
      category: category || "Other",
      recurrence,
      frequency: recurrence === "recurring" ? frequency : undefined,
      notes: notes.trim() || undefined,
    });

    handleOpenChange(false);
  }, [label, amount, category, recurrence, frequency, notes, onExpenseAdd, handleOpenChange]);

  const isFormValid =
    label.trim().length > 0 &&
    amount.trim().length > 0 &&
    !isNaN(parseFloat(amount)) &&
    parseFloat(amount) > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {step === "upload" && "Scan Receipt"}
            {step === "processing" && "Analyzing Receipt"}
            {step === "review" && "Review Expense"}
          </DialogTitle>
          <DialogDescription>
            {step === "upload" &&
              "Upload a receipt image and we'll extract the expense details automatically."}
            {step === "processing" && "Please wait while we analyze your receipt..."}
            {step === "review" &&
              "Review and edit the extracted details before adding to your expenses."}
          </DialogDescription>
        </DialogHeader>

        {/* Upload Step */}
        {step === "upload" && (
          <div className="flex flex-col gap-4">
            {!imagePreview ? (
              <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  relative flex flex-col items-center justify-center gap-3 
                  h-48 rounded-lg border-2 border-dashed cursor-pointer
                  transition-colors duration-200
                  ${
                    isDragOver
                      ? "border-ds-blue-600 bg-ds-blue-100/10"
                      : "border-ds-gray-alpha-400 hover:border-ds-gray-alpha-600 bg-ds-background-100"
                  }
                `}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div
                  className={`
                  p-3 rounded-full 
                  ${isDragOver ? "bg-ds-blue-100/20" : "bg-ds-gray-alpha-100"}
                `}
                >
                  <Upload
                    className={`h-6 w-6 ${
                      isDragOver ? "text-ds-blue-600" : "text-ds-gray-700"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-ds-gray-1000 text-sm font-medium">
                    {isDragOver ? "Drop your receipt here" : "Click or drag to upload"}
                  </p>
                  <p className="text-ds-gray-700 text-xs mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              </label>
            ) : (
              <div className="relative">
                <div className="rounded-lg overflow-hidden border border-ds-gray-alpha-400 bg-ds-background-100">
                  <img
                    src={imagePreview}
                    alt="Receipt preview"
                    className="w-full h-48 object-contain bg-ds-gray-alpha-100"
                  />
                </div>
                <button
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-ds-gray-1000 text-ds-background-100 hover:bg-ds-gray-900 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {error && (
              <p className="text-ds-red-600 text-sm text-center">{error}</p>
            )}
          </div>
        )}

        {/* Processing Step */}
        {step === "processing" && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="relative">
              <div className="p-4 rounded-full bg-ds-gray-alpha-100">
                <ImageIcon className="h-8 w-8 text-ds-gray-700" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-ds-blue-600">
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-ds-gray-1000 font-medium">Processing your receipt</p>
              <p className="text-ds-gray-700 text-sm mt-1">
                Extracting amount, merchant, and category...
              </p>
            </div>
          </div>
        )}

        {/* Review Step */}
        {step === "review" && (
          <div className="flex flex-col gap-4">
            {imagePreview && (
              <div className="rounded-lg overflow-hidden border border-ds-gray-alpha-400 bg-ds-background-100">
                <img
                  src={imagePreview}
                  alt="Receipt preview"
                  className="w-full h-32 object-contain bg-ds-gray-alpha-100"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-ds-gray-700 text-xs">Amount</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-ds-gray-700 text-xs">Category</span>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-ds-gray-700 text-xs">Label</span>
              <Input
                placeholder="e.g. Grocery store"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-ds-gray-700 text-xs">Recurrence</span>
                <Select value={recurrence} onValueChange={(v) => setRecurrence(v as RecurrenceType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {recurrence === "recurring" && (
                <div className="flex flex-col gap-1">
                  <span className="text-ds-gray-700 text-xs">Frequency</span>
                  <Select value={frequency} onValueChange={(v) => setFrequency(v as FrequencyType)}>
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            {error && (
              <p className="text-ds-red-600 text-sm text-center">{error}</p>
            )}
          </div>
        )}

        <DialogFooter>
          {step === "upload" && (
            <>
              <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={analyzeReceipt} disabled={!imageData}>
                Analyze Receipt
              </Button>
            </>
          )}

          {step === "processing" && (
            <Button variant="ghost" onClick={() => setStep("upload")}>
              Cancel
            </Button>
          )}

          {step === "review" && (
            <>
              <Button variant="ghost" onClick={() => setStep("upload")}>
                Back
              </Button>
              <Button onClick={handleAddExpense} disabled={!isFormValid}>
                Add Expense
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

