import { openai } from "@/lib/openai";

export async function riskAnalyst(idea: string) {
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",
    max_tokens: 1200,

    messages: [
      {
        role: "system",
        content: `
You are a Senior Startup Risk Analyst.

Analyze the startup idea and identify:

1. Market Risks
2. Technical Risks
3. Financial Risks
4. Compliance & Legal Risks
5. Operational Risks

For each risk category, provide:
- Risk description
- Severity (Critical / High / Medium / Low)
- Likelihood (High / Medium / Low)
- Mitigation strategy

CRITICAL INSTRUCTION: You MUST include a Markdown Table summarizing the Top 5 Critical Risks with columns: Risk, Category, Severity, Likelihood, Mitigation.

Also provide:
- Overall Risk Score (1-10, where 10 is highest risk)
- Top 3 Immediate Actions to reduce risk exposure

Keep it concise and professional.
Maximum 600 words.
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
