"""
Video -> Text desktop app - BACKEND (Python)
UI (HTML/CSS/JS) nằm trong thư mục web/, hiển thị qua pywebview.

Cách hoạt động:
    - pywebview mở 1 cửa sổ desktop native, load file web/index.html
    - JS trong index.html/app.js gọi các hàm Python qua:
          window.pywebview.api.<ten_ham>(...)
      (mọi hàm public trong class Api bên dưới đều gọi được từ JS)
    - Python trả kết quả về cho JS dưới dạng Promise (async/await trong JS)

Cài đặt:
    pip install pywebview faster-whisper

Chạy (dev, chưa đóng gói .exe):
    python backend.py

Lưu ý Windows: pywebview dùng Edge WebView2 Runtime để render UI.
Windows 10/11 bản mới thường có sẵn; nếu chưa có, tải tại:
https://developer.microsoft.com/microsoft-edge/webview2/
"""

import os
import sys
import threading
import webview

try:
    from faster_whisper import WhisperModel
except ImportError:
    WhisperModel = None


def resource_path(relative_path):
    """
    Trả về đường dẫn đúng tới file tài nguyên (vd: web/index.html),
    dù đang chạy từ source code hay từ file .exe đã đóng gói bằng PyInstaller.
    """
    base_path = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)


class Api:
    """
    Mọi method public (không bắt đầu bằng _) ở đây đều gọi được từ JS
    qua window.pywebview.api.<ten_method>(...)
    """

    def __init__(self):
        self.window = None
        self._lock = threading.Lock()
        self._state = self._fresh_state()

    def set_window(self, window):
        self.window = window

    @staticmethod
    def _fresh_state():
        return {"status": "", "text": "", "done": False, "error": None, "running": False}

    # ---------------------------------------------------------------
    # Các hàm JS sẽ gọi
    # ---------------------------------------------------------------

    def select_video(self):
        """Mở dialog chọn video (native), trả về đường dẫn hoặc None."""
        file_types = (
            "Video files (*.mp4;*.mkv;*.mov;*.avi;*.webm;*.flv;*.wmv)",
            "Tất cả file (*.*)",
        )
        result = self.window.create_file_dialog(webview.OPEN_DIALOG, file_types=file_types)
        if result:
            return result[0]
        return None

    def start_transcription(self, video_path, model_size, language):
        """
        Bắt đầu nhận dạng trong thread nền, trả về ngay (không block UI).
        JS sau đó gọi get_status() định kỳ (polling) để lấy tiến độ + kết quả.
        """
        if WhisperModel is None:
            with self._lock:
                self._state = self._fresh_state()
                self._state["error"] = "Chưa cài faster-whisper. Chạy: pip install faster-whisper"
                self._state["done"] = True
            return {"ok": False}

        with self._lock:
            self._state = self._fresh_state()
            self._state["running"] = True
            self._state["status"] = "Đang tải model..."

        threading.Thread(
            target=self._run_transcription,
            args=(video_path, model_size, language),
            daemon=True,
        ).start()
        return {"ok": True}

    def get_status(self):
        """JS gọi định kỳ (setInterval) để lấy trạng thái/tiến độ hiện tại."""
        with self._lock:
            return dict(self._state)

    def save_text(self, content, default_name):
        """Mở dialog lưu file .txt, ghi nội dung, trả về đường dẫn đã lưu."""
        path = self.window.create_file_dialog(
            webview.SAVE_DIALOG, save_filename=default_name or "transcript.txt"
        )
        if not path:
            return {"ok": False}
        target = path if isinstance(path, str) else path[0]
        with open(target, "w", encoding="utf-8") as f:
            f.write(content)
        return {"ok": True, "path": target}

    # ---------------------------------------------------------------
    # Nội bộ - chạy trong thread nền
    # ---------------------------------------------------------------

    def _run_transcription(self, video_path, model_size, language):
        try:
            model = WhisperModel(model_size, device="cpu", compute_type="int8")
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
                with self._lock:
                    self._state["text"] = full_text
                    self._state["status"] = f"Đang xử lý... ({segment.end:.0f}s)"

            detected = getattr(info, "language", lang or "unknown")
            with self._lock:
                self._state["status"] = f"Hoàn tất. Ngôn ngữ phát hiện: {detected}"
                self._state["done"] = True
                self._state["running"] = False
        except Exception as exc:
            with self._lock:
                self._state["error"] = str(exc)
                self._state["done"] = True
                self._state["running"] = False


def main():
    api = Api()
    window = webview.create_window(
        "Video -> Text",
        resource_path("web/index.html"),
        js_api=api,
        width=820,
        height=680,
        min_size=(600, 500),
    )
    api.set_window(window)
    webview.start()


if __name__ == "__main__":
    main()
