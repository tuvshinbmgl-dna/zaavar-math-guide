/* Заавар — animated derivative explainers ("videos").
   Self-contained SVG + requestAnimationFrame. No deps.
   Usage:  Explainer.mount(document.getElementById('exp'), 'secant-tangent')
   Scenes: 'secant-tangent' | 'power-rule' | 'extrema'
   Each scene loops over LOOP_MS (~20s) with captions + play/pause/replay. */
(function () {
  "use strict";
  const SVGNS = "http://www.w3.org/2000/svg";
  const LOOP_MS = 20000;
  const W = 400, H = 250;              // svg viewBox
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  function el(tag, attrs, parent) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /* Math-coords → svg px mapper for a plot box */
  function makeGraph(svg, box, dom) {
    const [px, py, pw, ph] = box;           // pixel plot rect
    const [xmin, xmax, ymin, ymax] = dom;   // math domain
    const X = (x) => px + ((x - xmin) / (xmax - xmin)) * pw;
    const Y = (y) => py + ph - ((y - ymin) / (ymax - ymin)) * ph;
    // axes
    const g = el("g", {}, svg);
    if (ymin <= 0 && ymax >= 0) el("line", { x1: px, y1: Y(0), x2: px + pw, y2: Y(0), stroke: "#cbd5e1", "stroke-width": 1.2 }, g);
    if (xmin <= 0 && xmax >= 0) el("line", { x1: X(0), y1: py, x2: X(0), y2: py + ph, stroke: "#cbd5e1", "stroke-width": 1.2 }, g);
    return { X, Y, g,
      path(fn, attrs) {
        let d = "", first = true;
        for (let i = 0; i <= 120; i++) {
          const x = xmin + (xmax - xmin) * i / 120, y = fn(x);
          if (!isFinite(y) || y < ymin - 4 || y > ymax + 4) { first = true; continue; }
          d += (first ? "M" : "L") + X(x).toFixed(1) + " " + Y(y).toFixed(1) + " ";
          first = false;
        }
        return el("path", Object.assign({ d, fill: "none" }, attrs), svg);
      } };
  }

  /* ---------------- Scene: secant → tangent (limit definition) ------------- */
  function sceneSecant(svg, cap) {
    const f = (x) => 0.5 * x * x;         // f'(x)=x → slope at x0=2 is 2
    const x0 = 2, gr = makeGraph(svg, [40, 16, 330, 180], [-0.6, 4.2, -0.6, 6.8]);
    gr.path(f, { stroke: "#c7d2fe", "stroke-width": 3 });
    const P = { x: x0, y: f(x0) };
    const secant = el("line", { stroke: "#f59e0b", "stroke-width": 2.5, "stroke-linecap": "round" }, svg);
    const qDot = el("circle", { r: 5, fill: "#f59e0b" }, svg);
    const pDot = el("circle", { cx: gr.X(P.x), cy: gr.Y(P.y), r: 5.5, fill: "#4f46e5" }, svg);
    el("text", { x: gr.X(P.x) + 8, y: gr.Y(P.y) + 4, "font-size": 13, fill: "#4f46e5", "font-weight": 700 }, svg).textContent = "P";
    const slopeT = el("text", { x: 40, y: 232, "font-size": 13, fill: "#334155", "font-weight": 700 }, svg);

    return function (t) {
      // h: 1.7 → 0.04 over first 82% of loop, then hold tangent
      const p = ease(clamp(t / 0.82, 0, 1));
      const h = lerp(1.55, 0.04, p);
      const Q = { x: x0 + h, y: f(x0 + h) };
      const slope = (f(x0 + h) - f(x0)) / h;   // = 2 + 0.5h → 2
      // extend secant across plot
      const x1 = -0.4, x2 = 4.1;
      secant.setAttribute("x1", gr.X(x1)); secant.setAttribute("y1", gr.Y(P.y + slope * (x1 - x0)));
      secant.setAttribute("x2", gr.X(x2)); secant.setAttribute("y2", gr.Y(P.y + slope * (x2 - x0)));
      qDot.setAttribute("cx", gr.X(Q.x)); qDot.setAttribute("cy", gr.Y(Q.y));
      qDot.setAttribute("opacity", h < 0.12 ? 0 : 1);
      slopeT.textContent = `Налуу = [f(2+h)−f(2)] / h = ${slope.toFixed(2)}   (h = ${h.toFixed(2)})`;
      if (t < 0.15) cap("Муруй дээрх P, Q цэгийг дайруулж СЕКАНС шулуун татъя.");
      else if (t < 0.55) cap("Q цэгийг P рүү ойртуулна — h багасна.");
      else if (t < 0.82) cap("h → 0 үед секанс нь ШҮРГЭГЧ рүү шилжинэ.");
      else cap("Шүргэгчийн налуу = f′(2) = 2. Энэ л уламжлал!");
    };
  }

  /* ---------------- Scene: power rule  xⁿ → n·xⁿ⁻¹ ------------------------- */
  function scenePower(svg, cap) {
    // big rule
    const rule = el("text", { x: W / 2, y: 46, "font-size": 26, "text-anchor": "middle", fill: "#1e293b", "font-weight": 800 }, svg);
    rule.textContent = "xⁿ  →  n·xⁿ⁻¹";
    const arc = el("path", { d: "M 232 34 q 26 -22 46 4", fill: "none", stroke: "#f59e0b", "stroke-width": 2.5, "marker-end": "url(#exp-arrow)" }, svg);
    el("text", { x: W / 2, y: 74, "font-size": 12.5, "text-anchor": "middle", fill: "#64748b" }, svg).textContent = "зэргийг урд нь буулгаж, зэргээс 1 хасна";
    const examples = [["x²", "2x¹ = 2x"], ["x³", "3x²"], ["x⁵", "5x⁴"], ["x⁷", "7x⁶"]];
    const exFrom = el("text", { x: 120, y: 150, "font-size": 30, "text-anchor": "middle", fill: "#4f46e5", "font-weight": 800 }, svg);
    const exArr = el("text", { x: 200, y: 150, "font-size": 24, "text-anchor": "middle", fill: "#94a3b8" }, svg);
    exArr.textContent = "→";
    const exTo = el("text", { x: 290, y: 150, "font-size": 30, "text-anchor": "middle", fill: "#10b981", "font-weight": 800 }, svg);
    el("text", { x: W / 2, y: 210, "font-size": 13, "text-anchor": "middle", fill: "#334155" }, svg).textContent = "Дасгал: зэргийг коэффициент болгож буулга →";

    return function (t) {
      const i = Math.min(examples.length - 1, Math.floor(t * examples.length));
      const local = (t * examples.length) % 1;          // 0..1 within this example
      exFrom.textContent = examples[i][0];
      exTo.textContent = examples[i][1];
      const a = local < 0.2 ? local / 0.2 : 1;          // fade-in
      exFrom.setAttribute("opacity", a);
      exArr.setAttribute("opacity", clamp((local - 0.25) / 0.15, 0, 1));
      exTo.setAttribute("opacity", clamp((local - 0.45) / 0.2, 0, 1));
      arc.setAttribute("opacity", 0.4 + 0.6 * Math.abs(Math.sin(t * Math.PI * 2)));
      if (t < 0.28) cap("Зэрэгт функцийн уламжлалын дүрэм.");
      else if (t < 0.6) cap("Зэрэг (n)-ийг урд талд коэффициент болгож буулгана.");
      else cap("Дараа нь зэргийг 1-ээр багасгана: xⁿ → n·xⁿ⁻¹.");
    };
  }

  /* ---------------- Scene: extrema / sign of f′ --------------------------- */
  function sceneExtrema(svg, cap) {
    const f = (x) => x * x * x / 3 - x;   // f'(x)=x²-1, zeros ±1
    const df = (x) => x * x - 1;
    const gr = makeGraph(svg, [40, 16, 330, 180], [-2.4, 2.4, -1.6, 1.6]);
    // colour curve by sign of f' (green up / red down) using segmented paths
    const seg = (a, b, color) => {
      let d = "", first = true;
      for (let i = 0; i <= 60; i++) { const x = lerp(a, b, i / 60); d += (first ? "M" : "L") + gr.X(x).toFixed(1) + " " + gr.Y(f(x)).toFixed(1) + " "; first = false; }
      el("path", { d, fill: "none", stroke: color, "stroke-width": 3.2, "stroke-linecap": "round" }, svg);
    };
    seg(-2.4, -1, "#10b981"); seg(-1, 1, "#ef4444"); seg(1, 2.4, "#10b981");
    // extrema markers
    for (const [ex, lab, col] of [[-1, "Их утга", "#059669"], [1, "Бага утга", "#dc2626"]]) {
      el("circle", { cx: gr.X(ex), cy: gr.Y(f(ex)), r: 4.5, fill: col }, svg);
      el("text", { x: gr.X(ex), y: gr.Y(f(ex)) + (ex < 0 ? -12 : 22), "font-size": 11.5, "text-anchor": "middle", fill: col, "font-weight": 700 }, svg).textContent = lab;
    }
    const tan = el("line", { stroke: "#4f46e5", "stroke-width": 2.4, "stroke-linecap": "round" }, svg);
    const dot = el("circle", { r: 5.5, fill: "#4f46e5" }, svg);
    const signT = el("text", { x: 40, y: 232, "font-size": 13, fill: "#334155", "font-weight": 700 }, svg);

    return function (t) {
      const x = lerp(-2.2, 2.2, ease((Math.sin((t - 0.25) * Math.PI * 2) + 1) / 2)); // sweep back & forth
      const m = df(x), y = f(x), L = 0.7;
      tan.setAttribute("x1", gr.X(x - L)); tan.setAttribute("y1", gr.Y(y - m * L));
      tan.setAttribute("x2", gr.X(x + L)); tan.setAttribute("y2", gr.Y(y + m * L));
      dot.setAttribute("cx", gr.X(x)); dot.setAttribute("cy", gr.Y(y));
      const near = Math.abs(m) < 0.12;
      dot.setAttribute("fill", near ? "#f59e0b" : "#4f46e5");
      signT.textContent = near ? "f′(x) = 0  →  эргэлтийн (экстремум) цэг" :
        (m > 0 ? "f′(x) > 0  →  функц ӨСӨЖ байна" : "f′(x) < 0  →  функц БУУРЧ байна");
      if (t < 0.3) cap("Шүргэгчийн налуу = f′(x). Түүний тэмдгийг ажъя.");
      else if (t < 0.7) cap("f′>0 бол өсөх (ногоон), f′<0 бол буурах (улаан).");
      else cap("f′=0 болох цэгт их/бага утга (экстремум) үүснэ.");
    };
  }

  const SCENES = { "secant-tangent": sceneSecant, "power-rule": scenePower, "extrema": sceneExtrema };

  function mount(container, sceneKey) {
    if (!container || !SCENES[sceneKey]) return;
    container.innerHTML = "";
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", role: "img", style: "display:block;background:#f8fafc;border-radius:12px" });
    // arrow marker (for power rule)
    const defs = el("defs", {}, svg);
    const mk = el("marker", { id: "exp-arrow", markerWidth: 8, markerHeight: 8, refX: 6, refY: 3, orient: "auto", markerUnits: "strokeWidth" }, defs);
    el("path", { d: "M0 0 L6 3 L0 6 z", fill: "#f59e0b" }, mk);
    container.appendChild(svg);

    const cap = document.createElement("p");
    cap.className = "text-sm text-ink-700 mt-2 min-h-[2.5rem] font-medium";
    let capText = "";
    const setCap = (s) => { if (s !== capText) { capText = s; cap.textContent = s; } };
    container.appendChild(cap);

    // controls
    const bar = document.createElement("div");
    bar.className = "flex items-center gap-3 mt-1";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg bg-brand-600 text-white text-sm font-semibold active:scale-95 transition";
    const track = document.createElement("div");
    track.className = "flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden";
    const fill = document.createElement("div");
    fill.className = "h-full bg-brand-500";
    fill.style.width = "0%";
    track.appendChild(fill);
    bar.appendChild(btn); bar.appendChild(track);
    container.appendChild(bar);

    const draw = SCENES[sceneKey](svg, setCap);
    let playing = true, start = null, elapsed = 0;
    const label = () => { btn.textContent = playing ? "⏸ Түр зогсоох" : "▶ Тоглуулах"; };
    label();

    function frame(now) {
      if (!playing) return;
      if (start === null) start = now - elapsed;
      elapsed = now - start;
      const t = (elapsed % LOOP_MS) / LOOP_MS;
      draw(t);
      fill.style.width = (t * 100).toFixed(1) + "%";
      raf = requestAnimationFrame(frame);
    }
    let raf = requestAnimationFrame(frame);
    draw(0);

    btn.addEventListener("click", () => {
      playing = !playing;
      label();
      if (playing) { start = null; raf = requestAnimationFrame(frame); }
      else cancelAnimationFrame(raf);
    });

    // pause when scrolled out of view (perf + battery)
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (!e.isIntersecting && playing) { playing = false; label(); cancelAnimationFrame(raf); }
        });
      }, { threshold: 0.15 });
      io.observe(container);
    }
  }

  window.Explainer = { mount, SCENES };
})();
