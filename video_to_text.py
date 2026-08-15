"""
Video -> Text (nhận dạng giọng nói)

Cài đặt trước khi chạy:
    pip install faster-whisper

Cần có ffmpeg trong PATH:
    - Windows: tải tại https://ffmpeg.org/download.html rồi thêm vào PATH
    - macOS:   brew install ffmpeg
    - Linux:   sudo apt install ffmpeg

Chạy:
    python video_to_text.py
"""

import os
import threading
import queue
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext, ttk

try:
    from faster_whisper import WhisperModel
except ImportError:
    WhisperModel = None


class TranscriberApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Video -> Text (Nhận dạng giọng nói)")
        self.root.geometry("720x560")

        self.video_path = None
        self.result_queue = queue.Queue()

        self._build_ui()
        self.root.after(100, self._poll_queue)

    def _build_ui(self):
        top = ttk.Frame(self.root, padding=10)
        top.pack(fill="x")

        self.file_label = ttk.Label(top, text="Chưa chọn video", foreground="gray")
        self.file_label.pack(side="left", fill="x", expand=True)

        ttk.Button(top, text="Chọn video...", command=self.choose_file).pack(side="right")

        opts = ttk.Frame(self.root, padding=(10, 0))
        opts.pack(fill="x")

        ttk.Label(opts, text="Model:").pack(side="left")
        self.model_var = tk.StringVar(value="small")
        ttk.Combobox(
            opts, textvariable=self.model_var, state="readonly", width=10,
            values=["tiny", "base", "small", "medium", "large-v3"],
        ).pack(side="left", padx=(4, 16))

        ttk.Label(opts, text="Ngôn ngữ:").pack(side="left")
        self.lang_var = tk.StringVar(value="auto")
        ttk.Combobox(
            opts, textvariable=self.lang_var, state="readonly", width=10,
            values=["auto", "vi", "en", "ja", "ko", "zh", "fr", "es"],
        ).pack(side="left", padx=4)

        action = ttk.Frame(self.root, padding=10)
        action.pack(fill="x")

        self.start_btn = ttk.Button(action, text="Bắt đầu nhận dạng", command=self.start_transcription)
        self.start_btn.pack(side="left")

        self.progress = ttk.Progressbar(action, mode="indeterminate")
        self.progress.pack(side="left", fill="x", expand=True, padx=10)

        self.status_label = ttk.Label(self.root, text="", padding=(10, 0))
        self.status_label.pack(fill="x")

        text_frame = ttk.Frame(self.root, padding=10)
        text_frame.pack(fill="both", expand=True)

        self.text_box = scrolledtext.ScrolledText(text_frame, wrap="word")
        self.text_box.pack(fill="both", expand=True)

        bottom = ttk.Frame(self.root, padding=10)
        bottom.pack(fill="x")

        self.save_btn = ttk.Button(bottom, text="Lưu văn bản (.txt)", command=self.save_text, state="disabled")
        self.save_btn.pack(side="right")

        self.copy_btn = ttk.Button(bottom, text="Copy", command=self.copy_text, state="disabled")
        self.copy_btn.pack(side="right", padx=(0, 8))

        self.copy_btn = ttk.Button(bottom, text="Copy văn bản", command=self.copy_text, state="disabled")
        self.copy_btn.pack(side="right", padx=(0, 8))

    def choose_file(self):
        path = filedialog.askopenfilename(
            title="Chọn file video",
            filetypes=[
                ("Video files", "*.mp4 *.mkv *.mov *.avi *.webm *.flv *.wmv"),
                ("Tất cả file", "*.*"),
            ],
        )
        if path:
            self.video_path = path
            self.file_label.config(text=os.path.basename(path), foreground="black")

    def start_transcription(self):
        if not self.video_path:
            messagebox.showwarning("Thiếu video", "Vui lòng chọn một file video trước.")
            return
        if WhisperModel is None:
            messagebox.showerror(
                "Thiếu thư viện",
                "Chưa cài faster-whisper.\nChạy: pip install faster-whisper",
            )
            return

        self.start_btn.config(state="disabled")
        self.save_btn.config(state="disabled")
        self.copy_btn.config(state="disabled")
        self.text_box.delete("1.0", tk.END)
        self.status_label.config(text="Đang xử lý, vui lòng đợi...")
        self.progress.start(10)

        threading.Thread(target=self._run_transcription, daemon=True).start()

    def _run_transcription(self):
        try:
            model_size = self.model_var.get()
            language = None if self.lang_var.get() == "auto" else self.lang_var.get()

            self.result_queue.put(("status", f"Đang tải model '{model_size}'..."))
            model = WhisperModel(model_size, device="cpu", compute_type="int8")

            self.result_queue.put(("status", "Đang nhận dạng giọng nói..."))
            segments, info = model.transcribe(self.video_path, language=language)

            for segment in segments:
                self.result_queue.put(("append", segment.text.strip() + " "))

            detected_lang = getattr(info, "language", language or "unknown")
            self.result_queue.put(("status", f"Hoàn tất. Ngôn ngữ phát hiện: {detected_lang}"))
            self.result_queue.put(("done", None))
        except Exception as exc:
            self.result_queue.put(("error", str(exc)))

    def _poll_queue(self):
        try:
            while True:
                kind, payload = self.result_queue.get_nowait()
                if kind == "status":
                    self.status_label.config(text=payload)
                elif kind == "append":
                    self.text_box.insert(tk.END, payload)
                    self.text_box.see(tk.END)
                elif kind == "done":
                    self.progress.stop()
                    self.start_btn.config(state="normal")
                    self.save_btn.config(state="normal")
                    self.copy_btn.config(state="normal")
                elif kind == "error":
                    self.progress.stop()
                    self.start_btn.config(state="normal")
                    self.status_label.config(text="Đã xảy ra lỗi.")
                    messagebox.showerror("Lỗi", payload)
        except queue.Empty:
            pass
        self.root.after(100, self._poll_queue)

    def copy_text(self):
        content = self.text_box.get("1.0", tk.END).strip()
        if not content:
            messagebox.showinfo("Trống", "Chưa có nội dung để copy.")
            return
        self.root.clipboard_clear()
        self.root.clipboard_append(content)
        self.status_label.config(text="Đã copy văn bản vào clipboard.")

    def save_text(self):
        content = self.text_box.get("1.0", tk.END).strip()
        if not content:
            messagebox.showinfo("Trống", "Chưa có nội dung để lưu.")
            return
        default_name = os.path.splitext(os.path.basename(self.video_path or "output"))[0] + ".txt"
        path = filedialog.asksaveasfilename(
            title="Lưu văn bản",
            defaultextension=".txt",
            initialfile=default_name,
            filetypes=[("Text file", "*.txt")],
        )
        if path:
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            messagebox.showinfo("Đã lưu", f"Đã lưu văn bản vào:\n{path}")


def main():
    root = tk.Tk()
    TranscriberApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
