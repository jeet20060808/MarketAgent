import { openai } from "@/lib/openai";

export async function financialAnalyst(idea: string) {
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",

    max_tokens: 1000,

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
- Revenue Projection
- Break-even Estimate
- Funding Requirements
- Burn Rate Analysis
- Key Financial Risks

Also provide:
- Financial Viability Score (1-10)
- Final Investment Recommendation

Maximum 400 words.
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