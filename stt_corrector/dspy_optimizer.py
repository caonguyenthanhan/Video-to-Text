import dspy

# Định nghĩa Signature của DSPy (thay thế cho Prompt Engineering thủ công)
class STTCorrectionSignature(dspy.Signature):
    """Sửa lỗi do máy nhận diện giọng nói nhầm âm thanh, giữ nguyên ý nghĩa gốc và văn phong nói."""
    raw_text = dspy.InputField(desc="Văn bản STT bị lỗi")
    grounding_context = dspy.InputField(desc="Từ điển phương ngữ để tham chiếu (nếu có)")
    
    corrected_text = dspy.OutputField(desc="Văn bản đã được sửa lỗi")
    reasoning_log = dspy.OutputField(desc="Giải thích lý do sửa")

class STTCorrectorDSPy(dspy.Module):
    def __init__(self):
        super().__init__()
        self.prog = dspy.ChainOfThought(STTCorrectionSignature)
        
    def forward(self, raw_text: str, grounding_context: str = ""):
        return self.prog(raw_text=raw_text, grounding_context=grounding_context)

# Note: Để tự động tối ưu Prompt (Prompt Compilation), ta sẽ dùng dspy.BootstrapFewShot
# kết hợp với tập dataset mẫu trong tương lai.
