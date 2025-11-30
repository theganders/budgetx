import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { env } from "@/env";

export const runtime = "edge";

const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

const receiptSchema = z.object({
  amount: z.number().describe("The total amount on the receipt"),
  label: z
    .string()
    .describe("The merchant or store name, or a short description of the purchase"),
  category: z
    .string()
    .describe(
      "A suggested expense category. Choose from: Housing, Education, Food, Utilities, Transport, Fun, Health, Shopping, or Other"
    ),
  recurrence: z
    .enum(["one-time", "recurring"])
    .describe(
      "Whether this is a one-time purchase or a recurring expense. Use 'recurring' for subscriptions, memberships, utility bills, rent, insurance, etc. Use 'one-time' for regular purchases like groceries, restaurants, shopping, etc."
    ),
  frequency: z
    .enum(["weekly", "monthly", "yearly"])
    .optional()
    .describe(
      "If recurring, the frequency of the expense. Most subscriptions and bills are 'monthly'. Use 'yearly' for annual memberships or insurance. Use 'weekly' for weekly services."
    ),
  notes: z
    .string()
    .optional()
    .describe("Any additional details like date, specific items, or receipt number"),
});

export type ParsedReceipt = z.infer<typeof receiptSchema>;

const systemPrompt = `You are a receipt parsing assistant. Analyze the receipt image and extract the following information:
1. The total amount (final total, not subtotals)
2. The merchant/store name or a short description of what was purchased
3. A category for this expense (choose the most appropriate: Housing, Education, Food, Utilities, Transport, Fun, Health, Shopping, or Other)
4. Whether this is a one-time or recurring expense (subscriptions, memberships, utility bills, rent, insurance are recurring; regular purchases like groceries, restaurants, shopping are one-time)
5. If recurring, the frequency (weekly, monthly, or yearly)
6. Any useful notes like the date, specific items, or receipt number

Be precise with the amount - use the final total including tax if visible.
For the label, use the store/merchant name if visible, otherwise describe the purchase briefly.
For recurrence, consider the type of purchase - streaming services, gym memberships, phone bills, rent are recurring; food, clothing, electronics purchases are typically one-time.`;

export async function POST(request: Request) {
  try {
    const { image, mimeType } = await request.json();

    if (!image || typeof image !== "string") {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const model = google("gemini-2.5-flash");

    const result = await generateObject({
      model,
      schema: receiptSchema,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: image,
            },
            {
              type: "text",
              text: "Please analyze this receipt and extract the expense information.",
            },
          ],
        },
      ],
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Receipt parsing error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to parse receipt" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

