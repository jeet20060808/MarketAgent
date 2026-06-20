import { getOpenAI } from "@/lib/openai";

export async function marketing(idea: string) {
  const response = await getOpenAI().chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    max_tokens: 600,

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

CRITICAL INSTRUCTION: You MUST format the Marketing Channels section as a detailed Markdown Table with columns for Channel, Estimated Cost, and Expected ROI.

Keep it concise and professional.
Maximum 500 words.`,
      },
      {
        role: "user",
        content: idea,
      },
    ],
  });

  return response.choices[0].message.content;
}