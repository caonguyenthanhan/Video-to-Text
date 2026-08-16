import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// 1. Chunking Agent: Chia nhỏ văn bản theo block từ để chống quá tải Context Window và kẹt vòng lặp
function chunkText(text: string, maxWords: number = 200): string[] {
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

// 2. Semantic Router & Context Grounding Mock
// Trong một ứng dụng thực tế, hàm này sẽ gọi LlamaIndex/VectorDB để truy xuất phương ngữ hoặc từ chuyên ngành.
function buildGroundingContext(chunk: string): string {
  // Ở đây chúng ta mô phỏng việc RAG nạp thêm ngữ cảnh vào prompt nếu phát hiện từ khó
  let extraContext = "";
  if (chunk.toLowerCase().includes("chăm dầm") || chunk.toLowerCase().includes("chằm dằm")) {
    extraContext = `\nChú ý từ điển địa phương/phương ngữ: "chằm dằm chằm bự" (nghĩa là to lớn, thô kệch). KHÔNG sửa thành "chăm dầm chờ bữ".\n`;
  }
  return extraContext;
}

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Cấu hình Pipeline Prompt (Mô phỏng tối ưu hóa từ DSPy)
    const systemInstruction = `Bạn là một hệ thống Multi-Agent STT Corrector chuyên nghiệp (hoạt động theo luồng đánh giá chéo).
Nhiệm vụ: Sửa lỗi ngữ âm học do máy nghe nhầm.
Quy tắc (Strict Constraints):
1. BẢO TOÀN VĂN PHONG NÓI: Không được biến ngôn ngữ nói tự nhiên thành văn viết cứng nhắc.
2. CHỐNG HALLUCINATE: KHÔNG tự ý sáng tạo nội dung mới hoặc lặp lại câu chữ. Nếu không chắc chắn, HÃY GIỮ NGUYÊN BẢN GỐC (Fallback Mechanism).
3. TRUNG THÀNH (Faithfulness): Giữ nguyên ý nghĩa gốc 100%.

Ví dụ Few-Shot đã được kiểm chứng (Evaluation Gate):
Input: "khi anh có 1 cái đặc tính nào đó mà người xung quanh ăn..."
Output: "khi anh có một cái đặc tính nào đó mà người xung quanh anh..."

Input: "mục tiêu của tôi là kiếm 1 triệu đời"
Output: "mục tiêu của tôi là kiếm một triệu đô"`;

    // 1. Phân luồng dữ liệu (Chunking Agent)
    const chunks = chunkText(transcript, 200);
    let correctedTranscript = "";

    // Xử lý tuần tự qua Pipeline
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // 2. Nạp Context từ VectorDB (Grounding)
      const groundingData = buildGroundingContext(chunk);

      // 3. LLMOps Logging (Mô phỏng Trace Log)
      console.log(`[LangSmith Trace] Processing Node: Chunk ${i + 1}/${chunks.length} | Length: ${chunk.length} chars`);

      const prompt = `Xử lý đoạn văn bản sau theo quy tắc đã định. CHỈ trả về kết quả đã sửa, không giải thích gì thêm.${groundingData}

[Input Text]:
${chunk}`;

      // 4. Suy luận chặt chẽ (Reasoning Optimization & Strict Decoding)
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash", // Mô phỏng LLM Engine
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.0, // Độ ẩm tuyệt đối để loại bỏ tính ngẫu nhiên
          topP: 0.1, // Siết chặt không gian token
          topK: 1, // Giải mã tham lam (Greedy)
          presencePenalty: 0.2, // Chống hiện tượng lặp từ
          frequencyPenalty: 0.2,
          maxOutputTokens: 1024
        }
      });
      
      // 5. Fallback & Evaluation Gate (Kiểm duyệt đầu ra)
      let chunkResult = chunk; // Default fallback to original
      if (response.text) {
          const rawOutput = response.text.trim();
          // Kiểm tra tính hợp lệ cơ bản: Nếu kết quả rỗng hoặc quá sai lệch về độ dài (dấu hiệu Hallucination), kích hoạt Fallback
          if (rawOutput.length > 0 && Math.abs(rawOutput.length - chunk.length) < chunk.length * 0.5) {
              chunkResult = rawOutput;
          } else {
              console.warn(`[Evaluation Gate] Output rejected for Chunk ${i+1}. Fallback to original text triggered.`);
          }
      }

      correctedTranscript += chunkResult + (i < chunks.length - 1 ? " " : "");
    }

    // Ghi log kết thúc luồng
    console.log(`[LangSmith Trace] Pipeline Execution Complete. Output Length: ${correctedTranscript.length}`);

    return NextResponse.json({ correctedTranscript: correctedTranscript.trim() });
  } catch (error: any) {
    console.error("Pipeline Execution Error:", error);
    return NextResponse.json({ error: "Lỗi luồng xử lý AI hiệu đính." }, { status: 500 });
  }
}
