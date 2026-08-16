from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
import uvicorn
import os
import uuid
import shutil

from core.transcriber import Transcriber

app = FastAPI(title="VideoToText API")

# Cho phép CORS để UI Next.js (port 3000) có thể gọi được API (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

transcriber = Transcriber()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    model: str = Form("small"),
    language: str = Form("auto"),
    use_gpu: bool = Form(False)
):
    """Nhận file upload và khởi chạy tiến trình nền."""
    # Lưu file tạm
    ext = os.path.splitext(file.filename)[1]
    temp_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}{ext}")
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Chạy transcriber
    success = transcriber.start_transcription(
        video_path=temp_path,
        model_size=model,
        language=language,
        use_gpu=use_gpu
    )
    
    return {"ok": success, "message": "Started transcription"}

@app.get("/api/status")
def get_status():
    """Trả về trạng thái tiến trình hiện tại."""
    state = transcriber.get_state()
    return state

@app.get("/api/download-srt")
def download_srt():
    """Tải về kết quả SRT."""
    srt_content = transcriber.generate_srt()
    return PlainTextResponse(
        content=srt_content,
        headers={"Content-Disposition": 'attachment; filename="transcript.srt"'}
    )

if __name__ == "__main__":
    print("Starting Web Server on http://localhost:8000")
    uvicorn.run("web_server:app", host="0.0.0.0", port=8000, reload=True)
