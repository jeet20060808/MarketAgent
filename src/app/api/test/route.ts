import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "API working",
    keyExists: !!process.env.OPENAI_API_KEY,
  });
<<<<<<< HEAD
}
=======
}
>>>>>>> fb5b74b (Add orchestrator and agent APIs)
