import { openai } from "@/lib/openai";

export async function riskAnalyst(idea: string) {
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",

    max_tokens: 1000,

    messages: [
      {
        role: "system",
        content: `
You are a Senior Startup Risk Analyst.

Analyze the startup idea and identify:

- Market Risks
- Competition Risks
- Technical Risks
- Financial Risks
- Legal & Compliance Risks
- Execution Risks

For each risk provide:
- Risk Description
- Severity (Low, Medium, High)
- Mitigation Strategy

Also provide:
- Overall Risk Score (1-10)
- Top 3 Critical Risks
- Final Recommendation

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