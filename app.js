// Kết nối UI (HTML) với backend Python thông qua pywebview.
// Mọi lời gọi window.pywebview.api.<ten_ham> tương ứng với 1 method
// public trong class Api ở backend.py.

const $ = (id) => document.getElementById(id);

let selectedPath = null;
let pollTimer = null;

// pywebview cần chút thời gian để bơm object window.pywebview vào trang.
// Nên chờ sự kiện "pywebviewready" trước khi gắn các event listener cần dùng API.
window.addEventListener("pywebviewready", () => {
  $("btnChoose").disabled = false;
});

$("btnChoose").addEventListener("click", async () => {
  const path = await window.pywebview.api.select_video();
  if (path) {
    selectedPath = path;
    $("fileName").textContent = path.split(/[\\/]/).pop();
    $("fileName").classList.remove("muted");
    $("btnStart").disabled = false;
  }
});

$("btnStart").addEventListener("click", async () => {
  if (!selectedPath) return;

  $("output").value = "";
  $("btnStart").disabled = true;
  $("btnCopy").disabled = true;
  $("btnSave").disabled = true;
  $("status").textContent = "Đang bắt đầu...";

  const model = $("model").value;
  const language = $("language").value;

  const res = await window.pywebview.api.start_transcription(selectedPath, model, language);
  if (!res || !res.ok) {
    $("status").textContent = "Không thể bắt đầu (kiểm tra đã cài faster-whisper chưa).";
    $("btnStart").disabled = false;
    return;
  }

  pollTimer = setInterval(pollStatus, 400);
});

async function pollStatus() {
  const state = await window.pywebview.api.get_status();

  $("status").textContent = state.status || "";
  $("output").value = state.text || "";

  if (state.error) {
    clearInterval(pollTimer);
    $("status").textContent = "Lỗi: " + state.error;
    $("btnStart").disabled = false;
    return;
  }

  if (state.done) {
    clearInterval(pollTimer);
    $("btnStart").disabled = false;
    $("btnCopy").disabled = false;
    $("btnSave").disabled = false;
  }
}

$("btnCopy").addEventListener("click", async () => {
  await navigator.clipboard.writeText($("output").value);
  $("status").textContent = "Đã copy vào clipboard.";
});

$("btnSave").addEventListener("click", async () => {
  const base = selectedPath
    ? selectedPath.split(/[\\/]/).pop().replace(/\.[^.]+$/, "")
    : "transcript";
  const defaultName = base + ".txt";

  const result = await window.pywebview.api.save_text($("output").value, defaultName);
  if (result && result.ok) {
    $("status").textContent = "Đã lưu: " + result.path;
  }
});
