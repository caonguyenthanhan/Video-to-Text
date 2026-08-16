"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Search } from "lucide-react";
import { ApiClient, TranscriptionState } from "@/lib/api-client";

export default function ConvertView() {
  const [selectedFileOrPath, setSelectedFileOrPath] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  
  const [model, setModel] = useState("small");
  const [language, setLanguage] = useState("auto");
  const [useGpu, setUseGpu] = useState(false);

  const [state, setState] = useState<TranscriptionState>({
    status: "Chưa bắt đầu",
    text: "",
    done: false,
    error: null,
    running: false,
    progress: 0
  });

  const timerRef = useRef<any>(null);

  useEffect(() => {
    ApiClient.getStatus().then(currentState => {
      if (currentState.status !== "") {
        setState(currentState);
      }
      if (currentState.running) {
        timerRef.current = setInterval(async () => {
          const s = await ApiClient.getStatus();
          setState(s);
          if (s.done || s.error) clearInterval(timerRef.current);
        }, 1000);
      }
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelectVideo = async () => {
    const file = await ApiClient.selectVideo();
    if (file) {
      setSelectedFileOrPath(file);
      // Nếu là string (desktop) thì lấy tên file từ path, nếu là File (web) thì lấy file.name
      const name = typeof file === "string" ? file.split(/[\\/]/).pop() || "video.mp4" : (file as File).name;
      setFileName(name);
    }
  };

  const handleStart = async () => {
    if (!selectedFileOrPath) return;

    setState(prev => ({ ...prev, running: true, status: "Đang bắt đầu...", text: "", progress: 0, error: null, done: false }));
    
    // Gửi yêu cầu qua API
    const ok = await ApiClient.startTranscription(selectedFileOrPath, model, language, useGpu);
    if (!ok) {
      setState(prev => ({ ...prev, running: false, status: "Lỗi khởi tạo tiến trình", error: "Không thể bắt đầu" }));
      return;
    }

    // Bắt đầu polling
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(async () => {
      const currentState = await ApiClient.getStatus();
      setState(currentState);
      if (currentState.done || currentState.error) {
        clearInterval(timerRef.current);
      }
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(state.text);
    alert("Đã copy vào clipboard");
  };

  const handleSaveTXT = () => {
    const defaultName = fileName ? fileName.replace(/\.[^.]+$/, "") + ".txt" : "transcript.txt";
    ApiClient.saveText(state.text, defaultName);
  };

  const handleSaveSRT = () => {
    const defaultName = fileName ? fileName.replace(/\.[^.]+$/, "") + ".srt" : "transcript.srt";
    ApiClient.saveSrt(defaultName);
  };

  // Drag and Drop cho bản Web
  const [isDragging, setIsDragging] = useState(false);
  
  const onDragOver = (e: any) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = () => {
    setIsDragging(false);
  };
  
  const onDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
    if (!ApiClient.isDesktop()) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('video/')) {
        setSelectedFileOrPath(file);
        setFileName(file.name);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Column - Controls */}
      <div className="lg:col-span-4 space-y-6">
        {/* Upload Card */}
        <div 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border ${isDragging ? 'border-[#FF3E00] bg-[#FF3E00]/10' : 'border-white/20'} p-8 flex flex-col items-center justify-center text-center space-y-6 relative group overflow-hidden transition-all`}
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="w-20 h-20 bg-white/5 flex items-center justify-center mb-2">
            <UploadCloud className="w-10 h-10 text-white/40 group-hover:text-[#FF3E00] transition-colors" />
          </div>
          <div>
            <h3 className="font-black text-white text-xl uppercase tracking-tighter mb-2">Tải video lên</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
              {fileName ? <span className="text-[#FF3E00]">{fileName}</span> : "Kéo thả file video vào đây hoặc nhấn nút"}
            </p>
          </div>
          <button 
            onClick={handleSelectVideo}
            disabled={state.running}
            className="bg-white text-black hover:bg-[#FF3E00] hover:text-white font-black text-[10px] uppercase tracking-widest py-3 px-8 transition-colors mt-4 disabled:opacity-50"
          >
            {fileName ? "Đổi Video" : "Chọn Video"}
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
              <select value={model} onChange={e => setModel(e.target.value)} disabled={state.running} className="w-full bg-transparent border-b border-white/20 text-white py-2 text-sm font-bold focus:outline-none focus:border-[#FF3E00] appearance-none cursor-pointer">
                <option value="base" className="bg-[#0A0A0A]">Whisper Base (Nhanh)</option>
                <option value="small" className="bg-[#0A0A0A]">Whisper Small</option>
                <option value="medium" className="bg-[#0A0A0A]">Whisper Medium (Cân bằng)</option>
                <option value="large-v3" className="bg-[#0A0A0A]">Whisper Large v3 (Chính xác)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Ngôn ngữ nguồn</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} disabled={state.running} className="w-full bg-transparent border-b border-white/20 text-white py-2 text-sm font-bold focus:outline-none focus:border-[#FF3E00] appearance-none cursor-pointer">
                <option value="auto" className="bg-[#0A0A0A]">Tự động phát hiện (Auto)</option>
                <option value="vi" className="bg-[#0A0A0A]">Tiếng Việt</option>
                <option value="en" className="bg-[#0A0A0A]">Tiếng Anh</option>
              </select>
            </div>

            <div className="flex items-start space-x-4 pt-4">
              <input type="checkbox" checked={useGpu} onChange={e => setUseGpu(e.target.checked)} disabled={state.running} className="mt-0.5 w-4 h-4 appearance-none border border-white/40 checked:bg-[#FF3E00] checked:border-[#FF3E00] cursor-pointer" />
              <div>
                <label className="text-xs font-bold text-white block uppercase tracking-widest">Sử dụng GPU (CUDA)</label>
                <p className="text-[10px] text-white/40 mt-1 font-mono">Tăng tốc độ xử lý lên đến 10x.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleStart} 
            disabled={!selectedFileOrPath || state.running}
            className="w-full border border-white/20 hover:border-[#FF3E00] hover:bg-[#FF3E00] hover:text-white text-white font-black text-[10px] uppercase tracking-widest py-4 transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white disabled:hover:border-white/20"
          >
            {state.running ? "Đang xử lý..." : "Bắt đầu nhận dạng"}
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
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-white mb-1">Trạng thái</h4>
              <p className="text-[#FF3E00] text-[10px] font-mono">{state.error || state.status}</p>
            </div>
          </div>
          <div className="w-1/2 flex items-center space-x-6">
            <div className="flex-1 h-1 bg-white/10">
              <div className="h-full bg-[#FF3E00] transition-all duration-300" style={{ width: `${state.progress}%` }}></div>
            </div>
            <span className="text-white font-black text-xl">{state.progress}%</span>
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
              <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-[#FF3E00]">
                {state.running && <span className="w-1.5 h-1.5 bg-[#FF3E00] mr-2 animate-pulse"></span>}
                {state.running ? "Live Streaming" : (state.done ? "Hoàn tất" : "Sẵn sàng")}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto flex-1 text-sm text-[#E0E0E0] font-sans whitespace-pre-wrap">
            {state.text || <span className="opacity-40 italic">Văn bản sẽ hiển thị ở đây...</span>}
          </div>

          {/* Footer Controls */}
          <div className="px-8 py-6 border-t border-white/20 flex items-center justify-between bg-[#0A0A0A] shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center space-x-4">
              <span>{state.text.length} ký tự</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={handleCopy} disabled={!state.done && state.text === ""} className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-[#FF3E00] transition-colors disabled:opacity-50">
                Sao chép
              </button>
              <button onClick={handleSaveTXT} disabled={!state.done} className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-[#FF3E00] transition-colors disabled:opacity-50">
                Lưu TXT
              </button>
              <button onClick={handleSaveSRT} disabled={!state.done} className="bg-white text-black hover:bg-[#FF3E00] hover:text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black">
                Xuất SRT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
