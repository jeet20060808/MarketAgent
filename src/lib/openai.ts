import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "dummy-key-for-build",
  baseURL: "https://integrate.api.nvidia.com/v1",
});