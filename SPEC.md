# Đặc tả kỹ thuật: Video → Text (Speech Recognition Desktop App)

## 1. Tổng quan

Ứng dụng desktop chạy trên Windows/macOS/Linux, cho phép người dùng chọn một file video local, tự động tách audio và chuyển giọng nói trong video thành văn bản (transcript), hoàn toàn xử lý offline trên máy — không upload dữ liệu lên server nào.

| | |
|---|---|
| **Tên file chính** | `video_to_text.py` |
| **Ngôn ngữ** | Python 3.9+ |
| **Giao diện** | Tkinter (thư viện chuẩn, không cần cài thêm) |
| **Engine nhận dạng** | `faster-whisper` (CTranslate2, dựa trên OpenAI Whisper) |
| **Đóng gói** | PyInstaller → `.exe` qua `build.bat` |

## 2. Mục tiêu

- Chuyển giọng nói trong video thành văn bản mà không cần kết nối mạng sau khi đã tải model.
- Giao diện đơn giản, không yêu cầu người dùng biết lập trình.
- Chạy độc lập dưới dạng file `.exe`, không cần cài Python trên máy người dùng cuối.

## 3. Đối tượng sử dụng

Người dùng cá nhân cần transcript nhanh cho video cá nhân, bài giảng, phỏng vấn, cuộc họp ghi hình — không yêu cầu độ chính xác cấp chuyên nghiệp hay xử lý hàng loạt quy mô lớn.

## 4. Kiến trúc

```
┌─────────────────────┐
│   Tkinter UI thread  │  ← chọn file, chọn model/ngôn ngữ, hiển thị kết quả
└─────────┬────────────┘
          │ start_transcription()
          ▼
┌─────────────────────┐
│  Background thread   │  ← không block UI
│  (threading.Thread)  │
└─────────┬────────────┘
          │ WhisperModel.transcribe()
          ▼
┌─────────────────────┐
│   faster-whisper     │  ← tự gọi ffmpeg để giải mã audio từ video
│   (CTranslate2)      │
└─────────┬────────────┘
          │ segments (text, start, end)
          ▼
┌─────────────────────┐
│  queue.Queue()       │  ← giao tiếp thread-safe về UI thread
└─────────┬────────────┘
          │ root.after(100ms) polling
          ▼
┌─────────────────────┐
│   Text box / Status  │
└─────────────────────┘
```

Giao tiếp giữa thread nền và UI thread dùng `queue.Queue`, được UI poll mỗi 100ms qua `root.after()` — tránh gọi trực tiếp Tkinter API từ thread khác (không an toàn).

## 5. Chức năng hiện tại (v1)

| ID | Chức năng | Mô tả |
|---|---|---|
| F1 | Chọn video | Dialog chọn file, lọc theo đuôi mp4/mkv/mov/avi/webm/flv/wmv |
| F2 | Chọn model | Dropdown: tiny / base / small / medium / large-v3 |
| F3 | Chọn ngôn ngữ | Dropdown: auto-detect hoặc chỉ định (vi, en, ja, ko, zh, fr, es) |
| F4 | Nhận dạng giọng nói | Chạy nền, không đóng băng UI; text hiện dần theo từng đoạn (segment) |
| F5 | Trạng thái xử lý | Label hiển thị bước hiện tại + progress bar dạng indeterminate |
| F6 | Copy văn bản | Copy toàn bộ transcript vào clipboard |
| F7 | Lưu file .txt | Lưu transcript ra file văn bản |
| F8 | Xử lý lỗi | Bắt exception, hiện message box thay vì crash |
| F9 | Build .exe | `build.bat` tự cài dependency và đóng gói bằng PyInstaller |

## 6. Yêu cầu phi chức năng

- **Hiệu năng:** UI không được đứng/treo trong lúc nhận dạng (đã đảm bảo bằng threading).
- **Khả năng phục hồi:** lỗi trong quá trình nhận dạng (file hỏng, thiếu ffmpeg, hết bộ nhớ) phải hiển thị thông báo rõ ràng, không crash toàn bộ app.
- **Không phụ thuộc mạng khi chạy:** chỉ cần mạng ở lần đầu tải model; sau đó hoạt động hoàn toàn offline.
- **Riêng tư:** video và audio không rời khỏi máy người dùng.
- **Khả năng đóng gói:** phải chạy được như file `.exe` độc lập trên Windows không cài Python.

## 7. Phụ thuộc & giới hạn hiện tại

- Yêu cầu `ffmpeg` có sẵn trong PATH (faster-whisper gọi ffmpeg ngầm để giải mã).
- File `.exe` build bằng PyInstaller **không** đóng gói kèm ffmpeg — máy chạy vẫn phải tự cài.
- Progress bar hiện tại là *indeterminate* (không hiện % thực), vì `faster-whisper` trả kết quả theo generator segment, không có tổng số đoạn biết trước dễ dàng.
- Không phân biệt người nói (single transcript, không có nhãn speaker).
- Không hỗ trợ xử lý nhiều file cùng lúc (batch).

## 8. Roadmap — tính năng đề xuất mở rộng

| Ưu tiên | Tính năng | Mô tả | Độ phức tạp |
|---|---|---|---|
| Cao | **Xuất SRT/VTT** | Dùng `segment.start`/`segment.end` đã có sẵn để xuất phụ đề đúng thời gian | Thấp |
| Cao | **Tiến độ % thực** | Ước tính % dựa trên `segment.end / tổng thời lượng video` (lấy qua ffprobe) | Trung bình |
| Trung bình | **Kéo-thả video vào cửa sổ** | Dùng `tkinterdnd2` để hỗ trợ drag & drop | Thấp |
| Trung bình | **Tuỳ chọn GPU (CUDA)** | Thêm checkbox device cpu/cuda, tự phát hiện GPU khả dụng | Thấp |
| Trung bình | **Xử lý hàng loạt (batch)** | Chọn thư mục, xử lý tuần tự nhiều video, xuất từng kết quả | Trung bình |
| Thấp | **Dịch phụ đề song ngữ** | Gọi API dịch (Google/DeepL) sau khi có transcript | Trung bình |
| Thấp | **Phân biệt người nói** | Tích hợp `pyannote.audio` để gắn nhãn Speaker A/B | Cao (cần token HuggingFace, model riêng) |
| Thấp | **Ghép phụ đề vào video (burn-in)** | Dùng ffmpeg render SRT trực tiếp lên video xuất file mới | Trung bình |
| Thấp | **Lịch sử xử lý** | Lưu danh sách video đã xử lý + kết quả để mở lại | Thấp |
| Thấp | **Đóng gói ffmpeg kèm exe** | Bundle `ffmpeg.exe` vào thư mục build để chạy portable hoàn toàn | Trung bình |

## 9. Tiêu chí hoàn thành (Definition of Done) cho mỗi tính năng mới

- Không làm treo UI (mọi tác vụ nặng phải chạy trong thread nền).
- Có xử lý lỗi (try/except) và thông báo cho người dùng khi thất bại.
- Không phá vỡ luồng hiện có (chọn video → nhận dạng → copy/lưu vẫn hoạt động bình thường).
- Cập nhật `build.bat` nếu tính năng mới cần thêm dependency.
