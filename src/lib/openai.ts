import OpenAI from "openai";

let _openai: OpenAI | null = null;

function getApiKey(): string {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) {
    throw new Error("NVIDIA_API_KEY environment variable is not configured");
  }
  return key;
}

export function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: getApiKey(),
      baseURL: "https://integrate.api.nvidia.com/v1",
    });
  }
  return _openai;
}