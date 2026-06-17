import { openai } from "@/lib/openai";

export async function financialAnalyst(idea: string) {
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",

    max_tokens: 2000,

    messages: [
      {
        role: "system",
        content: `
You are a Senior Startup Financial Analyst.

Evaluate the startup idea from a business and financial perspective.

Provide:
- Revenue Model
- Pricing Strategy
- Estimated Customer Acquisition Cost (CAC)
- Estimated Customer Lifetime Value (LTV)
- Break-even Estimate
- Funding Requirements
- Burn Rate Analysis
- Key Financial Risks

CRITICAL INSTRUCTION 1: You MUST include a strict Markdown Table detailing the Revenue Projections for Year 1 through Year 5.
CRITICAL INSTRUCTION 2: At the very end of your response, you MUST output a raw JSON code block containing chart data. Use exactly this format:
\`\`\`json
{
  "chartData": [
    { "name": "Year 1", "revenue": 0, "expenses": 0, "profit": 0 },
    { "name": "Year 2", "revenue": 0, "expenses": 0, "profit": 0 },
    { "name": "Year 3", "revenue": 0, "expenses": 0, "profit": 0 },
    { "name": "Year 4", "revenue": 0, "expenses": 0, "profit": 0 },
    { "name": "Year 5", "revenue": 0, "expenses": 0, "profit": 0 }
  ]
}
\`\`\`
Replace the 0s with realistic estimates for this specific business.

Also provide:
- Financial Viability Score (1-10)
- Final Investment Recommendation
        `,
      },
      {
        role: "user",
        content: idea,
      },
    ],
  });

  return response.choices[0].message.content;
}