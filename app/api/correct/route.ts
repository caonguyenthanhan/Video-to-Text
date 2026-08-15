import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Hàm chia nhỏ văn bản (chunking) theo số từ để tránh mất ngữ cảnh hoặc vỡ token
function chunkText(text: string, maxWords: number = 250): string[] {
  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = [];

  for (const word of words) {
    currentChunk.push(word);
    if (currentChunk.length >= maxWords) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
    }
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Few-Shot Examples & Strict Rules
    const systemInstruction = `Bạn là một bộ lọc hậu kỳ nhận diện giọng nói (STT Corrector).
Nhiệm vụ: Sửa các lỗi do máy nghe nhầm âm thanh (ví dụ: "mươi" -> "mười", "xung quanh ăn" -> "xung quanh anh", "1 triệu đời" -> "mục tiêu cuộc đời").
Quy tắc:
1. TUYỆT ĐỐI KHÔNG làm mất văn phong nói tự nhiên, không biến ngôn ngữ nói thành văn viết văn chương cứng nhắc.
2. KHÔNG tự ý sáng tạo nội dung mới hoặc lặp lại câu chữ.
3. Giữ nguyên ý nghĩa gốc 100%.

Ví dụ 1:
Input: "khi anh có 1 cái đặc tính nào đó mà người xung quanh ăn..."
Output: "khi anh có một cái đặc tính nào đó mà người xung quanh anh..."

Ví dụ 2:
Input: "mục tiêu của tôi là kiếm 1 triệu đời"
Output: "mục tiêu của tôi là kiếm một triệu đô"
`;

    // Chia văn bản thành các block nhỏ (~250 từ) để LLM xử lý mượt mà và không lặp
    const chunks = chunkText(transcript, 250);
    let correctedTranscript = "";

    // Xử lý tuần tự từng đoạn
    for (const chunk of chunks) {
      const prompt = `Vui lòng sửa lỗi nhận diện giọng nói cho đoạn văn bản sau, CHỈ trả về kết quả đã sửa, không giải thích gì thêm:

${chunk}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.0, // Đưa về độ ẩm tuyệt đối để loại bỏ hallucination
          topP: 0.1, // Khóa chặt không gian token
          topK: 1, // Giải mã tham lam (Greedy decoding)
          presencePenalty: 0.1, // Chống lặp từ nhẹ
          frequencyPenalty: 0.1,
          maxOutputTokens: 1024 // Giới hạn token đầu ra
        }
      });
      
      const chunkResult = response.text ? response.text.trim() : chunk;
      correctedTranscript += chunkResult + " ";
    }

    return NextResponse.json({ correctedTranscript: correctedTranscript.trim() });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Lỗi khi kết nối với AI hiệu đính." }, { status: 500 });
  }
}
