import { Rocket, Settings, Cpu, HelpCircle, ChevronDown, Mail, Activity } from "lucide-react";

export default function HelpView() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[100px] leading-[0.8] font-black tracking-tighter uppercase mb-4 text-white">Trợ <span className="text-[#FF3E00] italic">Giúp</span></h1>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="border border-white/20 p-8 hover:border-[#FF3E00] transition-colors cursor-pointer group">
          <div className="text-[40px] font-black text-[#FF3E00] mb-4">01</div>
          <h3 className="text-xl font-black uppercase tracking-wider text-white mb-3">Tải Video/Âm thanh</h3>
          <p className="text-[10px] font-mono text-white/60 leading-relaxed uppercase tracking-widest">Chọn file từ máy tính. Quá trình xử lý diễn ra trực tiếp trên trình duyệt, không upload file lên mạng.</p>
        </div>

        <div className="border border-white/20 p-8 hover:border-[#FF3E00] transition-colors cursor-pointer group">
          <div className="text-[40px] font-black text-white/40 mb-4 group-hover:text-[#FF3E00] transition-colors">02</div>
          <h3 className="text-xl font-black uppercase tracking-wider text-white mb-3">Tải Mô Hình AI</h3>
          <p className="text-[10px] font-mono text-white/60 leading-relaxed uppercase tracking-widest">Lần đầu tiên, trình duyệt sẽ tải mô hình AI vào bộ nhớ đệm (khoảng 40-70MB).</p>
        </div>

        <div className="border border-white/20 p-8 hover:border-[#FF3E00] transition-colors cursor-pointer group">
          <div className="text-[40px] font-black text-white/40 mb-4 group-hover:text-[#FF3E00] transition-colors">03</div>
          <h3 className="text-xl font-black uppercase tracking-wider text-white mb-3">Nhận Dạng & Xuất</h3>
          <p className="text-[10px] font-mono text-white/60 leading-relaxed uppercase tracking-widest">Trình duyệt sẽ tự động bóc băng và hiển thị văn bản khi hoàn tất.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* FAQ Accordion */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-8 border-b border-white/20 pb-4">Câu hỏi thường gặp</h3>

          {[
            "Dữ liệu của tôi có bị tải lên mạng không?",
            "Tại sao lần đầu sử dụng lại chậm?",
            "Làm thế nào để xóa bộ nhớ đệm (cache) AI?",
            "Ứng dụng có hỗ trợ xử lý trên điện thoại không?"
          ].map((question, i) => (
            <div key={i} className="border-b border-white/10 pb-4 cursor-pointer group">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white/60 group-hover:text-[#FF3E00] transition-colors">{question}</span>
                <span className="text-white/20 text-xl font-black group-hover:text-[#FF3E00] transition-colors">+</span>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Info */}
        <div className="space-y-8">
          <div className="border border-white/20 p-8">
            <h3 className="text-xl font-black uppercase tracking-wider text-[#FF3E00] mb-6">Thông tin kỹ thuật</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Phiên bản</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">v3.0 (Web)</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Engine</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Transformers.js</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Môi trường</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">WebAssembly</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Mô hình</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Whisper</span>
              </div>
            </div>
          </div>

          {/* System Health Banner */}
          <div className="bg-[#FF3E00]/10 border border-[#FF3E00]/30 p-8">
            <h4 className="text-xl font-black text-[#FF3E00] uppercase tracking-wider mb-2">Trạng thái Client</h4>
            <div className="flex items-center">
              <span className="text-xs font-mono text-white/80">Sẵn sàng chạy trên trình duyệt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
