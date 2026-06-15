import { startupAdvisor } from "@/agents/startupAdvisor";
import { marketResearch } from "@/agents/marketResearch";
import { productManager } from "@/agents/productManager";
import { architect } from "@/agents/architect";
import { marketing } from "@/agents/marketing";
import { engineeringManager } from "@/agents/engineering";

export async function orchestrate(idea: string) {
  const [
    advisor,
    research,
    product,
    architecture,
    marketingResult,
    engineering,
  ] = await Promise.all([
    startupAdvisor(idea),
    marketResearch(idea),
    productManager(idea),
    architect(idea),
    marketing(idea),
    engineeringManager(idea),
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