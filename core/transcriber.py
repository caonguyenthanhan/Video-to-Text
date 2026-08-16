import threading
import subprocess
import os

try:
    from faster_whisper import WhisperModel
except ImportError:
    WhisperModel = None

# Tích hợp đường dẫn cho STT Corrector
import sys
stt_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "stt_corrector")
if stt_dir not in sys.path:
    sys.path.append(stt_dir)

try:
    from graph import build_graph
except ImportError:
    build_graph = None

def get_video_duration(video_path):
    """Lấy thời lượng video bằng ffprobe để tính progress % thực tế."""
    try:
        # Require ffprobe in PATH
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries",
             "format=duration", "-of",
             "default=noprint_wrappers=1:nokey=1", video_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT
        )
        return float(result.stdout)
    except Exception:
        return 0.0

class Transcriber:
    def __init__(self):
        self._lock = threading.Lock()
        self._state = self._fresh_state()
        self.segments_data = [] # Lưu trữ để xuất SRT sau

    @staticmethod
    def _fresh_state():
        return {
            "status": "",
            "text": "",
            "done": False,
            "error": None,
            "running": False,
            "progress": 0.0
        }

    def get_state(self):
        with self._lock:
            return dict(self._state)

    def start_transcription(self, video_path, model_size, language, use_gpu=False):
        if WhisperModel is None:
            with self._lock:
                self._state = self._fresh_state()
                self._state["error"] = "Chưa cài faster-whisper. Chạy: pip install faster-whisper"
                self._state["done"] = True
            return False

        with self._lock:
            self._state = self._fresh_state()
            self._state["running"] = True
            self._state["status"] = "Đang tải model..."
            self.segments_data = []

        threading.Thread(
            target=self._run_transcription,
            args=(video_path, model_size, language, use_gpu),
            daemon=True,
        ).start()
        return True

    def _run_transcription(self, video_path, model_size, language, use_gpu):
        try:
            device = "cuda" if use_gpu else "cpu"
            compute_type = "float16" if use_gpu else "int8"
            
            # Fallback nếu cuda fail
            try:
                model = WhisperModel(model_size, device=device, compute_type=compute_type)
            except Exception:
                # Nếu gpu lỗi (thiếu thư viện, v.v..), lùi về cpu
                model = WhisperModel(model_size, device="cpu", compute_type="int8")

            with self._lock:
                self._state["status"] = "Đang lấy thông tin video..."

            total_duration = get_video_duration(video_path)

            with self._lock:
                self._state["status"] = "Đang nhận dạng giọng nói..."

            lang = None if language == "auto" else language
            segments, info = model.transcribe(
                video_path,
                language=lang,
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=500),
                condition_on_previous_text=False,
                beam_size=5,
            )

            full_text = ""
            for segment in segments:
                full_text += segment.text.strip() + " "
                self.segments_data.append(segment)
                
                with self._lock:
                    self._state["text"] = full_text
                    
                    if total_duration > 0:
                        progress = min((segment.end / total_duration) * 100, 100.0)
                        self._state["progress"] = round(progress, 2)
                        self._state["status"] = f"Đang xử lý... ({progress:.1f}%)"
                    else:
                        self._state["status"] = f"Đang xử lý... ({segment.end:.0f}s)"

            detected = getattr(info, "language", lang or "unknown")
            with self._lock:
                self._state["status"] = f"Đang tối ưu ngữ âm bằng AI (LangGraph)..."

            # --- TÍCH HỢP AI CORRECTOR ---
            if build_graph is not None:
                try:
                    stt_graph = build_graph()
                    final_state = stt_graph.invoke({"raw_text": full_text})
                    corrected_text = " ".join(final_state.get("corrected_chunks", []))
                    if corrected_text.strip():
                        full_text = corrected_text
                        with self._lock:
                            self._state["text"] = full_text
                except Exception as e:
                    print(f"Lỗi AI Corrector (Fallback to Raw Text): {e}")
            # -------------------------------

            with self._lock:
                if total_duration > 0:
                    self._state["progress"] = 100.0
                self._state["status"] = f"Hoàn tất. Ngôn ngữ: {detected}"
                self._state["done"] = True
                self._state["running"] = False

        except Exception as exc:
            with self._lock:
                self._state["error"] = str(exc)
                self._state["done"] = True
                self._state["running"] = False

    def generate_srt(self):
        """Tạo nội dung SRT từ segments đã nhận dạng."""
        def format_timestamp(seconds: float):
            hours = int(seconds // 3600)
            minutes = int((seconds % 3600) // 60)
            secs = int(seconds % 60)
            millis = int((seconds - int(seconds)) * 1000)
            return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

        srt_lines = []
        for i, segment in enumerate(self.segments_data, start=1):
            start = format_timestamp(segment.start)
            end = format_timestamp(segment.end)
            srt_lines.append(f"{i}")
            srt_lines.append(f"{start} --> {end}")
            srt_lines.append(segment.text.strip())
            srt_lines.append("")
        
        return "\n".join(srt_lines)
