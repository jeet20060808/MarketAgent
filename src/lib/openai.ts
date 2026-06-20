import OpenAI from "openai";

const apiKey = process.env.NVIDIA_API_KEY;
if (!apiKey) {
  throw new Error("NVIDIA_API_KEY environment variable is not configured");
}

export const openai = new OpenAI({
  apiKey,
  baseURL: "https://integrate.api.nvidia.com/v1",
});