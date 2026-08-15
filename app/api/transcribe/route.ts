import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import os from "os";

export const maxDuration = 120; // 2 minutes

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = join(os.tmpdir(), `upload_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
    await writeFile(tempFilePath, buffer);

    // Upload to Gemini File API
    const uploadedFile = await ai.files.upload({
      file: tempFilePath,
      config: { mimeType: file.type }
    });

    // Generate transcript
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        uploadedFile,
        "Please provide a highly accurate transcript of the speech in this video/audio. Output ONLY the raw transcript text with no extra commentary.",
      ],
    });

    return NextResponse.json({ transcript: response.text });
  } catch (error: any) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
