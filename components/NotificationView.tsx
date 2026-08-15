import { CheckCircle2, AlertCircle, Bell, Trash2, Check } from "lucide-react";

export default function NotificationView() {
  const todayNotifications = [
    {
      id: 1,
      type: "success",
      title: "Xử lý hoàn tất",
      time: "10:45 AM",
      description: "Video \"Hội thảo Python 2024\" đã sẵn sàng. Bạn có thể xem và tải xuống bản ghi ngay bây giờ.",
      actionText: "Mở tệp",
      actionLink: "#"
    },
    {
      id: 2,
      type: "error",
      title: "Lỗi xử lý",
      time: "08:15 AM",
      description: "File \"Phỏng vấn_01.mp4\" gặp sự cố định dạng. Vui lòng kiểm tra lại định dạng file hoặc kích thước trước khi thử lại.",
    }
  ];

  const pastNotifications = [
    {
      id: 3,
      type: "info",
      title: "Bản cập nhật mới",
      time: "Hôm qua, 14:30",
      description: "Phiên bản v2.5 hiện đã có sẵn với cải tiến model Whisper, giúp tăng độ chính xác lên đến 15% cho tiếng Việt.",
    },
    {
      id: 4,
      type: "success",
      title: "Xử lý hoàn tất",
      time: "12 Thg 10",
      description: "Video \"Weekly Sync 45\" đã được chuyển đổi thành văn bản thành công.",
    }
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-blue-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'info':
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const renderNotificationGroup = (title: string, notifications: any[]) => (
    <div className="mb-12">
      <div className="flex items-center mb-8">
        <h3 className="text-xl font-black uppercase tracking-widest text-white mr-6">{title}</h3>
        <div className="h-px bg-white/20 flex-1"></div>
      </div>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className={`border p-6 flex flex-col md:flex-row md:items-start transition-colors ${
              notif.type === 'error' ? 'border-red-500 hover:border-red-400 bg-red-500/5' : 
              notif.type === 'success' && title === 'Hôm nay' ? 'border-[#FF3E00] hover:border-[#FF3E00] bg-[#FF3E00]/5' : 
              'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-2xl font-black uppercase tracking-tighter text-white">{notif.title}</h4>
              </div>
              <p className="text-sm font-mono text-white/60 leading-relaxed mb-4">{notif.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF3E00]">{notif.time}</span>
                {notif.actionText && (
                  <button className="bg-white text-black hover:bg-[#FF3E00] hover:text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors">
                    {notif.actionText}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-white/20 pb-8 mb-12">
        <div>
          <h1 className="text-[100px] leading-[0.8] font-black tracking-tighter uppercase mb-2 text-white">Thông <span className="text-[#FF3E00] italic">Báo</span></h1>
        </div>
        <div className="flex space-x-6 pb-2">
          <button className="text-[10px] font-bold uppercase tracking-widest text-[#FF3E00] hover:text-white transition-colors">
            Đánh dấu đã đọc
          </button>
          <button className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-red-500 transition-colors">
            Xóa tất cả
          </button>
        </div>
      </div>

      {/* Lists */}
      {renderNotificationGroup("Hôm nay", todayNotifications)}
      {renderNotificationGroup("Trước đó", pastNotifications)}
    </div>
  );
}
