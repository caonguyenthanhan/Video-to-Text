import json
from config import settings

class MockVectorIndex:
    def __init__(self, dict_path: str):
        try:
            with open(dict_path, "r", encoding="utf-8") as f:
                self.mock_dict = json.load(f)
        except Exception:
            self.mock_dict = {}

    def retrieve(self, query: str) -> str:
        # Giả lập Vector Search bằng Keyword Matching thay vì bắt tải Embedding Model nặng
        contexts = []
        for slang, meaning in self.mock_dict.items():
            if slang.lower() in query.lower():
                contexts.append(f"Từ lóng/Phương ngữ: '{slang}' -> '{meaning}'")
        
        if not contexts:
            return "Không tìm thấy ngữ cảnh phương ngữ đặc biệt."
        return "\n".join(contexts)

def get_grounding_context(query: str) -> str:
    """Giả lập LlamaIndex Retrieval & Re-ranking"""
    index = MockVectorIndex(settings.dict_path)
    return index.retrieve(query)
