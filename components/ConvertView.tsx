"use client";

import { UploadCloud, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";

export default function ConvertView() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setTranscript("");
    }
  };

  const handleStart = async () => {
    if (!file) {
      setError("Vui lòng chọn file video hoặc audio trước!");
      return;
    }

    setIsProcessing(true);
    setError("");
    setTranscript("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Xảy ra lỗi khi xử lý");
      }

      setTranscript(data.transcript);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
    }
  };

  const handleSaveTxt = () => {
    if (transcript) {
      const blob = new Blob([transcript], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file?.name || "transcript"}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Column - Controls */}
      <div className="lg:col-span-4 space-y-6">
        {/* Upload Card */}
        <div 
          className="border border-white/20 p-8 flex flex-col items-center justify-center text-center space-y-6 relative group overflow-hidden cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept="video/*,audio/*"
            className="hidden"
          />
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="w-20 h-20 bg-white/5 flex items-center justify-center mb-2">
            <UploadCloud className="w-10 h-10 text-white/40 group-hover:text-[#FF3E00] transition-colors" />
          </div>
          <div>
            <h3 className="font-black text-white text-xl uppercase tracking-tighter mb-2">
              {file ? "File Đã Chọn" : "Tải video lên"}
            </h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
              {file ? file.name : "Kéo thả file video vào đây hoặc nhấn để chọn"}
            </p>
          </div>
          <button className="bg-white text-black hover:bg-[#FF3E00] hover:text-white font-black text-[10px] uppercase tracking-widest py-3 px-8 transition-colors mt-4">
            {file ? "Thay Đổi File" : "Chọn Video"}
          </button>
        </div>

        {/* Config Card */}
        <div className="border border-white/20 p-8 space-y-8">
          <div className="flex items-center text-white font-black uppercase tracking-tighter text-xl pb-4 border-b border-white/20">
            Cấu hình AI
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Engine (Đám mây)</label>
              <select className="w-full bg-transparent border-b border-white/20 text-white py-2 text-sm font-bold focus:outline-none focus:border-[#FF3E00] appearance-none cursor-pointer">
                <option className="bg-[#0A0A0A]">Gemini 2.5 Flash (Rất Nhanh)</option>
                <option className="bg-[#0A0A0A]">Gemini 2.5 Pro (Chính xác cao)</option>
              </select>
              <p className="text-[10px] text-white/40 mt-2 font-mono">Xử lý qua Google Gemini API.</p>
            </div>
          </div>

          <button 
            onClick={handleStart}
            disabled={isProcessing || !file}
            className={`w-full font-black text-[10px] uppercase tracking-widest py-4 transition-all ${
              isProcessing || !file 
                ? "border border-white/10 text-white/40 cursor-not-allowed bg-transparent" 
                : "border border-white/20 hover:border-[#FF3E00] hover:bg-[#FF3E00] hover:text-white text-white"
            }`}
          >
            {isProcessing ? "Đang xử lý..." : "Bắt đầu nhận dạng"}
          </button>
        </div>
      </div>

      {/* Right Column - Results */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        {/* Progress / Status Card */}
        <div className="border border-white/20 p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-6">
            <div className="text-[40px] font-black text-white leading-none">01</div>
            <div>
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-white mb-1">Trạng Thái</h4>
              <p className="text-white/40 text-[10px] font-mono">
                {isProcessing ? "Đang tải file và phân tích..." : 
                 transcript ? "Đã hoàn thành" : 
                 error ? "Lỗi xử lý" : "Sẵn sàng"}
              </p>
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-end space-x-6">
            {isProcessing && (
              <span className="text-[#FF3E00] text-[10px] uppercase font-bold tracking-widest animate-pulse">
                Đang xử lý...
              </span>
            )}
            {error && <AlertCircle className="w-6 h-6 text-red-500" />}
            {transcript && <CheckCircle2 className="w-6 h-6 text-[#FF3E00]" />}
          </div>
        </div>

        {/* Transcript Card */}
        <div className="border border-white/20 flex flex-col flex-1 min-h-[400px]">
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/20 flex items-center justify-between shrink-0">
            <div className="font-black text-xl text-white uppercase tracking-tighter">
              Kết quả
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto flex-1 space-y-6 text-sm text-[#E0E0E0] font-sans">
            {error && (
              <div className="text-red-500 font-mono text-xs">{error}</div>
            )}
            
            {!error && !transcript && !isProcessing && (
              <div className="text-white/20 font-mono text-xs italic">
                Kết quả transcript sẽ hiển thị ở đây...
              </div>
            )}

            {isProcessing && !transcript && (
              <div className="text-[#FF3E00] font-mono text-xs animate-pulse">
                Hệ thống đang trích xuất dữ liệu, vui lòng không tắt trang...
              </div>
            )}

            {transcript && (
              <p className="whitespace-pre-wrap">{transcript}</p>
            )}
          </div>

          {/* Footer Controls */}
          <div className="px-8 py-6 border-t border-white/20 flex items-center justify-between bg-[#0A0A0A] shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center space-x-4">
              <span>{transcript.length > 0 ? transcript.split(/\s+/).length : 0} Từ</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCopy}
                disabled={!transcript}
                className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-[#FF3E00] transition-colors disabled:text-white/20 disabled:hover:text-white/20"
              >
                Sao chép
              </button>
              <button 
                onClick={handleSaveTxt}
                disabled={!transcript}
                className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-[#FF3E00] transition-colors disabled:text-white/20 disabled:hover:text-white/20"
              >
                Lưu TXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
