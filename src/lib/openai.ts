import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "dummy-key-for-build",
  baseURL: "https://openrouter.ai/api/v1",
});