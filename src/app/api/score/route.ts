import { NextResponse } from "next/server";
import { scoreStartup } from "@/agents/scorer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idea, results } = body;

    if (!idea) {
      return NextResponse.json({ error: "Idea description is required" }, { status: 400 });
    }

    // Format the agent reports as context
    let agentReportsContext = "";
    if (results) {
      for (const [agentId, result] of Object.entries(results)) {
        if (result) {
          agentReportsContext += `\n--- Agent Output (${agentId}) ---\n${result}\n`;
        }
      }
    }

    const scoreData = await scoreStartup(idea, agentReportsContext);

    return NextResponse.json(scoreData);
  } catch (error) {
    console.error("Scoring route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong during scoring";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
