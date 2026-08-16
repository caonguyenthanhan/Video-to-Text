# Trình Nhận Diện Giọng Nói & Dịch Thuật Đa Ngôn Ngữ (STT & Translation WebApp)

Ứng dụng web nhận dạng giọng nói từ video/audio hoàn toàn offline trên trình duyệt (sử dụng WebAssembly) và hỗ trợ sửa lỗi tự động bằng mô hình AI Gemini.

## Tính năng chính

- **Nhận dạng giọng nói Offline (Trình duyệt):**
  - Chuyển đổi video/audio thành văn bản (Speech-to-Text) cục bộ, không gửi dữ liệu âm thanh lên server, bảo mật tuyệt đối.
  - Sử dụng kiến trúc Transformer chạy qua `WebAssembly` với thư viện `@huggingface/transformers`.
  - Hỗ trợ các model: **Whisper Tiny** (~40MB, siêu tốc), **Whisper Base** (~70MB, cân bằng), **Whisper Small** (~250MB, chuẩn xác cao).
  - Tự động phát hiện tiếng Việt hoặc tiếng Anh.

- **Hiệu đính thông minh bằng AI (AI Correction):**
  - Chỉnh sửa lỗi chính tả, lỗi nhận diện sai từ đồng âm bằng API nội bộ kết nối tới mô hình `Gemini 3.5 Flash`.
  - Kiến trúc Multi-Agent Correction & Chunking: Văn bản được cắt thành các đoạn nhỏ (chunking) xử lý song song để tránh mất nội dung.
  - Tối ưu hóa suy luận (Reasoning Optimization): Áp dụng Strict Decoding (Temperature=0.0, TopK=1) ngăn chặn tối đa tính ảo giác (Hallucination) và đảm bảo trung thành với văn phong gốc 100%.
  - Cơ chế Fallback: Tự động loại bỏ kết quả sửa lỗi của AI nếu phát hiện độ sai lệch lớn (kiểm duyệt độ dài).

- **Trải nghiệm người dùng (UX):**
  - Text Streaming: Kết quả xuất ra theo thời gian thực (real-time) như ChatGPT thay vì đợi tải xong toàn bộ video.
  - Thanh tiến trình xử lý chính xác dựa vào thời lượng (timestamp) của video.
  - Hỗ trợ Upload Video thông thường hoặc bằng thao tác Drag & Drop.

## Công nghệ sử dụng

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Framer Motion.
- **AI/ML:**
  - `@huggingface/transformers` cho in-browser Speech-To-Text.
  - `@google/genai` (Gemini API) cho tính năng sửa lỗi văn bản (STT Corrector).
- **Backend/API:** Next.js Route Handlers.

## Cài đặt & Chạy ứng dụng

1. Đảm bảo đã cài đặt Node.js.
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Cấu hình biến môi trường:
   Tạo file `.env` dựa theo `.env.example` và thiết lập API Key của Google Gemini:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Khởi chạy máy chủ phát triển:
   ```bash
   npm run dev
   ```
5. Mở trình duyệt và truy cập: `http://localhost:3000`

## Cách hoạt động của Bộ xử lý Web Worker (STT)
Phần nhận diện giọng nói được đưa vào một luồng `Worker` riêng biệt để không gây đứng trình duyệt khi đang xử lý các phép toán nơ-ron nặng.

## Cấu trúc thư mục cốt lõi
- `app/page.tsx`: Giao diện chính của ứng dụng.
- `app/api/correct/route.ts`: API Endpoint điều phối việc sửa lỗi STT với Google Gemini sử dụng chiến lược cắt Chunk (Multi-Agent Mocking).
- `components/ConvertView.tsx`: Component hiển thị vùng làm việc chính bao gồm kéo thả file, điều khiển Model, xử lý âm thanh (AudioContext), và gọi API.
- `lib/worker.ts`: Web Worker chứa instance Pipeline của HuggingFace chạy nhận diện giọng nói.
