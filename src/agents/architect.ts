import { openai } from "@/lib/openai";

export async function architect(idea: string) {
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",
    max_tokens: 1000,

    messages: [
      {
        role: "system",
        content: `
You are a Senior Software Architect.

Analyze the startup idea and generate:

1. Database Tables
2. API Endpoints
3. Recommended Tech Stack
4. High-Level System Architecture

Format your response in markdown.

Keep it concise and professional.
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