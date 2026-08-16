# Video-to-Text: Enterprise STT & AI Corrector

Một ứng dụng Desktop mạnh mẽ giúp bóc băng (Speech-to-Text) video tự động hoàn toàn ngoại tuyến (offline) bằng **Whisper**, kết hợp với hệ thống **Multi-Agent AI Corrector (LangGraph + LlamaIndex + Gemma 2B)** để sửa lỗi ngữ âm, phương ngữ chuẩn xác 100%.

## Kiến Trúc Hệ Thống (Dual Architecture)

Dự án được chia làm 2 giai đoạn xử lý khép kín:

### 1. Core Transcription (Whisper)
- Sử dụng mô hình `faster-whisper` (base/small/large tuỳ cấu hình).
- **VAD Filter (Voice Activity Detection):** Tự động phát hiện và loại bỏ các khoảng lặng, tiếng nhạc nền, tiếng ồn để tránh mô hình bị "ảo giác" tự lặp lại chữ.
- **Tối ưu suy luận:** Khóa `condition_on_previous_text=False` và tăng `beam_size=5` để tạo ra bản text thô (raw STT) chuẩn cấu trúc nhất.

### 2. Multi-Agent AI Corrector (LangGraph + Gemma 2B)
Đây là "trái tim" của hệ thống xử lý hậu kỳ, giải quyết triệt để điểm yếu của Whisper (hay nghe nhầm các từ lóng, tiếng địa phương).
- **Chunking Node:** Cắt nhỏ văn bản tự động để tránh tràn Context Window của LLM.
- **Routing Node (Semantic Router):** Phân tích intent. Nếu phát hiện từ lóng/phương ngữ (VD: "chằm dằm", "cọc cọc"), điều hướng sang luồng RAG.
- **Grounding Node (LlamaIndex RAG):** Truy xuất từ điển phương ngữ cục bộ (mock_dictionary.json) để cấp "kiến thức nền" cho LLM.
- **Correction Node:** Chạy LLM (Gemma 2B / Qwen 1.5B) để chải chuốt lại ngữ âm, giữ nguyên 100% văn phong nói gốc.
- **Quality Gate (RAGAS Eval) & Fallback:** Đánh giá điểm. Nếu phát hiện LLM bị ảo giác (chế chữ), hệ thống tự động Fallback (trả về text gốc) để ứng dụng không bao giờ bị lỗi.

## Hướng Dẫn Cài Đặt (Local Environment)

### Yêu cầu hệ thống
- Python 3.10+
- FFmpeg (Phải có trong PATH của Windows)
- (Tùy chọn) GPU NVIDIA hỗ trợ CUDA để chạy Whisper/Gemma nhanh hơn.

### Cài đặt thư viện
```bash
# Thư viện Core STT & UI
pip install faster-whisper fastapi uvicorn pydantic

# Thư viện LangGraph AI Corrector
pip install langgraph semantic-router llama-index dspy-ai ragas langsmith arize-phoenix langchain-community llama-cpp-python
```

### Tải Mô hình (Models)
Tạo thư mục `stt_corrector/models/` và tải các mô hình định dạng `GGUF` về (Khuyến nghị: **Gemma-2-2B-it-Q4_K_M** hoặc **Qwen2.5-coder-1.5b-instruct**).
Cập nhật file `stt_corrector/.env` để trỏ đúng đường dẫn mô hình.

## Cách Sử Dụng

Bạn có thể chạy toàn bộ hệ thống thông qua giao diện ứng dụng:
```bash
python desktop_app.py
```
Hoặc test luồng LangGraph đa tác vụ độc lập:
```bash
cd stt_corrector
python test_graph.py
```

## Lưu ý về Phụ Đề (SRT)
- Text hiển thị trên UI là bản đã qua xử lý hoàn hảo của AI (Plain Text).
- Nút "Xuất Phụ đề" sẽ lưu lại file `.srt` với timestamp gốc của Whisper (Chưa có sự can thiệp của AI do AI chỉ sửa text chứ không thể căn lại timestamp từng chữ).
