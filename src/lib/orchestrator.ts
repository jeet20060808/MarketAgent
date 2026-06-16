import { startupAdvisor } from "@/agents/startupAdvisor";
import { marketResearch } from "@/agents/marketResearch";
import { productManager } from "@/agents/productManager";
import { architect } from "@/agents/architect";
import { marketing } from "@/agents/marketing";
import { engineeringManager } from "@/agents/engineering";
import { riskAnalyst } from "@/agents/riskAnalyst";
import { financialAnalyst } from "@/agents/financialAnalyst";

interface UploadedFile {
  name: string;
  type: string;
  content: string;
}

export async function orchestrate(
  idea: string,
  files?: UploadedFile[]
) {
  let contextPrompt = idea;

  if (files && files.length > 0) {
    contextPrompt += "\n\nAdditional Context from Uploaded Files:\n";

    files.forEach((file) => {
      contextPrompt += `
--- File: ${file.name} (Type: ${file.type}) ---
${file.content}
`;
    });
  }

  const [
    advisor,
    research,
    product,
    architecture,
    marketingResult,
    engineering,
    risk,
    financial,
  ] = await Promise.all([
    startupAdvisor(contextPrompt),
    marketResearch(contextPrompt),
    productManager(contextPrompt),
    architect(contextPrompt),
    marketing(contextPrompt),
    engineeringManager(contextPrompt),
    riskAnalyst(contextPrompt),
    financialAnalyst(contextPrompt),
  ]);

  return {
    advisor,
    research,
    product,
    architecture,
    marketing: marketingResult,
    engineering,
    risk,
    financial,
  };
}