import { openai } from "../lib/openai";

export interface ScoreData {
  startupScore: number;
  marketScore: number;
  marketReason: string;
  revenueScore: number;
  revenueReason: string;
  executionScore: number;
  executionReason: string;
  competitionScore: number;
  competitionReason: string;
  riskScore: number;
  riskReason: string;
  scoreCalculation: {
    marketWeight: number;
    revenueWeight: number;
    executionWeight: number;
    competitionWeight: number;
    riskWeight: number;
  };
  recommendation: string;
  investorVerdict: string;
  calculationExplanation: string;
}

export async function scoreStartup(idea: string, agentReportsContext: string): Promise<ScoreData> {
  const systemPrompt = `
You are an expert Startup Scoring Engine and Venture Capital Analyst.
Evaluate the startup idea based on the provided description and the surrounding multi-agent research analysis.

Assign scores from 0 to 100 for each of the following five metrics:

1. Market Score (0-100)
Based on:
- TAM size
- Market growth
- Customer demand
- Industry trends

2. Revenue Score (0-100)
Based on:
- Pricing model
- Revenue predictability
- Recurring revenue potential
- LTV/CAC feasibility

3. Execution Score (0-100)
Based on:
- Technical complexity
- MVP difficulty
- Resource requirements
- Time to launch

4. Competition Score (0-100)
Based on:
- Number of competitors
- Market saturation
- Differentiation strength

5. Risk Score (0-100)
Based on:
- Financial risk
- Technical risk
- Regulatory risk
- Operational risk

You MUST explain WHY each score was assigned in a detailed, clear paragraph (at least 2-3 sentences).

Calculate the final Startup Score using the following formula:
Startup Score = (Market Score × 0.30) + (Revenue Score × 0.25) + (Execution Score × 0.20) + (Competition Score × 0.15) + (Risk Score × 0.10)
Ensure your calculation is mathematically correct and rounded to the nearest integer.

Provide a detailed, human-readable explanation of how the final startup score was calculated, including the mathematical steps (e.g., "(Market Score of X * 0.3) + ... = Y").

Return JSON ONLY. Do not wrap the JSON in markdown code blocks like \`\`\`json. The output must be pure, parseable JSON text matching the structure below:

{
  "startupScore": 0,
  "marketScore": 0,
  "marketReason": "",
  "revenueScore": 0,
  "revenueReason": "",
  "executionScore": 0,
  "executionReason": "",
  "competitionScore": 0,
  "competitionReason": "",
  "riskScore": 0,
  "riskReason": "",
  "scoreCalculation": {
    "marketWeight": 0.30,
    "revenueWeight": 0.25,
    "executionWeight": 0.20,
    "competitionWeight": 0.15,
    "riskWeight": 0.10
  },
  "recommendation": "",
  "investorVerdict": "",
  "calculationExplanation": ""
}
`;

  const userPrompt = `
Startup Idea:
${idea}

Multi-Agent Analysis Reports:
${agentReportsContext}
`;

  const response = await openai.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    max_tokens: 1500,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: systemPrompt.trim(),
      },
      {
        role: "user",
        content: userPrompt.trim(),
      },
    ],
  });

  const content = response.choices[0].message.content?.trim() || "{}";
  
  // Clean potential markdown wrapping if the model ignored the instructions
  let cleanedJson = content;
  if (cleanedJson.startsWith("```")) {
    cleanedJson = cleanedJson.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  try {
    const parsed: ScoreData = JSON.parse(cleanedJson);
    
    // Ensure calculation is strictly correct on the server side
    const marketContr = (parsed.marketScore || 0) * 0.30;
    const revenueContr = (parsed.revenueScore || 0) * 0.25;
    const executionContr = (parsed.executionScore || 0) * 0.20;
    const competitionContr = (parsed.competitionScore || 0) * 0.15;
    const riskContr = (parsed.riskScore || 0) * 0.10;
    
    const computedScore = Math.round(marketContr + revenueContr + executionContr + competitionContr + riskContr);
    parsed.startupScore = computedScore;
    
    return parsed;
  } catch (error) {
    console.error("JSON parsing error on scoring output:", content, error);
    throw new Error("Failed to parse scoring engine response: " + error);
  }
}
