import { startupAdvisor } from "@/agents/startupAdvisor";
import { marketResearch } from "@/agents/marketResearch";
import { productManager } from "@/agents/productManager";
import { architect } from "@/agents/architect";
import { marketing } from "@/agents/marketing";

export async function orchestrate(idea: string) {
  const [
    advisor,
    research,
    product,
    architecture,
    marketingResult,
  ] = await Promise.all([
    startupAdvisor(idea),
    marketResearch(idea),
    productManager(idea),
    architect(idea),
    marketing(idea),
  ]);

  return {
    advisor,
    research,
    product,
    architecture,
    marketing: marketingResult,
  };
}