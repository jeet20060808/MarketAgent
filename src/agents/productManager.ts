import { openai } from "@/lib/openai";

export async function productManager(idea: string) {
  const response = await openai.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",

    max_tokens: 1000,

    messages: [
      {
        role: "system",
        content: `
You are a Senior Product Manager.

Create:
- Features
- User Stories
- MVP Scope
- Roadmap

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