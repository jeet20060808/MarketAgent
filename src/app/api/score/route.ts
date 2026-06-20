import { NextResponse } from "next/server";
import { scoreStartup } from "@/agents/scorer";
import { checkRateLimit } from "@/lib/rate-limiter";

const MAX_IDEA_LENGTH = 10000;
const MAX_RESULTS_TOTAL_LENGTH = 150000;
const MAX_BODY_SIZE = 5 * 1024 * 1024;

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const text = await req.text();
    if (text.length > MAX_BODY_SIZE) {
      return NextResponse.json({ error: "Request body too large." }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }

    const { idea, results } = body;

    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Idea description is required and must be a string." }, { status: 400 });
    }
    if (idea.length > MAX_IDEA_LENGTH) {
      return NextResponse.json({ error: "Idea description is too long." }, { status: 400 });
    }

    let agentReportsContext = "";
    if (results) {
      if (typeof results !== "object" || results === null || Array.isArray(results)) {
        return NextResponse.json({ error: "Results must be an object containing agent outputs." }, { status: 400 });
      }

      let totalResultsLength = 0;
      for (const [agentId, result] of Object.entries(results as Record<string, unknown>)) {
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
    return NextResponse.json({ error: "An internal error occurred." }, { status: 500 });
  }
}
