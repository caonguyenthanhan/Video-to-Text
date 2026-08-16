from pydantic import BaseModel, Field
from typing import TypedDict, List

class STTCorrectionRequest(BaseModel):
    raw_text: str = Field(..., description="Văn bản STT bị lỗi (raw text) cần được làm sạch", min_length=2, max_length=10000)

class STTCorrectionResponse(BaseModel):
    corrected_text: str = Field(..., description="Văn bản đã được sửa lỗi chính tả và từ lóng")
    reasoning_log: str = Field(..., description="Giải thích ngắn gọn lý do tại sao lại sửa các từ đó")

class GraphState(TypedDict):
    raw_text: str
    chunks: List[str]
    current_chunk_index: int
    intent: str
    grounding_context: str
    corrected_chunks: List[str]
    reasoning_logs: List[str]
    eval_score: float
    loop_count: int
    is_sufficient: bool
    final_answer: str
