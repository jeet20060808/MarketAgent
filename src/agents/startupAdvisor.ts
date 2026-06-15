import { openai } from "../lib/openai";

export async function startupAdvisor(idea: string) {
  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b:free",
    max_tokens: 1000, // Add here

    messages: [
      {
        role: "system",
        content: `
You are an expert startup advisor.

Analyze the startup idea and provide:

1. Problem Statement
2. Target Audience
3. Business Model
4. Key Risks
5. Opportunities

Keep it concise and professional.
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
