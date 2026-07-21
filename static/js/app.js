/* Заавар (Math Guide) — shared client helpers */

/* ---- KaTeX rendering ---------------------------------------------------- */
function renderMath(el) {
  if (!el) return;
  if (typeof renderMathInElement !== "function") {
    // auto-render.js still loading (deferred) — retry shortly
    return setTimeout(() => renderMath(el), 60);
  }
  renderMathInElement(el, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
  });
}

/* Render markdown-lite + math into an element.
   Handles: paragraphs (\n\n), line breaks (\n), **bold**, and leaves $..$ /
   $$..$$ untouched for KaTeX. */
function renderRich(el, text) {
  if (!el) return;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = esc(text || "")
    .split(/\n{2,}/)
    .map((p) => "<p>" + p.replace(/\n/g, "<br>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") + "</p>")
    .join("");
  el.innerHTML = html;
  renderMath(el);
}

/* ---- Progress (localStorage) ------------------------------------------- */
/* All learner state is scoped per subject (math|physics) so switching
   subjects never mixes or overwrites the other subject's records. */
const ZSUBJECT = (typeof window !== "undefined" && window.ZAAVAR_SUBJECT) || "math";
function zKey(name) { return "zaavar." + ZSUBJECT + "." + name; }
const Progress = {
  KEY: zKey("progress.v1"),
  read() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || {}; }
    catch { return {}; }
  },
  write(p) { localStorage.setItem(this.KEY, JSON.stringify(p)); },
  get lessons() { return this.read().lessons || {}; },
  lessonDone(id) { return !!(this.read().lessons || {})[id]; },
  markLesson(id, score) {
    const p = this.read();
    p.lessons = p.lessons || {};
    p.lessons[id] = { done: true, score, ts: Date.now() };
    this.write(p);
  },
  setLastLesson(id, title) {
    const p = this.read();
    p.last = { id, title: title || "", ts: Date.now() };
    this.write(p);
  },
  get last() { return this.read().last || null; },
  get doneCount() { return Object.keys(this.read().lessons || {}).length; },
  saveDiagnostic(result) {
    const p = this.read();
    p.diagnostic = { ...result, ts: Date.now() };
    this.write(p);
  },
  get diagnostic() { return this.read().diagnostic || null; },
};

/* ---- SSE streaming over fetch POST ------------------------------------- */
async function sseStream(url, body, onText, onDone) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split("\n\n");
    buf = parts.pop();
    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data:")) continue;
      try {
        const obj = JSON.parse(line.slice(5).trim());
        if (obj.text) onText(obj.text);
        if (obj.done && onDone) onDone();
      } catch { /* ignore */ }
    }
  }
  if (onDone) onDone();
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  return res.json();
}

/* Render any math already present on the page once everything is loaded. */
window.addEventListener("load", () => renderMath(document.body));
