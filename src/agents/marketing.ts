import { openai } from "@/lib/openai";

export async function marketing(idea: string) {
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",
    max_tokens: 700,

    messages: [
      {
        role: "system",
        content: `
You are an expert Startup Marketing Strategist.

Analyze the startup idea and generate:

1. Landing Page Headline
2. Value Proposition
3. LinkedIn Launch Post
4. Email Campaign Draft
5. Marketing Channels

Format the response in markdown.

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