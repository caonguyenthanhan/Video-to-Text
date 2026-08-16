import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from graph import build_graph

def test():
    stt_graph = build_graph()
    
    with open(r"D:\desktop\Video-to-Text\case\result.txt", "r", encoding="utf-8") as f:
        raw_text = f.read()
    
    print("Khởi chạy LangGraph Multi-Agent Workflow...")
    initial_state = {"raw_text": raw_text}
    
    final_state = stt_graph.invoke(initial_state)
    
    final_text = " ".join(final_state.get("corrected_chunks", []))
    final_log = "\n".join(final_state.get("reasoning_logs", []))
    
    out_path = r"D:\desktop\Video-to-Text\case\result_graph_corrected.txt"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(final_text)
        f.write("\n\n--- REASONING LOG (LangGraph) ---\n")
        f.write(final_log)
        
    print(f"\nHoàn tất Multi-Agent Workflow! Đã lưu kết quả tại {out_path}")

if __name__ == "__main__":
    test()
