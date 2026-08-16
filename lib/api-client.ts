// @ts-nocheck
export interface TranscriptionState {
  status: string;
  text: string;
  done: boolean;
  error: string | null;
  running: boolean;
  progress: number;
}

export const ApiClient = {
  isDesktop: () => typeof window !== "undefined" && window.pywebview !== undefined,

  selectVideo: async (): Promise<string | null> => {
    if (ApiClient.isDesktop()) {
      return await window.pywebview.api.select_video();
    } else {
      // Trong trình duyệt web, ta dùng thẻ <input type="file"> để upload
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) resolve(file as unknown as string); // Trả về File object
          else resolve(null);
        };
        input.click();
      });
    }
  },

  startTranscription: async (fileOrPath: any, modelSize: string, language: string, useGpu: boolean): Promise<boolean> => {
    if (ApiClient.isDesktop()) {
      const res = await window.pywebview.api.start_transcription(fileOrPath, modelSize, language, useGpu);
      return res?.ok || false;
    } else {
      // Web Server API
      const formData = new FormData();
      formData.append("file", fileOrPath);
      formData.append("model", modelSize);
      formData.append("language", language);
      formData.append("use_gpu", useGpu.toString());

      try {
        // Gọi tới localhost:8000 vì dev server chạy ở cổng này, 
        // trong thực tế có thể cần truyền BASE_URL env
        const response = await fetch("http://localhost:8000/api/transcribe", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        return data.ok;
      } catch (err) {
        console.error("Transcribe API error", err);
        return false;
      }
    }
  },

  getStatus: async (): Promise<TranscriptionState> => {
    if (ApiClient.isDesktop()) {
      return await window.pywebview.api.get_status();
    } else {
      try {
        const response = await fetch("http://localhost:8000/api/status");
        return await response.json();
      } catch (err) {
        return {
          status: "Lỗi kết nối server",
          text: "",
          done: true,
          error: "Fetch error",
          running: false,
          progress: 0
        };
      }
    }
  },

  saveText: async (content: string, defaultName: string) => {
    if (ApiClient.isDesktop()) {
      await window.pywebview.api.save_text(content, defaultName);
    } else {
      // Web: Download as file
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = defaultName;
      a.click();
      URL.revokeObjectURL(url);
    }
  },

  saveSrt: async (defaultName: string) => {
    if (ApiClient.isDesktop()) {
      await window.pywebview.api.save_srt(defaultName);
    } else {
      // Web: Download via server API or directly
      window.open("http://localhost:8000/api/download-srt", "_blank");
    }
  }
};
