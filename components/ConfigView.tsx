import { Cpu, Folder, CheckCircle2, Circle, Download, Monitor, Globe, Settings2, Code, MoveRight, Search } from "lucide-react";

export default function ConfigView() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[100px] leading-[0.8] font-black tracking-tighter uppercase mb-4 text-white">Cấu <span className="text-[#FF3E00] italic">Hình</span></h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 mt-12">
        {/* Left Column - Models & Output */}
        <div className="xl:col-span-2 space-y-12">
          {/* AI Model Management */}
          <div className="border-t border-white/20 pt-8">
            <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-8">Trình Duyệt AI</h3>
            
            <div className="space-y-8">
              <div className="p-8 border border-white/10">
                <p className="text-sm font-mono text-white/60 mb-6">
                  Ứng dụng này sử dụng kiến trúc AI Client-Side (Transformers.js). Các mô hình ngôn ngữ được tải và thực thi trực tiếp bằng tài nguyên CPU/GPU của trình duyệt thông qua WebAssembly.
                </p>
                <div className="flex items-center text-[10px] font-bold text-[#FF3E00] uppercase tracking-widest mb-4">
                  Trạng thái lưu trữ cache:
                </div>
                <div className="text-white text-2xl font-black mb-4">Tự động quản lý</div>
                <button className="text-[10px] font-black uppercase tracking-widest text-white border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-colors"
                  onClick={() => {
                    if (window.caches) {
                      caches.keys().then(names => {
                        for (let name of names) caches.delete(name);
                      });
                      alert("Đã xóa bộ nhớ đệm (cache) của mô hình AI.");
                    }
                  }}
                >
                  Xóa bộ nhớ đệm AI (Giải phóng dung lượng)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Interface */}
        <div className="space-y-12">
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
