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
    zaavarActivity();
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

/* ---- Streak (localStorage, GLOBAL across all subjects) ------------------ */
/* A gentle daily-learning streak: one "ping" per qualifying activity (lesson
   passed, level test / mastery / mock graded). Forgiving by design — a single
   missed day is bridged by a freeze (earned every 7-day milestone, max 2), so
   the streak encourages a habit without punishing one slip. */
const Streak = {
  KEY: "zaavar.streak", // global (a learner's streak spans every subject)
  _today() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  },
  _dayDiff(a, b) { // whole days between YYYY-MM-DD a and b (b - a)
    const pa = a.split("-").map(Number), pb = b.split("-").map(Number);
    const da = Date.UTC(pa[0], pa[1] - 1, pa[2]), db = Date.UTC(pb[0], pb[1] - 1, pb[2]);
    return Math.round((db - da) / 86400000);
  },
  read() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || {}; }
    catch { return {}; }
  },
  get() {
    const s = this.read();
    return { count: s.count || 0, best: s.best || 0, last: s.last || null, freezes: s.freezes == null ? 0 : s.freezes };
  },
  /* Register a learning activity for today. Returns {count, extended, isNew, best}. */
  ping() {
    const s = this.get();
    const today = this._today();
    if (s.last === today) return { count: s.count, extended: false, isNew: false, best: s.best };
    const gap = s.last ? this._dayDiff(s.last, today) : null;
    let count, freezes = s.freezes;
    if (gap === 1 || gap === null) {
      count = (s.count || 0) + 1;              // consecutive day (or very first ever)
    } else if (gap === 2 && freezes > 0) {
      count = (s.count || 0) + 1; freezes -= 1; // one missed day, bridged by a freeze
    } else {
      count = 1;                                // gap too big → fresh start
    }
    // Earn a freeze on every 7-day milestone (max 2).
    if (count % 7 === 0) freezes = Math.min(2, freezes + 1);
    const best = Math.max(s.best || 0, count);
    localStorage.setItem(this.KEY, JSON.stringify({ count, best, last: today, freezes }));
    this.render();
    return { count, extended: gap === 1 || gap === 2, isNew: (s.count || 0) === 0, best };
  },
  render() {
    const slot = document.getElementById("streak-slot");
    if (!slot) return;
    const s = this.get();
    // "active" if a ping landed today or yesterday (streak still alive)
    const alive = s.last && this._dayDiff(s.last, this._today()) <= 1 && s.count > 0;
    if (!s.count) { slot.innerHTML = ""; return; }
    slot.innerHTML =
      '<span title="' + (alive ? "Өдөр бүр суралцсаар байгаарай!" : "Өнөөдөр суралцаад цувралаа сэргээ!") +
      '" class="inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ' +
      (alive ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-400") + '">' +
      '<span>' + (alive ? "🔥" : "🕯️") + '</span>' + s.count + "</span>";
  },
};

/* One call site for "the learner did something worth counting today". */
function zaavarActivity() { try { return Streak.ping(); } catch (e) { return null; } }

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
window.addEventListener("load", () => {
  renderMath(document.body);
  if (typeof Streak !== "undefined") Streak.render();
});
