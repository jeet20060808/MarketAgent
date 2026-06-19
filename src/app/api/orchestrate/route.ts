import { NextResponse } from "next/server";
import { orchestrate } from "@/lib/orchestrator";

const MAX_IDEA_LENGTH = 10000;
const MAX_FILE_SIZE = 500 * 1024; // 500KB
const MAX_TOTAL_SIZE = 1024 * 1024; // 1MB
const MAX_FILE_COUNT = 10;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idea, files } = body;

    // Validate Idea
    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Idea description is required and must be a string." }, { status: 400 });
    }
    if (idea.length > MAX_IDEA_LENGTH) {
      return NextResponse.json({ error: `Idea description is too long (maximum ${MAX_IDEA_LENGTH} characters).` }, { status: 400 });
    }

    // Validate Files
    if (files) {
      if (!Array.isArray(files)) {
        return NextResponse.json({ error: "Files must be provided as an array." }, { status: 400 });
      }
      if (files.length > MAX_FILE_COUNT) {
        return NextResponse.json({ error: `Too many files uploaded (maximum ${MAX_FILE_COUNT} files).` }, { status: 400 });
      }

      let totalSize = 0;
      for (const file of files) {
        if (!file.name || !file.content) {
          return NextResponse.json({ error: "Invalid file format. File name and content are required." }, { status: 400 });
        }
        
        // Use the actual content string length or reported size, whichever is larger, to prevent spoofing
        const fileSize = Math.max(file.size || 0, file.content.length);
        if (fileSize > MAX_FILE_SIZE) {
          return NextResponse.json({ error: `File "${file.name}" exceeds the maximum limit of 500KB.` }, { status: 400 });
        }
        totalSize += fileSize;
      }

      if (totalSize > MAX_TOTAL_SIZE) {
        return NextResponse.json({ error: "Total files size exceeds the maximum limit of 1MB." }, { status: 400 });
      }
    }

    const result = await orchestrate(idea, files);
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