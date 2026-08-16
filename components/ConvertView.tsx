"use client";

import { UploadCloud, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import RichEditor from "./RichEditor";

export default function ConvertView() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<string>("Sẵn sàng");
  const [progress, setProgress] = useState<number>(0);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [model, setModel] = useState("Xenova/whisper-tiny");
  const [language, setLanguage] = useState("auto");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const worker = useRef<Worker | null>(null);
  const durationRef = useRef<number>(0);

  const [isDragging, setIsDragging] = useState(false);

  // Khôi phục bản nháp (draft) từ sessionStorage khi khởi động
  useEffect(() => {
    try {
      const savedDraft = sessionStorage.getItem('transcript_draft');
      if (savedDraft) {
        setTranscript(savedDraft);
      }
    } catch (e) {
      console.warn("Could not access sessionStorage", e);
    }
  }, []);

  // Tự động lưu bản nháp sau mỗi 1.5 giây khi có thay đổi
  useEffect(() => {
    if (!transcript) return;
    
    const handler = setTimeout(() => {
      try {
        sessionStorage.setItem('transcript_draft', transcript);
        setLastSaved(new Date());
      } catch (e) {
        console.warn("Could not write to sessionStorage", e);
      }
    }, 1500);

    return () => {
      clearTimeout(handler);
    };
  }, [transcript]);

  useEffect(() => {
    worker.current = new Worker(new URL('../lib/worker.ts', import.meta.url), {
      type: 'module'
    });

    worker.current.addEventListener('message', (e) => {
      const msg = e.data;
      switch (msg.status) {
        case 'loading_model':
          setStatusMsg("Đang chuẩn bị mô hình AI...");
          setProgress(0);
          break;
        case 'download_progress':
          if (msg.data && msg.data.progress) {
            setStatusMsg(`Đang tải mô hình: ${Math.round(msg.data.progress)}%`);
            setProgress(Math.round(msg.data.progress));
          }
          break;
        case 'ready':
          setStatusMsg("Mô hình đã sẵn sàng");
          setProgress(100);
          break;
        case 'transcribing':
          setStatusMsg("Đang nhận dạng giọng nói...");
          setProgress(0);
          setTranscript("");
          break;
        case 'transcribing_chunk':
          if (msg.chunk && msg.chunk.text) {
             setTranscript(prev => prev + (prev.endsWith(' ') ? '' : ' ') + msg.chunk.text.trim());
             if (msg.chunk.timestamp && durationRef.current > 0) {
                const end = msg.chunk.timestamp[1];
                const newProgress = Math.min(99, (end / durationRef.current) * 100);
                setProgress(newProgress);
             }
          }
          break;
        case 'complete':
          if (msg.result && msg.result.text) {
            // Because we stream chunks, the final text might be slightly different or same.
            // Let's just use the final text.
            setTranscript(msg.result.text);
          }
          setStatusMsg("Đã hoàn thành");
          setProgress(100);
          setIsProcessing(false);
          break;
        case 'error':
          setError(msg.message || "Lỗi xử lý");
          setIsProcessing(false);
          setProgress(0);
          break;
      }
    });

    return () => {
      worker.current?.terminate();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setTranscript("");
      setStatusMsg("Sẵn sàng");
      setProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/') || droppedFile.type.startsWith('audio/')) {
        setFile(droppedFile);
        setError("");
        setTranscript("");
        setStatusMsg("Sẵn sàng");
        setProgress(0);
      } else {
        setError("Vui lòng chọn file định dạng video hoặc audio.");
      }
    }
  };

  const extractAudio = async (file: File) => {
    setStatusMsg("Đang tách âm thanh (có thể mất thời gian)...");
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const audioData = audioBuffer.getChannelData(0);
    
    durationRef.current = audioBuffer.duration;
    
    // Check if the extracted audio is completely silent
    let isSilent = true;
    for (let i = 0; i < Math.min(audioData.length, 16000 * 10); i++) {
       if (audioData[i] !== 0) {
           isSilent = false;
           break;
       }
    }
    if (isSilent) {
        throw new Error("Không tìm thấy âm thanh trong file hoặc trình duyệt không hỗ trợ định dạng này.");
    }
    
    return audioData;
  };

  const handleStart = async () => {
    if (!file) {
      setError("Vui lòng chọn file video hoặc audio trước!");
      return;
    }

    setIsProcessing(true);
    setError("");
    setTranscript("");

    try {
      if (file.size > 150 * 1024 * 1024) {
        throw new Error("Kích thước file quá lớn đối với xử lý trình duyệt (Tối đa 150MB).");
      }

      const audioData = await extractAudio(file);
      
      worker.current?.postMessage({
        type: 'transcribe',
        audio: audioData,
        model: model,
        language: language
      });

    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (transcript) {
      const plainText = transcript.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
      navigator.clipboard.writeText(plainText);
    }
  };

  const handleSaveTxt = () => {
    if (transcript) {
      const plainText = transcript.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
      const blob = new Blob([plainText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file?.name || "transcript"}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleCorrect = async () => {
    if (!transcript) return;
    
    setIsCorrecting(true);
    setStatusMsg("Đang nhờ AI hiệu đính văn bản...");
    
    try {
      const plainText = transcript.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
      const res = await fetch('/api/correct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: plainText }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Lỗi hiệu đính");
      }
      
      if (data.correctedTranscript) {
        setTranscript(data.correctedTranscript);
        setStatusMsg("Hiệu đính hoàn tất");
      }
    } catch (err: any) {
      setError(err.message);
      setStatusMsg("Lỗi hiệu đính");
    } finally {
      setIsCorrecting(false);
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (file && !isProcessing) {
            handleStart();
          }
        } else if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          if (transcript && !isCorrecting) {
            handleSaveTxt();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, isProcessing, transcript, isCorrecting, handleStart, handleSaveTxt]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Column - Controls */}
      <div className="lg:col-span-4 space-y-6">
        {/* Upload Card */}
        <div 
          className={`border p-8 flex flex-col items-center justify-center text-center space-y-6 relative group overflow-hidden cursor-pointer transition-colors ${isDragging ? 'border-[#FF3E00] bg-[#FF3E00]/5' : 'border-white/20'}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Mô hình AI (Trình duyệt)</label>
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 text-white py-2 text-sm font-bold focus:outline-none focus:border-[#FF3E00] appearance-none cursor-pointer"
              >
                <option value="Xenova/whisper-tiny" className="bg-[#0A0A0A]">Whisper Tiny (Rất nhanh, ~40MB)</option>
                <option value="Xenova/whisper-base" className="bg-[#0A0A0A]">Whisper Base (Cân bằng, ~70MB)</option>
                <option value="Xenova/whisper-small" className="bg-[#0A0A0A]">Whisper Small (Độ chuẩn cao, ~250MB)</option>
              </select>
              <p className="text-[10px] text-white/40 mt-2 font-mono">Xử lý 100% Offline bằng WebAssembly.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Ngôn ngữ Video</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 text-white py-2 text-sm font-bold focus:outline-none focus:border-[#FF3E00] appearance-none cursor-pointer"
              >
                <option value="auto" className="bg-[#0A0A0A]">Tự động phát hiện (Auto)</option>
                <option value="vi" className="bg-[#0A0A0A]">Tiếng Việt</option>
                <option value="en" className="bg-[#0A0A0A]">Tiếng Anh</option>
              </select>
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
            {isProcessing ? "Đang xử lý..." : "Bắt đầu nhận dạng (Ctrl+Enter)"}
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
                {error ? "Lỗi xử lý" : statusMsg}
              </p>
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-end space-x-6">
            {isProcessing && (
              <>
                <div className="flex-1 h-1 bg-white/10 hidden md:block">
                  <div className="h-full bg-[#FF3E00] transition-all duration-300" style={{ width: `${Math.round(progress)}%` }}></div>
                </div>
                <span className="text-[#FF3E00] font-black w-12 text-right">
                  {Math.round(progress)}%
                </span>
              </>
            )}
            {error && <AlertCircle className="w-6 h-6 text-red-500" />}
            {transcript && !isProcessing && <CheckCircle2 className="w-6 h-6 text-[#FF3E00]" />}
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

            {isCorrecting && (
              <div className="text-[#FF3E00] font-mono text-xs animate-pulse mb-4">
                Đang nhờ AI hiệu đính lỗi chính tả, vui lòng đợi...
              </div>
            )}

            {transcript && (
              <div className="w-full h-full min-h-[400px]">
                <RichEditor
                  value={transcript}
                  onChange={setTranscript}
                  className="w-full h-full min-h-[400px]"
                />
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="px-8 py-6 border-t border-white/20 flex items-center justify-between bg-[#0A0A0A] shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center space-x-4">
              <span>{transcript.length > 0 ? transcript.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length : 0} Từ</span>
              {lastSaved && (
                <>
                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                  <span className="text-white/40">
                    Đã lưu bản nháp <span className="text-[#FF3E00]">{lastSaved.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCorrect}
                disabled={!transcript || isProcessing || isCorrecting}
                className="text-[10px] font-bold text-[#FF3E00] uppercase tracking-widest hover:text-white transition-colors disabled:text-[#FF3E00]/20 disabled:hover:text-[#FF3E00]/20 border border-[#FF3E00]/50 hover:bg-[#FF3E00] px-4 py-2 disabled:border-[#FF3E00]/10 disabled:bg-transparent"
              >
                {isCorrecting ? "Đang sửa..." : "Sửa lỗi bằng AI"}
              </button>
              <button 
                onClick={handleCopy}
                disabled={!transcript || isCorrecting}
                className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-[#FF3E00] transition-colors disabled:text-white/20 disabled:hover:text-white/20 px-2"
              >
                Sao chép
              </button>
              <button 
                onClick={handleSaveTxt}
                disabled={!transcript || isCorrecting}
                className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-[#FF3E00] transition-colors disabled:text-white/20 disabled:hover:text-white/20 px-2"
              >
                Lưu TXT (Ctrl+S)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
