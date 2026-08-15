import { UploadCloud, Settings2, Cpu, Video, Search, Copy, Save, FileText } from "lucide-react";

export default function ConvertView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Column - Controls */}
      <div className="lg:col-span-4 space-y-6">
        {/* Upload Card */}
        <div className="border border-white/20 p-8 flex flex-col items-center justify-center text-center space-y-6 relative group overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="w-20 h-20 bg-white/5 flex items-center justify-center mb-2">
            <UploadCloud className="w-10 h-10 text-white/40 group-hover:text-[#FF3E00] transition-colors" />
          </div>
          <div>
            <h3 className="font-black text-white text-xl uppercase tracking-tighter mb-2">Tải video lên</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">Kéo thả file video vào đây<br/>hoặc nhấn nút bên dưới</p>
          </div>
          <button className="bg-white text-black hover:bg-[#FF3E00] hover:text-white font-black text-[10px] uppercase tracking-widest py-3 px-8 transition-colors mt-4">
            Chọn Video
          </button>
        </div>

        {/* Config Card */}
        <div className="border border-white/20 p-8 space-y-8">
          <div className="flex items-center text-white font-black uppercase tracking-tighter text-xl pb-4 border-b border-white/20">
            Cấu hình hệ thống
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Mô hình nhận dạng</label>
              <select className="w-full bg-transparent border-b border-white/20 text-white py-2 text-sm font-bold focus:outline-none focus:border-[#FF3E00] appearance-none cursor-pointer">
                <option className="bg-[#0A0A0A]">Whisper Medium (Cân bằng)</option>
                <option className="bg-[#0A0A0A]">Whisper Large v3 (Chính xác)</option>
                <option className="bg-[#0A0A0A]">Whisper Base (Nhanh)</option>
              </select>
              <p className="text-[10px] text-white/40 mt-2 font-mono">Mô hình càng lớn độ chính xác càng cao.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Ngôn ngữ nguồn</label>
              <select className="w-full bg-transparent border-b border-white/20 text-white py-2 text-sm font-bold focus:outline-none focus:border-[#FF3E00] appearance-none cursor-pointer">
                <option className="bg-[#0A0A0A]">Tự động phát hiện (Auto)</option>
                <option className="bg-[#0A0A0A]">Tiếng Việt</option>
                <option className="bg-[#0A0A0A]">Tiếng Anh</option>
              </select>
            </div>

            <div className="flex items-start space-x-4 pt-4">
              <input type="checkbox" defaultChecked className="mt-0.5 w-4 h-4 appearance-none border border-white/40 checked:bg-[#FF3E00] checked:border-[#FF3E00] cursor-pointer" />
              <div>
                <label className="text-xs font-bold text-white block uppercase tracking-widest">Sử dụng GPU (CUDA)</label>
                <p className="text-[10px] text-white/40 mt-1 font-mono">Tăng tốc độ xử lý lên đến 10x.</p>
              </div>
            </div>
          </div>

          <button className="w-full border border-white/20 hover:border-[#FF3E00] hover:bg-[#FF3E00] hover:text-white text-white font-black text-[10px] uppercase tracking-widest py-4 transition-all">
            Bắt đầu nhận dạng
          </button>
        </div>
      </div>

      {/* Right Column - Results */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        {/* Progress Card */}
        <div className="border border-white/20 p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-6">
            <div className="text-[40px] font-black text-white leading-none">01</div>
            <div>
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-white mb-1">Tiến trình xử lý</h4>
              <p className="text-white/40 text-[10px] font-mono">Đoạn 3/10 (00:05:20 - 00:08:45)</p>
            </div>
          </div>
          <div className="w-1/2 flex items-center space-x-6">
            <div className="flex-1 h-1 bg-white/10">
              <div className="h-full bg-[#FF3E00] w-[45%]"></div>
            </div>
            <span className="text-white font-black text-xl">45%</span>
          </div>
        </div>

        {/* Transcript Card */}
        <div className="border border-white/20 flex flex-col flex-1 min-h-[400px]">
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/20 flex items-center justify-between shrink-0">
            <div className="font-black text-xl text-white uppercase tracking-tighter">
              Kết quả
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="text" 
                  placeholder="TÌM KIẾM..." 
                  className="bg-transparent border-b border-white/20 py-1 pl-6 pr-2 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#FF3E00] text-white w-48 placeholder:text-white/40"
                />
              </div>
              <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-[#FF3E00]">
                <span className="w-1.5 h-1.5 bg-[#FF3E00] mr-2 animate-pulse"></span>
                Live Streaming
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto flex-1 space-y-6 text-sm text-[#E0E0E0] font-sans">
            <p><span className="text-[#FF3E00] font-mono font-bold mr-4">[00:00:00]</span>Chào mừng các bạn đến với video hướng dẫn cài đặt môi trường lập trình Python trên hệ điều hành Windows.</p>
            <p><span className="text-[#FF3E00] font-mono font-bold mr-4">[00:00:15]</span>Trong video này, mình sẽ hướng dẫn chi tiết từng bước để các bạn có thể tự thiết lập một môi trường làm việc chuẩn chỉ, tránh các lỗi lặt vặt về sau.</p>
            <p><span className="text-[#FF3E00] font-mono font-bold mr-4">[00:00:32]</span>Đầu tiên, chúng ta cần tải bộ cài đặt Python từ trang chủ chính thức python.org. Các bạn nhớ chọn phiên bản phù hợp với hệ điều hành đang sử dụng nhé.</p>
            <p><span className="text-[#FF3E00] font-mono font-bold mr-4">[00:00:50]</span>Trong quá trình cài đặt, có một bước cực kỳ quan trọng mà rất nhiều bạn mới học thường bỏ qua, đó là tích chọn vào ô "Add Python to PATH".</p>
            <p><span className="text-[#FF3E00] font-mono font-bold mr-4">[00:01:10]</span>Nếu không chọn mục này, sau này khi bạn mở Command Prompt hoặc PowerShell lên gõ lệnh 'python', hệ thống sẽ báo lỗi không tìm thấy.</p>
            <p className="opacity-40"><span className="text-[#FF3E00] font-mono font-bold mr-4">[00:01:25]</span>Và tiếp theo...</p>
          </div>

          {/* Footer Controls */}
          <div className="px-8 py-6 border-t border-white/20 flex items-center justify-between bg-[#0A0A0A] shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center space-x-4">
              <span>Từ: 245</span>
              <span className="text-[#FF3E00]">/</span>
              <span>Thời lượng xử lý: 00:01:12</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-[#FF3E00] transition-colors">
                Sao chép
              </button>
              <button className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-[#FF3E00] transition-colors">
                Lưu TXT
              </button>
              <button className="bg-white text-black hover:bg-[#FF3E00] hover:text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors">
                Xuất SRT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
