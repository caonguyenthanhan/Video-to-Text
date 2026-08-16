import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from agent import get_local_llm

def test():
    llm = get_local_llm()
    prompt = """Bạn là một bộ lọc hậu kỳ nhận diện giọng nói (STT Corrector).
Nhiệm vụ: Sửa các lỗi do máy nghe nhầm âm thanh.
Quy tắc: Giữ nguyên ý nghĩa gốc 100%. Không thêm bớt văn bản linh tinh.

Văn bản gốc: [00:00] Người ta hay nói là một người nói mình thì có thể không sao, nhưng mà mười người nói mình là chắc chắn có sao.

Sửa lại thành:"""
    
    print("Đang gọi LLM...")
    result = llm.invoke(prompt)
    print(f"RAW OUTPUT:\n{result}")

if __name__ == "__main__":
    test()
