# Trong thực tế, ta sử dụng semantic_router với HuggingFaceEncoder:
# from semantic_router import Route, RouteLayer
# from semantic_router.encoders import HuggingFaceEncoder
# encoder = HuggingFaceEncoder(name="intfloat/multilingual-e5-small")

def route_intent(text: str) -> str:
    """
    Semantic Router phân luồng đầu vào.
    Nếu phát hiện từ vựng dị thường/phương ngữ -> Route qua RAG.
    Ngược lại -> Route qua Normal Correction.
    (Đang dùng Keyword Matching để giả lập Semantic Router tránh tải model nặng)
    """
    rag_keywords = ["chằm dằm", "cọc cọc", "chằm bự", "mươi", "ăn"]
    
    if any(k in text.lower() for k in rag_keywords):
        return "rag_dialect"
    
    return "normal_correction"
