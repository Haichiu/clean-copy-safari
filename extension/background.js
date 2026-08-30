import { cleanURL } from "./clean-url.js";

const api = globalThis.browser ?? globalThis.chrome;

async function copyAndToast(url, removed) {
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    Object.assign(textarea.style, {
      position: "fixed",
      left: "-9999px",
      opacity: "0"
    });
    document.documentElement.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Clipboard write failed");
  }

  document.getElementById("__clean_copy_toast__")?.remove();
  const toast = document.createElement("div");
  toast.id = "__clean_copy_toast__";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.textContent = removed > 0
    ? `已複製乾淨連結 · 移除 ${removed} 個追蹤參數`
    : "已複製連結 · 無追蹤參數";
  Object.assign(toast.style, {
    position: "fixed",
    zIndex: "2147483647",
    right: "20px",
    bottom: "20px",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "rgba(28, 28, 30, 0.92)",
    color: "white",
    font: "13px -apple-system, BlinkMacSystemFont, sans-serif",
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.22)",
    pointerEvents: "none",
    transition: "opacity 160ms ease"
  });
  document.documentElement.append(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 180);
  }, 3500);
}

async function copyActiveTab() {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) return;

  const cleaned = cleanURL(tab.url);
  await api.scripting.executeScript({
    target: { tabId: tab.id },
    func: copyAndToast,
    args: [cleaned.url, cleaned.removed]
  });
}

api.commands.onCommand.addListener((command) => {
  if (command === "copy-clean-url") {
    copyActiveTab().catch((error) => console.error("CleanCopy:", error));
  }
});
