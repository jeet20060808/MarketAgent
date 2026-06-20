import { NextResponse } from "next/server";
import { orchestrate } from "@/lib/orchestrator";
import { checkRateLimit } from "@/lib/rate-limiter";

const MAX_IDEA_LENGTH = 10000;
const MAX_FILE_SIZE = 500 * 1024;
const MAX_TOTAL_SIZE = 1024 * 1024;
const MAX_FILE_COUNT = 10;
const MAX_BODY_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "application/json",
  "text/csv",
  "application/pdf",
]);

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

    const { idea, files } = body;

    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Idea description is required and must be a string." }, { status: 400 });
    }
    if (idea.length > MAX_IDEA_LENGTH) {
      return NextResponse.json({ error: "Idea description is too long." }, { status: 400 });
    }

    if (files) {
      if (!Array.isArray(files)) {
        return NextResponse.json({ error: "Files must be provided as an array." }, { status: 400 });
      }
      if (files.length > MAX_FILE_COUNT) {
        return NextResponse.json({ error: "Too many files uploaded." }, { status: 400 });
      }

      let totalSize = 0;
      for (const file of files) {
        if (!file.name || !file.content) {
          return NextResponse.json({ error: "Invalid file format. File name and content are required." }, { status: 400 });
        }
        if (typeof file.name !== "string" || typeof file.content !== "string") {
          return NextResponse.json({ error: "File name and content must be strings." }, { status: 400 });
        }
        if (file.name.length > 255) {
          return NextResponse.json({ error: "File name is too long." }, { status: 400 });
        }
        if (/[<>:"/\\|?*]/.test(file.name)) {
          return NextResponse.json({ error: "File name contains invalid characters." }, { status: 400 });
        }
        if (file.type && typeof file.type === "string" && !ALLOWED_MIME_TYPES.has(file.type)) {
          return NextResponse.json({ error: "File type is not supported." }, { status: 400 });
        }

        const fileSize = Math.max(typeof file.size === "number" ? file.size : 0, file.content.length);
        if (fileSize > MAX_FILE_SIZE) {
          return NextResponse.json({ error: "File exceeds the maximum limit of 500KB." }, { status: 400 });
        }
        totalSize += fileSize;
      }

      if (totalSize > MAX_TOTAL_SIZE) {
        return NextResponse.json({ error: "Total files size exceeds the maximum limit of 1MB." }, { status: 400 });
      }
    }

    const result = await orchestrate(idea, files as Array<{ name: string; type: string; content: string }> | undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Orchestrate error:", error);
    return NextResponse.json({ error: "An internal error occurred." }, { status: 500 });
  }
}