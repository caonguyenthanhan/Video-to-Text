import { Cpu, Folder, CheckCircle2, Circle, Download, Monitor, Globe, Settings2, Code, MoveRight, Search } from "lucide-react";

export default function ConfigView() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[100px] leading-[0.8] font-black tracking-tighter uppercase mb-4 text-white">Cấu <span className="text-[#FF3E00] italic">Hình</span></h1>
        </div>
        <div className="flex space-x-6 mt-8">
          <button className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            Mặc định
          </button>
          <button className="bg-white text-black hover:bg-[#FF3E00] hover:text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors">
            Lưu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 mt-12">
        {/* Left Column - Models & Output */}
        <div className="xl:col-span-2 space-y-12">
          {/* AI Model Management */}
          <div className="border-t border-white/20 pt-8">
            <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-8">Model AI</h3>
            
            <div className="space-y-8">
              {/* Directory path */}
              <div>
                <label className="block text-[10px] font-bold text-[#FF3E00] uppercase tracking-widest mb-3">Thư mục lưu trữ</label>
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      defaultValue="C:\Users\Admin\AppData\Local\VideoToText\models" 
                      className="w-full bg-transparent border-b border-white/20 text-white font-mono py-2 focus:outline-none focus:border-[#FF3E00] text-sm"
                    />
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-[#FF3E00] transition-colors whitespace-nowrap">
                    Duyệt...
                  </button>
                </div>
              </div>

              {/* Local Models List */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-[10px] font-bold text-[#FF3E00] uppercase tracking-widest">Mô hình cục bộ</label>
                  <button className="text-[10px] text-white hover:text-[#FF3E00] uppercase tracking-widest font-bold">
                    Tải thêm
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-white/10 hover:border-white/30 transition-colors">
                    <div className="flex items-center">
                      <div className="text-[24px] font-black text-white mr-6">TINY</div>
                      <div>
                        <p className="text-[10px] font-mono text-white/60">39M params • ~150MB VRAM • Rất nhanh</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#FF3E00]">SẴN SÀNG</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-white/10 hover:border-white/30 transition-colors">
                    <div className="flex items-center">
                      <div className="text-[24px] font-black text-white mr-6">BASE</div>
                      <div>
                        <p className="text-[10px] font-mono text-white/60">74M params • ~280MB VRAM • Nhanh</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#FF3E00]">SẴN SÀNG</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-white/5 opacity-50">
                    <div className="flex items-center">
                      <div className="text-[24px] font-black text-white mr-6">SMALL</div>
                      <div>
                        <p className="text-[10px] font-mono text-white/60">244M params • ~800MB VRAM • Cân bằng</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-white border border-white/20 px-4 py-1 hover:border-white transition-colors">
                       TẢI 466 MB
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Settings */}
          <div className="border-t border-white/20 pt-8">
            <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-8">Xuất file</h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-[#FF3E00] uppercase tracking-widest mb-3">Định dạng</label>
                <select className="w-full bg-transparent border-b border-white/20 text-white font-bold py-2 focus:outline-none focus:border-[#FF3E00] appearance-none cursor-pointer">
                  <option className="bg-[#0A0A0A]">SubRip Text (.srt)</option>
                  <option className="bg-[#0A0A0A]">Plain Text (.txt)</option>
                  <option className="bg-[#0A0A0A]">WebVTT (.vtt)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#FF3E00] uppercase tracking-widest mb-3">Mã hóa</label>
                <select className="w-full bg-transparent border-b border-white/20 text-white font-bold py-2 focus:outline-none focus:border-[#FF3E00] appearance-none cursor-pointer">
                  <option className="bg-[#0A0A0A]">UTF-8 (Khuyến nghị)</option>
                  <option className="bg-[#0A0A0A]">UTF-16</option>
                  <option className="bg-[#0A0A0A]">ASCII</option>
                </select>
              </div>

              <div className="col-span-2 flex items-start space-x-6 mt-4">
                <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 appearance-none border-2 border-white/40 checked:bg-[#FF3E00] checked:border-[#FF3E00] cursor-pointer" />
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Tự động lưu</h4>
                  <p className="text-[10px] text-white/40 font-mono">Lưu trực tiếp vào cùng thư mục với file video gốc sau khi xử lý xong.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Hardware & Interface */}
        <div className="space-y-12">
          {/* Hardware */}
          <div className="border-t border-white/20 pt-8">
            <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-8">Phần cứng</h3>
            
            <div className="space-y-8">
              <div>
                 <div className="flex items-center justify-between mb-2">
                   <div className="text-[10px] font-bold text-[#FF3E00] uppercase tracking-widest">
                     Xử lý GPU (CUDA)
                   </div>
                   <input type="checkbox" defaultChecked className="w-8 h-4 appearance-none bg-white/20 checked:bg-[#FF3E00] rounded-full relative cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-4" />
                 </div>
                 <div className="text-xs text-white font-bold mb-2 uppercase tracking-widest">
                    RTX 3060 (Sẵn sàng)
                 </div>
                 <p className="text-[10px] font-mono text-white/40">Tăng tốc xử lý 10x.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-bold text-[#FF3E00] uppercase tracking-widest">Số luồng (Threads)</label>
                  <span className="text-xl font-black text-white">4</span>
                </div>
                <div className="relative pt-2 pb-6">
                  <div className="h-1 bg-white/10">
                    <div className="absolute h-1 bg-[#FF3E00] w-1/4"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest mt-4 absolute w-full">
                    <span>1</span>
                    <span>Tự động</span>
                    <span>16</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#FF3E00] uppercase tracking-widest mb-3">FFmpeg Path</label>
                <input 
                  type="text" 
                  defaultValue="C:\ffmpeg\bin\ffmpeg.exe" 
                  className="w-full bg-transparent border-b border-white/20 text-white font-mono py-2 mb-4 focus:outline-none focus:border-[#FF3E00] text-sm"
                />
                <button className="text-[10px] font-black uppercase tracking-widest text-white border border-white/20 px-6 py-3 w-full hover:bg-white hover:text-black transition-colors">
                  Tự động tìm kiếm
                </button>
              </div>
            </div>
          </div>

          {/* Interface */}
          <div className="border-t border-white/20 pt-8">
            <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-8">Giao diện</h3>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-bold text-[#FF3E00] uppercase tracking-widest mb-4">Chủ đề</label>
                <div className="flex space-x-4">
                  <button className="flex-1 py-3 border border-white/20 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                    Sáng
                  </button>
                  <button className="flex-1 py-3 border-2 border-white text-white text-[10px] font-black uppercase tracking-widest">
                    Tối
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#FF3E00] uppercase tracking-widest mb-3">Ngôn ngữ</label>
                <select className="w-full bg-transparent border-b border-white/20 text-white font-bold py-2 focus:outline-none focus:border-[#FF3E00] appearance-none cursor-pointer">
                  <option className="bg-[#0A0A0A]">Tiếng Việt</option>
                  <option className="bg-[#0A0A0A]">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
