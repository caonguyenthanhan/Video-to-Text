import uvicorn
from fastapi import FastAPI, HTTPException
from schemas import STTCorrectionRequest, STTCorrectionResponse
from graph import build_graph
from config import settings
from langsmith import traceable

app = FastAPI(title="Multi-Agent STT Corrector API", description="Hệ thống AI sửa ngữ âm với LangGraph & LlamaIndex")
stt_graph = build_graph()

@app.post("/api/v1/correct", response_model=STTCorrectionResponse)
@traceable(name="Multi-Agent-STT-Correction")
async def correct_stt(request: STTCorrectionRequest) -> STTCorrectionResponse:
    try:
        # LangGraph Invoke
        initial_state = {"raw_text": request.raw_text}
        final_state = stt_graph.invoke(initial_state)
        
        final_text = " ".join(final_state.get("corrected_chunks", []))
        final_log = " | ".join(final_state.get("reasoning_logs", []))
        
        return STTCorrectionResponse(
            corrected_text=final_text,
            reasoning_log=final_log
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Graph Execution Error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host=settings.api_host, port=settings.api_port)
