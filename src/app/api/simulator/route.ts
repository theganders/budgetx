import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { env } from "@/env";

export const runtime = "edge";

const google = createGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY,
  });

const systemPrompt = `You are a friendly and knowledgeable personal financial advisor for students and young adults. Your role is to analyze "what-if" financial scenarios based on the user's actual budget data.

When responding to questions:
1. Always reference the user's actual numbers from their budget data
2. Calculate specific impacts (monthly and annual) based on their real income/expenses
3. Be encouraging but realistic about financial decisions
4. Format your response clearly with these sections:
   - **Impact Analysis**: Quantify the financial impact using their actual numbers
   - **Considerations**: Important factors to think about
   - **Recommendations**: Actionable advice tailored to their situation

Use emojis sparingly for visual clarity:
- 📊 for budget/numbers sections
- ⚠️ for warnings or considerations  
- 💡 for tips and recommendations
- ✨ for positive opportunities

Keep responses concise but informative. Focus on practical, actionable insights.`;

export async function POST(request: Request) {
  try {
    const { question, budgetContext } = await request.json();

    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Question is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = google("gemini-2.5-flash");

    const result = streamText({
      model,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Here is my current budget data:

${budgetContext}

My question: ${question}`,
        },
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Simulator API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

