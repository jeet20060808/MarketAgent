import { startupAdvisor } from "@/agents/startupAdvisor";
import { marketResearch } from "@/agents/marketResearch";
import { productManager } from "@/agents/productManager";
import { architect } from "@/agents/architect";
import { marketing } from "@/agents/marketing";
import { engineeringManager } from "@/agents/engineering";

interface UploadedFile {
  name: string;
  type: string;
  content: string;
}

export async function orchestrate(idea: string, files?: UploadedFile[]) {
  // Combine idea with files context if present
  let contextPrompt = idea;
  if (files && files.length > 0) {
    contextPrompt += "\n\nAdditional Context from Uploaded Files:\n";
    files.forEach((file) => {
      contextPrompt += `\n--- File: ${file.name} (Type: ${file.type}) ---\n${file.content}\n`;
    });
  }

  const [
    advisor,
    research,
    product,
    architecture,
    marketingResult,
    engineering,
  ] = await Promise.all([
    startupAdvisor(contextPrompt),
    marketResearch(contextPrompt),
    productManager(contextPrompt),
    architect(contextPrompt),
    marketing(contextPrompt),
    engineeringManager(contextPrompt),
  ]);

  return {
    advisor,
    research,
    product,
    architecture,
    marketing: marketingResult,
    engineering,
  };
}