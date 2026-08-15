"use client";

import { useState } from "react";
import { Video, History, Settings, Bell, HelpCircle, User, Search, Cloud } from "lucide-react";
import ConvertView from "@/components/ConvertView";
import HistoryView from "@/components/HistoryView";
import ConfigView from "@/components/ConfigView";
import NotificationView from "@/components/NotificationView";
import HelpView from "@/components/HelpView";

export default function App() {
  const [currentView, setCurrentView] = useState("convert");

  const navItems = [
    { id: "convert", label: "Chuyển đổi", icon: Video },
    { id: "history", label: "Lịch sử văn bản", icon: History },
    { id: "config", label: "Cấu hình", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0A0A0A] text-[#E0E0E0] font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#0F0F0F] border-r border-white/10 flex flex-col shrink-0">
        <div className="h-24 flex items-center px-6 border-b border-white/10">
          <div className="text-2xl font-black italic tracking-tighter text-[#FF3E00] mr-3">V</div>
          <span className="font-black text-lg uppercase tracking-widest text-white">VideoToText</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center px-3 py-4 transition-colors ${
                currentView === item.id
                  ? "text-[#FF3E00] border-l-2 border-[#FF3E00] bg-white/5"
                  : "text-white/40 hover:text-[#FF3E00] hover:bg-white/5 border-l-2 border-transparent"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center text-[10px] uppercase tracking-widest font-bold">
            <Cloud className="w-4 h-4 mr-2 text-white/40" />
            <span className="text-white">Hệ thống sẵn sàng</span>
          </div>
          <div className="h-1 w-full bg-white/10 mt-3 overflow-hidden">
             <div className="h-full bg-[#FF3E00] w-[60%]"></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <div className="h-24 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between px-12 shrink-0">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="TÌM KIẾM BẢN GHI..." 
              className="w-full bg-transparent border-b border-white/20 py-2 pl-8 pr-4 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[#FF3E00] transition-colors placeholder:text-white/20"
            />
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setCurrentView('help')}
              className={`transition-colors ${currentView === 'help' ? 'text-[#FF3E00]' : 'text-white/40 hover:text-[#FF3E00]'}`}
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button 
               onClick={() => setCurrentView('notifications')}
               className={`transition-colors relative ${currentView === 'notifications' ? 'text-[#FF3E00]' : 'text-white/40 hover:text-[#FF3E00]'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF3E00] rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-white/5 flex items-center justify-center border border-white/20">
              <User className="w-4 h-4 text-white/40" />
            </div>
          </div>
        </div>

        {/* View Container */}
        <main className="flex-1 overflow-y-auto p-12 bg-[#0A0A0A] relative">
          <div className="max-w-6xl mx-auto">
            {currentView === "convert" && <ConvertView />}
            {currentView === "history" && <HistoryView />}
            {currentView === "config" && <ConfigView />}
            {currentView === "notifications" && <NotificationView />}
            {currentView === "help" && <HelpView />}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="h-12 border-t border-white/10 bg-[#0F0F0F] flex items-center justify-between px-12 text-[10px] font-bold uppercase tracking-widest text-white/40 shrink-0">
          <div className="flex items-center space-x-6">
            <span className="text-white">ENGINE: V2.4.0-STABLE</span>
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 bg-[#FF3E00] mr-2"></span>
              <span className="text-[#FF3E00]">TRỰC TUYẾN</span>
            </div>
          </div>
          <div>© 2024 VideoToText Pro</div>
        </footer>
      </div>
    </div>
  );
}
