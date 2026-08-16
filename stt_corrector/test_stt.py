import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
from main import chunk_text, chain

def test():
    with open(r"D:\desktop\Video-to-Text\case\result.txt", "r", encoding="utf-8") as f:
        raw_text = f.read()
    
    chunks = chunk_text(raw_text, max_words=250)
    final_text = []
    final_log = []
    
    print(f"Bắt đầu sửa lỗi STT với {len(chunks)} blocks...")
    for i, chunk in enumerate(chunks):
        print(f"Đang xử lý block {i+1} / {len(chunks)}...")
        try:
            result = chain.invoke({"raw_text": chunk})
            if not isinstance(result, dict):
                print(f"  -> Cảnh báo: LLM trả về không phải dictionary: {result}")
                result = {}
        except Exception as e:
            print(f"  -> Lỗi parse output từ LLM: {e}")
            result = {}
            
        final_text.append(result.get("corrected_text", ""))
        final_log.append(result.get("reasoning_log", ""))
        print(f"  -> Log block {i+1}: {result.get('reasoning_log', '')}")
    
    corrected = "\n\n".join(final_text)
    log_str = "\n".join(final_log)
    
    out_path = r"D:\desktop\Video-to-Text\case\result_corrected.txt"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(corrected)
        f.write("\n\n--- REASONING LOG ---\n")
        f.write(log_str)
        
    print(f"\nHoàn tất! Đã lưu kết quả tại {out_path}")

if __name__ == "__main__":
    test()
