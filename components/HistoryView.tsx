import { History, Clock, HardDrive, Filter, FileText, CheckCircle2, AlertCircle, RotateCcw, Search } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function HistoryView() {
  const records: any[] = [];

  const productivityData = [
    { day: "Thứ 2", time: 120 },
    { day: "Thứ 3", time: 45 },
    { day: "Thứ 4", time: 210 },
    { day: "Thứ 5", time: 80 },
    { day: "Thứ 6", time: 150 },
    { day: "Thứ 7", time: 300 },
    { day: "Chủ nhật", time: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[100px] leading-[0.8] font-black tracking-tighter uppercase mb-4 text-white">Lịch <span className="text-[#FF3E00] italic">Sử</span></h1>
        </div>
        <div className="relative mt-8">
          <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="TÌM KIẾM FILE..." 
            className="w-64 bg-transparent border-b border-white/20 py-2 pl-8 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#FF3E00] transition-colors placeholder:text-white/40 text-white"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 mb-16">
        <div className="border-t border-white/20 pt-6">
          <div className="text-[40px] font-black mb-2 text-[#FF3E00]">128</div>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-white/60">Tổng số bản ghi</div>
          <div className="text-xs text-white flex items-center">
            +12% so với tuần trước
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="text-[40px] font-black mb-2 text-white">45<span className="text-xl">h</span> 20<span className="text-xl">m</span></div>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-white/60">Thời lượng</div>
          <p className="text-xs text-white/40">Đã chuyển đổi thành văn bản</p>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="flex items-end space-x-4 mb-2">
            <div className="text-[40px] font-black text-white leading-none">1.2</div>
            <div className="text-sm font-bold text-white/40 uppercase mb-2">/ 5.0 GB</div>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-4 text-[#FF3E00]">Lưu trữ</div>
          <div className="h-1 w-full bg-white/10">
            <div className="h-full bg-[#FF3E00] w-[24%]"></div>
          </div>
        </div>
      </div>

      {/* Productivity Chart */}
      <div className="border border-white/10 p-8 mb-16 theme-border">
        <h3 className="text-xl font-black uppercase tracking-wider text-white theme-text mb-6">Năng Suất Bóc Băng (Phút)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productivityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="rgba(255,255,255,0.4)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                className="font-bold uppercase tracking-widest"
              />
              <YAxis 
                stroke="rgba(255,255,255,0.4)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                className="font-bold"
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: 'bold' }}
                itemStyle={{ color: '#FF3E00' }}
              />
              <Bar dataKey="time" fill="#FF3E00" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex space-x-6">
          <button className="text-[10px] font-bold uppercase tracking-widest text-[#FF3E00]">Tất cả</button>
          <button className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Hoàn thành</button>
          <button className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Đã hủy</button>
        </div>
      </div>

      {/* Record Grid */}
      <div className="grid grid-cols-1 gap-6">
        {records.length === 0 ? (
          <div className="border border-white/10 p-12 text-center text-white/40 font-mono text-sm">
            Chưa có lịch sử xử lý nào.
          </div>
        ) : (
          records.map((record, idx) => (
          <div key={record.id} className="border border-white/10 p-6 hover:border-[#FF3E00]/50 transition-colors group flex items-start justify-between">
            <div className="flex items-start max-w-2xl">
              <div className="text-[24px] font-black text-white/20 mr-8 mt-1 group-hover:text-[#FF3E00] transition-colors">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div>
                <h4 className="text-xl font-bold uppercase tracking-wider text-white mb-3" title={record.title}>{record.title}</h4>
                
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-white/40 space-x-6 mb-4">
                  <div>{record.date} • {record.time}</div>
                  {record.status === 'success' && (
                    <div>{record.duration}</div>
                  )}
                  {record.status === 'success' ? (
                    <div className="text-[#FF3E00]">Hoàn thành</div>
                  ) : (
                    <div className="text-red-500">Đã hủy</div>
                  )}
                </div>

                {record.status === 'success' ? (
                  <p className="text-sm text-[#E0E0E0] italic">&quot;{record.snippet}&quot;</p>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm text-red-400 mb-4">{record.errorMsg}</p>
                    <button className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-6 py-2 hover:border-[#FF3E00] hover:text-[#FF3E00] transition-colors">
                      Thử lại
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {record.status === 'success' && (
              <button className="bg-white text-black hover:bg-[#FF3E00] hover:text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors mt-2">
                Chi tiết
              </button>
            )}
          </div>
        )))}
      </div>
    </div>
  );
}
