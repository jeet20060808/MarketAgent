import { openai } from "../lib/openai";

export async function startupAdvisor(idea: string) {
  const response = await openai.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    max_tokens: 550,
    messages: [
      {
        role: "system",
        content: `
You are an expert startup advisor.

Analyze the startup idea and provide the output in Markdown with clear section headings. Use the exact headings below:

## Startup Overview
## Problem Statement
## Solution
## Target Audience
## Business Model
## Key Risks
## Opportunities

Keep each section concise and professional.
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