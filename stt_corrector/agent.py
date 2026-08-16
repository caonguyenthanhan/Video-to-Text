from langchain_community.llms.llamacpp import LlamaCpp
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableSerializable
from schemas import STTCorrectionResponse
from config import settings

def get_local_llm() -> LlamaCpp:
    """Khởi tạo Local LLM engine qua llama.cpp"""
    return LlamaCpp(
        model_path=settings.model_path,
        temperature=settings.temperature,
        repeat_penalty=settings.repeat_penalty,
        max_tokens=settings.max_tokens,
        n_ctx=2048,
        stop=["<end_of_turn>", "<eos>", "<|im_end|>"],
        echo=False,
        verbose=False 
    )

def build_correction_chain() -> RunnableSerializable:
    """Xây dựng chuỗi LCEL Chain xử lý STT"""
    llm = get_local_llm()
    parser = JsonOutputParser(pydantic_object=STTCorrectionResponse)

    CORRECTION_PROMPT = """<start_of_turn>user
Bạn là một bộ lọc hậu kỳ nhận diện giọng nói (STT Corrector).
Nhiệm vụ: Sửa các lỗi do máy nghe nhầm âm thanh (ví dụ: "mươi" -> "mười", "xung quanh ăn" -> "xung quanh anh", "1 triệu đời" -> "mục tiêu cuộc đời").
Quy tắc:
1. TUYỆT ĐỐI KHÔNG làm mất văn phong nói tự nhiên, không biến ngôn ngữ nói thành văn viết văn chương cứng nhắc.
2. KHÔNG tự ý sáng tạo nội dung mới hoặc lặp lại câu chữ.
3. Giữ nguyên ý nghĩa gốc 100%.

Ví dụ:
Input: "khi anh có 1 cái đặc tính nào đó mà người xung quanh ăn..."
Output: "khi anh có một cái đặc tính nào đó mà người xung quanh anh..."

Chỉ trả về JSON hợp lệ, không kèm theo văn bản nào khác.

Văn bản gốc: {raw_text}

Định dạng JSON yêu cầu:
{format_instructions}
<end_of_turn>
<start_of_turn>model
"""

    prompt = PromptTemplate(
        template=CORRECTION_PROMPT,
        input_variables=["raw_text"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )

    # LCEL Pipeline
    chain = prompt | llm | parser
    return chain
