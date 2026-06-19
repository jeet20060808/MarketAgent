import { NextResponse } from "next/server";
import { scoreStartup } from "@/agents/scorer";

const MAX_IDEA_LENGTH = 10000;
const MAX_RESULTS_TOTAL_LENGTH = 150000;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idea, results } = body;

    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Idea description is required and must be a string." }, { status: 400 });
    }
    if (idea.length > MAX_IDEA_LENGTH) {
      return NextResponse.json({ error: `Idea description is too long (maximum ${MAX_IDEA_LENGTH} characters).` }, { status: 400 });
    }

    // Format the agent reports as context
    let agentReportsContext = "";
    if (results) {
      if (typeof results !== "object") {
        return NextResponse.json({ error: "Results must be an object containing agent outputs." }, { status: 400 });
      }

      let totalResultsLength = 0;
      for (const [agentId, result] of Object.entries(results)) {
        if (result && typeof result === "string") {
          totalResultsLength += result.length;
          if (totalResultsLength > MAX_RESULTS_TOTAL_LENGTH) {
            return NextResponse.json({ error: "Total agent results context exceeds the safe limit for evaluation." }, { status: 400 });
          }
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
