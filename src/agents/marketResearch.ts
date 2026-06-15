import { openai } from "@/lib/openai";

export async function marketResearch(idea: string) {
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",

    max_tokens: 1000,

    messages: [
      {
        role: "system",
        content: `
You are a market research expert.

Analyze:
- Top 3 Competitors
- Market Size (TAM)
- Key Trends
- Opportunities

Maximum 400 words.
Return structured markdown.
        `,
      },
      {
        role: "user",
        content: idea,
      },
    ],
  });

  return response.choices[0].message.content;
<<<<<<< HEAD
}
=======
}
>>>>>>> fb5b74b (Add orchestrator and agent APIs)
