import { NextResponse } from "next/server";
import { orchestrate } from "@/lib/orchestrator";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await orchestrate(body.idea);

    return NextResponse.json(result);
<<<<<<< HEAD
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
=======
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
>>>>>>> fb5b74b (Add orchestrator and agent APIs)
      { status: 500 }
    );
  }
}