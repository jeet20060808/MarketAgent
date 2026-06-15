import { NextResponse } from "next/server";
import { orchestrate } from "@/lib/orchestrator";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await orchestrate(body.idea);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}