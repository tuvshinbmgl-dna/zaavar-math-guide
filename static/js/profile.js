/* Заавар — lightweight local student profile (name + optional PIN).
   No backend. Records (progress/leveltest/mastery) live in the existing flat
   localStorage keys; the profile just names the learner + gates a shared device
   and powers "start fresh". Renders a header chip into #profile-slot. */
(function () {
  "use strict";
  const KEY = "zaavar.profile";

  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } }
  function write(p) { localStorage.setItem(KEY, JSON.stringify(p)); }

  const Profile = {
    get() { return read(); },
    name() { const p = read(); return p ? p.name : null; },
    set(name, pin) {
      name = (name || "").trim();
      if (!name) return false;
      write({ name: name, pin: (pin || "").trim(), created: new Date().toISOString() });
      this.renderChip();
      return true;
    },
    clearRecords() {
      // Purge ALL learner records across both subjects (progress/leveltest/
      // mastery/lastLesson/diagnostic + per-lesson keys), keeping only the
      // profile itself. Iterate from the end since removal shifts indices.
      for (var i = localStorage.length - 1; i >= 0; i--) {
        var k = localStorage.key(i);
        if (k && k.indexOf("zaavar.") === 0 && k !== KEY) localStorage.removeItem(k);
      }
    },
    reset() { localStorage.removeItem(KEY); this.clearRecords(); this.renderChip(); },

    renderChip() {
      const slot = document.getElementById("profile-slot");
      if (!slot) return;
      const p = read();
      slot.innerHTML = "";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-xs font-semibold " +
        (p ? "bg-brand-50 text-brand-700 hover:bg-brand-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200");
      btn.innerHTML = p
        ? '<span class="grid place-items-center w-4 h-4 rounded-full bg-brand-600 text-white text-[9px]">' +
            (p.name[0] || "•").toUpperCase() + '</span>' + escapeHtml(p.name)
        : "👤 Нэвтрэх";
      btn.addEventListener("click", function () { Profile.openModal(); });
      slot.appendChild(btn);
    },

    openModal() {
      if (document.getElementById("profile-modal")) return;
      const p = read();
      const wrap = document.createElement("div");
      wrap.id = "profile-modal";
      wrap.style.cssText = "position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:rgba(15,23,42,.45);padding:16px";
      wrap.innerHTML =
        '<div style="background:#fff;border-radius:1rem;max-width:22rem;width:100%;padding:1.25rem" role="dialog" aria-modal="true">' +
          '<div style="font-weight:800;font-size:1.05rem;color:#0f172a;margin-bottom:.25rem">' +
            (p ? "Сурагчийн профайл" : "Тавтай морил! 👋") + '</div>' +
          '<p style="font-size:.8rem;color:#64748b;margin-bottom:.85rem">' +
            (p ? "Нэрээ солих, эсвэл бүртгэлээ цэвэрлэж шинээр эхлэх." :
                 "Нэрээ оруулбал ахиц дэвшлээ хадгалж, тайлангаа харна. (Заавал биш)") + '</p>' +
          '<input id="pm-name" placeholder="Нэр" value="' + (p ? escapeAttr(p.name) : "") + '" ' +
            'style="width:100%;box-sizing:border-box;min-height:44px;border:1.5px solid #e2e8f0;border-radius:.7rem;padding:0 .8rem;margin-bottom:.5rem;font-size:.95rem">' +
          '<input id="pm-pin" inputmode="numeric" maxlength="4" placeholder="PIN (4 орон, сонголтоор)" value="' + (p ? escapeAttr(p.pin || "") : "") + '" ' +
            'style="width:100%;box-sizing:border-box;min-height:44px;border:1.5px solid #e2e8f0;border-radius:.7rem;padding:0 .8rem;margin-bottom:.9rem;font-size:.95rem">' +
          '<div style="display:flex;gap:.5rem">' +
            '<button id="pm-save" style="flex:1;min-height:44px;border:0;border-radius:.7rem;background:#4f46e5;color:#fff;font-weight:700;font-size:.9rem;cursor:pointer">Хадгалах</button>' +
            '<button id="pm-close" style="min-height:44px;padding:0 1rem;border:1px solid #e2e8f0;border-radius:.7rem;background:#fff;color:#334155;font-weight:600;font-size:.9rem;cursor:pointer">Хаах</button>' +
          '</div>' +
          (p ? '<button id="pm-reset" style="width:100%;margin-top:.6rem;min-height:40px;border:0;background:transparent;color:#e11d48;font-size:.8rem;cursor:pointer">Бүртгэлээ цэвэрлэж шинээр эхлэх</button>' : "") +
        '</div>';
      document.body.appendChild(wrap);
      const close = function () { wrap.remove(); };
      wrap.addEventListener("click", function (e) { if (e.target === wrap) close(); });
      document.getElementById("pm-close").addEventListener("click", close);
      document.getElementById("pm-save").addEventListener("click", function () {
        const name = document.getElementById("pm-name").value;
        const pin = document.getElementById("pm-pin").value;
        if (name.trim()) { Profile.set(name, pin); close(); location.reload(); }
        else { document.getElementById("pm-name").style.borderColor = "#ef4444"; }
      });
      const rb = document.getElementById("pm-reset");
      if (rb) rb.addEventListener("click", function () {
        if (confirm("Бүх ахиц, оноо, тайлан устна. Итгэлтэй байна уу?")) { Profile.reset(); close(); location.reload(); }
      });
      setTimeout(function () { const n = document.getElementById("pm-name"); if (n) n.focus(); }, 50);
    },
  };

  function escapeHtml(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function escapeAttr(s) { return String(s).replace(/"/g, "&quot;"); }

  window.Profile = Profile;
  document.addEventListener("DOMContentLoaded", function () { Profile.renderChip(); });
})();
