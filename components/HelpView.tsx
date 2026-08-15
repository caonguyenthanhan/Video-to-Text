import { Rocket, Settings, Cpu, HelpCircle, ChevronDown, Mail, Activity } from "lucide-react";

export default function HelpView() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[100px] leading-[0.8] font-black tracking-tighter uppercase mb-4 text-white">Trợ <span className="text-[#FF3E00] italic">Giúp</span></h1>
        </div>
        <button className="bg-white text-black hover:bg-[#FF3E00] hover:text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-colors mt-8">
          Liên hệ
        </button>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="border border-white/20 p-8 hover:border-[#FF3E00] transition-colors cursor-pointer group">
          <div className="text-[40px] font-black text-[#FF3E00] mb-4">01</div>
          <h3 className="text-xl font-black uppercase tracking-wider text-white mb-3">Hướng dẫn nhanh</h3>
          <p className="text-[10px] font-mono text-white/60 leading-relaxed uppercase tracking-widest">Bắt đầu với quy trình chuyển đổi cơ bản, từ tải video đến xuất văn bản.</p>
        </div>

        <div className="border border-white/20 p-8 hover:border-[#FF3E00] transition-colors cursor-pointer group">
          <div className="text-[40px] font-black text-white/40 mb-4 group-hover:text-[#FF3E00] transition-colors">02</div>
          <h3 className="text-xl font-black uppercase tracking-wider text-white mb-3">Cấu hình FFmpeg</h3>
          <p className="text-[10px] font-mono text-white/60 leading-relaxed uppercase tracking-widest">Hướng dẫn chi tiết cách cài đặt và kết nối FFmpeg để xử lý media.</p>
        </div>

        <div className="border border-white/20 p-8 hover:border-[#FF3E00] transition-colors cursor-pointer group">
          <div className="text-[40px] font-black text-white/40 mb-4 group-hover:text-[#FF3E00] transition-colors">03</div>
          <h3 className="text-xl font-black uppercase tracking-wider text-white mb-3">Tối ưu hóa GPU</h3>
          <p className="text-[10px] font-mono text-white/60 leading-relaxed uppercase tracking-widest">Cấu hình CUDA và cuDNN để tăng tốc độ nhận dạng bằng card đồ họa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* FAQ Accordion */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-8 border-b border-white/20 pb-4">Câu hỏi thường gặp</h3>

          {[
            "Làm thế nào để tăng tốc độ nhận dạng?",
            "Tại sao tôi không thấy tùy chọn CUDA?",
            "Làm thế nào để cài đặt FFmpeg?",
            "Ứng dụng có hỗ trợ xử lý hàng loạt không?"
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
                <span className="text-[10px] font-black uppercase tracking-widest text-white">v2.4.0-STABLE</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Engine</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Faster-Whisper</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Môi trường</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Python 3.10+</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Xử lý Media</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">FFmpeg</span>
              </div>
              
              <button className="w-full mt-6 py-3 border border-[#FF3E00] text-[#FF3E00] text-[10px] font-black uppercase tracking-widest hover:bg-[#FF3E00] hover:text-white transition-colors">
                Kiểm tra cập nhật
              </button>
            </div>
          </div>

          {/* System Health Banner */}
          <div className="bg-[#FF3E00]/10 border border-[#FF3E00]/30 p-8">
            <h4 className="text-xl font-black text-[#FF3E00] uppercase tracking-wider mb-2">System Health</h4>
            <div className="flex items-center">
              <span className="text-xs font-mono text-white/80">Tất cả dịch vụ hoạt động bình thường</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
