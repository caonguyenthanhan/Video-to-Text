import sys
import os
import time

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

try:
    from faster_whisper import WhisperModel
except ImportError:
    print("Vui lòng cài đặt faster-whisper: pip install faster-whisper")
    sys.exit(1)

def test_transcribe():
    video_path = r"D:\desktop\Video-to-Text\case\test1.mp4"
    if not os.path.exists(video_path):
        print(f"Không tìm thấy video tại {video_path}")
        return

    print("Đang tải WhisperModel (base)...")
    # Sử dụng 'base' hoặc 'small' để test nhanh
    model = WhisperModel("base", device="cpu", compute_type="int8")

    print(f"Đang bóc băng video: {video_path}")
    start_time = time.time()
    
    segments, info = model.transcribe(
        video_path,
        language="vi",
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=500),
        condition_on_previous_text=False,
        beam_size=5,
    )

    full_text = ""
    for segment in segments:
        print(f"[{segment.start:.2f}s - {segment.end:.2f}s] {segment.text}")
        full_text += segment.text.strip() + " "

    elapsed = time.time() - start_time
    print(f"\nHoàn tất trong {elapsed:.2f} giây.")
    
    out_path = r"D:\desktop\Video-to-Text\case\result_whisper_optimized.txt"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_text)
    print(f"Đã lưu kết quả raw STT (tối ưu VAD) tại: {out_path}")

if __name__ == "__main__":
    test_transcribe()
