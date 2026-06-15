import { NextResponse } from "next/server";
import { orchestrate } from "@/lib/orchestrator";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await orchestrate(body.idea, body.files);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}