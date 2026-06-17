import { openai } from "@/lib/openai";

export async function architect(idea: string) {
  const response = await openai.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    max_tokens: 900,

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

CRITICAL INSTRUCTION 1: You MUST format the Database Tables and API Endpoints as strict Markdown Tables.
CRITICAL INSTRUCTION 2: You MUST include at least one concrete architectural diagram or code snippet using a \`\`\`typescript\`\`\` code block.

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