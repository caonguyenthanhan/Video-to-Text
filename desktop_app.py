"""
Video -> Text desktop app - BACKEND (Python)
Phiên bản Desktop: Sử dụng pywebview để hiển thị giao diện Next.js tĩnh.
"""

import os
import sys
import webview
from core.transcriber import Transcriber

def resource_path(relative_path):
    """
    Trả về đường dẫn đúng tới file tài nguyên (vd: out/index.html).
    """
    base_path = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)

class DesktopApi:
    def __init__(self):
        self.window = None
        self.transcriber = Transcriber()

    def set_window(self, window):
        self.window = window

    # ---------------------------------------------------------------
    # Các API JS gọi thông qua window.pywebview.api.*
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

    def start_transcription(self, video_path, model_size, language, use_gpu=False):
        """Bắt đầu tiến trình."""
        success = self.transcriber.start_transcription(video_path, model_size, language, use_gpu)
        return {"ok": success}

    def get_status(self):
        """Lấy tiến độ."""
        return self.transcriber.get_state()

    def save_text(self, content, default_name):
        """Lưu TXT."""
        path = self.window.create_file_dialog(
            webview.SAVE_DIALOG, save_filename=default_name or "transcript.txt"
        )
        if not path:
            return {"ok": False}
        target = path if isinstance(path, str) else path[0]
        with open(target, "w", encoding="utf-8") as f:
            f.write(content)
        return {"ok": True, "path": target}

    def save_srt(self, default_name):
        """Xuất SRT."""
        path = self.window.create_file_dialog(
            webview.SAVE_DIALOG, save_filename=default_name or "transcript.srt"
        )
        if not path:
            return {"ok": False}
        target = path if isinstance(path, str) else path[0]
        
        srt_content = self.transcriber.generate_srt()
        with open(target, "w", encoding="utf-8") as f:
            f.write(srt_content)
        return {"ok": True, "path": target}

def main():
    api = DesktopApi()
    
    # Load thư mục out của Next.js (chỉ khi build xong)
    html_path = resource_path(os.path.join("out", "index.html"))
    if not os.path.exists(html_path):
        # Fallback tạo một trang trắng báo lỗi
        with open("fallback.html", "w", encoding="utf-8") as f:
            f.write("<h1>Loi: Khong tim thay thu muc out/. Ban da build Next.js chua?</h1>")
        html_path = "fallback.html"

    window = webview.create_window(
        "Video -> Text Pro",
        html_path,
        js_api=api,
        width=1024,
        height=768,
        min_size=(800, 600),
    )
    api.set_window(window)
    webview.start()

if __name__ == "__main__":
    main()
