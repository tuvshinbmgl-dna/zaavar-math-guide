/* Заавар — гэйм механик давхарга (F-XP, F-DAILY, F-HEARTS, F-BADGES, F-LEVEL)
 *
 * Duolingo-гийн сэдэл механикийг Заавар-т тохируулсан хувилбар. БҮГД localStorage —
 * сервер, бүртгэл шаардахгүй. Тэмцээн (leaderboard) энд БАЙХГҮЙ: түүнд сервер талын
 * бүртгэл зайлшгүй (ARCHITECTURE.md §6).
 *
 * Шийдвэрүүд ба яагаад:
 *  - Зүрх БАЙНА, гэхдээ ЗӨВХӨН шалгалтын горимд, бас хичээл ХААДАГГҮЙ. Duolingo зүрх
 *    дуусахад хичээлийг тасалдаг; манай аппын "алдвал зүгээр" зарчимтай зөрчилдөх тул
 *    зүрх нь зөвхөн "анхаарал" дохио — дүнд нөлөөлнө, хаалт болохгүй.
 *  - XP нь ХИЧЭЭЛ дуусгасанд, тестийн дүнд, streak-д өгөгдөнө. Дахин хийвэл бага XP
 *    (grinding-ээс сэргийлж), гэхдээ 0 биш (дахин үзэхийг цээрлүүлэхгүй).
 *  - Өдрийн зорилтыг хэрэглэгч сонгоно (тайван / хэвийн / шаргуу). Duolingo-гийнх шиг
 *    хатуу бус.
 */

(function () {
  "use strict";

  var G_KEY = "zaavar.gamify";           // ГЛОБАЛ (streak шиг, хичээл хамаарахгүй)
  var DAY_MS = 86400000;

  /* ---- XP хүснэгт ------------------------------------------------------- */
  var XP = {
    lessonFirst: 20,      // хичээлийг анх дуусгасан
    lessonRepeat: 5,      // дахин үзсэн
    levelTestTopic: 15,   // түвшин тогтоох сэдэв
    masteryTopic: 30,     // баталгаа (хамгийн хүнд)
    mockPaper: 25,        // mock хувилбар
    perfectBonus: 10,     // 100% авсан
    streakBonus: 5,       // өдрийн streak үргэлжлүүлсэн
  };

  /* Өдрийн зорилтын хувилбарууд */
  var GOALS = {
    calm:   { xp: 20, label_mn: "Тайван",  desc_mn: "Өдөрт ~1 хичээл" },
    normal: { xp: 50, label_mn: "Хэвийн",  desc_mn: "Өдөрт 2–3 хичээл" },
    hard:   { xp: 100, label_mn: "Шаргуу", desc_mn: "Өдөрт 5 хичээл" },
  };

  /* Түвшин: XP → түвшин. Аажим өсдөг (эхэндээ хурдан, дараа нь удаан). */
  function levelFor(xp) {
    var lvl = 1, need = 100, acc = 0;
    while (xp >= acc + need) { acc += need; lvl += 1; need = Math.round(need * 1.35); }
    return { level: lvl, into: xp - acc, need: need, pct: Math.round(((xp - acc) / need) * 100) };
  }

  /* ---- Тэмдэг (badges) ------------------------------------------------- */
  /* check(s) нь Gamify төлөв + Progress-ийг хүлээж авна. */
  var BADGES = [
    { id: "first-step",  icon: "🌱", name_mn: "Эхний алхам",      desc_mn: "Анхны хичээлээ дуусгасан",        check: function (s) { return s.lessonsDone >= 1; } },
    { id: "ten-lessons", icon: "📚", name_mn: "Арван хичээл",      desc_mn: "10 хичээл дуусгасан",             check: function (s) { return s.lessonsDone >= 10; } },
    { id: "fifty",       icon: "🏛️", name_mn: "Тавин хичээл",      desc_mn: "50 хичээл дуусгасан",             check: function (s) { return s.lessonsDone >= 50; } },
    { id: "week",        icon: "🔥", name_mn: "Долоо хоног",       desc_mn: "7 өдөр дараалан суралцсан",       check: function (s) { return s.streakBest >= 7; } },
    { id: "month",       icon: "⚡", name_mn: "Сар бүтэн",         desc_mn: "30 өдөр дараалан суралцсан",      check: function (s) { return s.streakBest >= 30; } },
    { id: "perfect",     icon: "🎯", name_mn: "Гараагүй",          desc_mn: "Шалгалтад 100% авсан",            check: function (s) { return s.perfects >= 1; } },
    { id: "perfect-10",  icon: "💎", name_mn: "Арван онц",         desc_mn: "10 удаа 100% авсан",              check: function (s) { return s.perfects >= 10; } },
    { id: "mastery-5",   icon: "🛡️", name_mn: "Батлагдсан",        desc_mn: "5 сэдвийн баталгаа давсан",       check: function (s) { return s.masteryPassed >= 5; } },
    { id: "goal-7",      icon: "✅", name_mn: "Тууштай",           desc_mn: "Өдрийн зорилтоо 7 удаа биелүүлсэн", check: function (s) { return s.goalsMet >= 7; } },
    { id: "level-5",     icon: "🌟", name_mn: "5-р түвшин",        desc_mn: "5-р түвшинд хүрсэн",              check: function (s) { return levelFor(s.xp).level >= 5; } },
    { id: "night-owl",   icon: "🦉", name_mn: "Шөнийн шувуу",      desc_mn: "22:00-аас хойш суралцсан",        check: function (s) { return !!s.flags.nightOwl; } },
    { id: "early-bird",  icon: "🌅", name_mn: "Эртийн шувуу",      desc_mn: "07:00-аас өмнө суралцсан",        check: function (s) { return !!s.flags.earlyBird; } },
    { id: "all-subjects",icon: "🧭", name_mn: "Дөрвөн зам",        desc_mn: "4 хичээлээс хичээл дуусгасан",    check: function (s) { return Object.keys(s.subjectsTouched || {}).length >= 4; } },
  ];

  /* ---- Төлөв ----------------------------------------------------------- */
  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function pad(n) { return String(n).padStart(2, "0"); }

  function blank() {
    return {
      xp: 0,
      goal: "normal",
      day: today(),
      dayXp: 0,
      goalsMet: 0,
      hearts: 5,
      heartsDay: today(),
      lessonsDone: 0,
      perfects: 0,
      masteryPassed: 0,
      badges: {},          // id -> ts
      subjectsTouched: {}, // subject -> ts
      flags: {},           // nightOwl / earlyBird
      history: {},         // YYYY-MM-DD -> xp (тайлан, heatmap-д)
    };
  }

  var Gamify = {
    read: function () {
      try {
        var s = JSON.parse(localStorage.getItem(G_KEY));
        if (!s || typeof s !== "object") return blank();
        var b = blank();
        for (var k in b) if (!(k in s)) s[k] = b[k];
        return s;
      } catch (e) { return blank(); }
    },
    write: function (s) {
      try { localStorage.setItem(G_KEY, JSON.stringify(s)); } catch (e) { /* quota */ }
    },

    /* Өдөр солигдоход өдрийн тоолуур ба зүрхийг сэргээнэ. */
    _roll: function (s) {
      var t = today();
      if (s.day !== t) { s.day = t; s.dayXp = 0; }
      if (s.heartsDay !== t) { s.heartsDay = t; s.hearts = 5; }
      return s;
    },

    state: function () {
      var s = this._roll(this.read());
      var lv = levelFor(s.xp);
      var goal = GOALS[s.goal] || GOALS.normal;
      return {
        xp: s.xp, dayXp: s.dayXp, goalXp: goal.xp, goalKey: s.goal, goalLabel: goal.label_mn,
        goalPct: Math.min(100, Math.round((s.dayXp / goal.xp) * 100)),
        goalDone: s.dayXp >= goal.xp,
        level: lv.level, levelPct: lv.pct, levelInto: lv.into, levelNeed: lv.need,
        hearts: s.hearts, badges: s.badges, goalsMet: s.goalsMet,
        lessonsDone: s.lessonsDone, perfects: s.perfects, masteryPassed: s.masteryPassed,
        history: s.history,
      };
    },

    setGoal: function (key) {
      if (!GOALS[key]) return;
      var s = this._roll(this.read());
      s.goal = key; this.write(s); this.render();
    },

    goals: function () { return GOALS; },
    badgeList: function () { return BADGES; },
    levelFor: levelFor,

    /* XP нэмэх цөм. reason нь XP хүснэгтийн түлхүүр эсвэл тоо. */
    award: function (amount, meta) {
      var s = this._roll(this.read());
      var before = { level: levelFor(s.xp).level, goalDone: s.dayXp >= (GOALS[s.goal] || GOALS.normal).xp };
      s.xp += amount;
      s.dayXp += amount;
      s.history[s.day] = (s.history[s.day] || 0) + amount;

      // цагийн тэмдэг
      var h = new Date().getHours();
      if (h >= 22 || h < 2) s.flags.nightOwl = true;
      if (h < 7) s.flags.earlyBird = true;

      if (meta && meta.subject) s.subjectsTouched[meta.subject] = Date.now();
      if (meta && meta.perfect) s.perfects += 1;
      if (meta && meta.lesson) s.lessonsDone += 1;
      if (meta && meta.masteryPassed) s.masteryPassed += 1;

      var goalXp = (GOALS[s.goal] || GOALS.normal).xp;
      var goalNowDone = s.dayXp >= goalXp;
      if (goalNowDone && !before.goalDone) s.goalsMet += 1;

      // тэмдэг шалгах
      var snap = {
        xp: s.xp, lessonsDone: s.lessonsDone, perfects: s.perfects,
        masteryPassed: s.masteryPassed, goalsMet: s.goalsMet, flags: s.flags,
        subjectsTouched: s.subjectsTouched,
        streakBest: (function () { try { return Streak.get().best; } catch (e) { return 0; } })(),
      };
      var earned = [];
      for (var i = 0; i < BADGES.length; i++) {
        var b = BADGES[i];
        if (!s.badges[b.id] && b.check(snap)) { s.badges[b.id] = Date.now(); earned.push(b); }
      }

      var after = levelFor(s.xp);
      this.write(s);
      this.render();

      var ev = {
        amount: amount,
        xp: s.xp,
        leveledUp: after.level > before.level,
        level: after.level,
        goalJustMet: goalNowDone && !before.goalDone,
        badges: earned,
      };
      this._toast(ev);
      return ev;
    },

    /* Түгээмэл тохиолдлууд */
    lessonComplete: function (lessonId, score, subject) {
      var s = this._roll(this.read());
      var first = !(s.history && false); // хичээлийн давхардлыг Progress хариуцна
      var repeat = (typeof Progress !== "undefined") && Progress.lessonDone && Progress.lessonDone(lessonId);
      var amt = repeat ? XP.lessonRepeat : XP.lessonFirst;
      if (score === 100) amt += XP.perfectBonus;
      return this.award(amt, { lesson: !repeat, perfect: score === 100, subject: subject });
    },
    levelTestComplete: function (score, subject) {
      var amt = XP.levelTestTopic + (score === 100 ? XP.perfectBonus : 0);
      return this.award(amt, { perfect: score === 100, subject: subject });
    },
    masteryComplete: function (passed, subject) {
      return this.award(passed ? XP.masteryTopic : Math.round(XP.masteryTopic / 3),
        { masteryPassed: passed, subject: subject });
    },
    mockComplete: function (score, subject) {
      var amt = XP.mockPaper + (score === 100 ? XP.perfectBonus : 0);
      return this.award(amt, { perfect: score === 100, subject: subject });
    },
    streakExtended: function () { return this.award(XP.streakBonus, {}); },

    /* Зүрх — зөвхөн дохио, хичээлийг ХААХГҮЙ */
    loseHeart: function () {
      var s = this._roll(this.read());
      s.hearts = Math.max(0, s.hearts - 1);
      this.write(s); this.render();
      return s.hearts;
    },
    refillHearts: function () {
      var s = this._roll(this.read());
      s.hearts = 5; this.write(s); this.render();
    },

    /* ---- Толгой дахь дүрслэл ------------------------------------------- */
    render: function () {
      var slot = document.getElementById("gamify-slot");
      if (!slot) return;
      var st = this.state();
      slot.innerHTML =
        '<span class="inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full bg-indigo-50 text-indigo-700" title="Түвшин ' + st.level + ' · ' + st.levelInto + '/' + st.levelNeed + ' XP">' +
          '<span>⭐</span>' + st.level +
        '</span>' +
        '<span class="inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ' +
          (st.goalDone ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500") +
          '" title="Өдрийн зорилт: ' + st.dayXp + '/' + st.goalXp + ' XP">' +
          '<span>' + (st.goalDone ? "✅" : "⚡") + '</span>' + st.dayXp + "/" + st.goalXp +
        '</span>' +
        '<span class="inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ' +
          (st.hearts > 2 ? "bg-rose-50 text-rose-600" : st.hearts > 0 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-400") +
          '" title="Анхаарлын зүрх — өдөр бүр 5 болж сэргэнэ. Хичээлийг хаахгүй.">' +
          '<span>' + (st.hearts > 0 ? "❤️" : "🩶") + '</span>' + st.hearts +
        '</span>';
    },

    /* ---- Toast ---------------------------------------------------------- */
    _toast: function (ev) {
      if (!ev || (!ev.amount && !ev.badges.length)) return;
      var host = document.getElementById("gamify-toasts");
      if (!host) {
        host = document.createElement("div");
        host.id = "gamify-toasts";
        host.className = "fixed z-50 bottom-24 sm:bottom-6 right-4 flex flex-col gap-2 items-end pointer-events-none";
        document.body.appendChild(host);
      }
      var msgs = [];
      if (ev.amount) msgs.push({ icon: "⚡", text: "+" + ev.amount + " XP" });
      if (ev.goalJustMet) msgs.push({ icon: "✅", text: "Өдрийн зорилт биеллээ!" });
      if (ev.leveledUp) msgs.push({ icon: "🌟", text: ev.level + "-р түвшинд хүрлээ!" });
      for (var i = 0; i < ev.badges.length; i++) {
        msgs.push({ icon: ev.badges[i].icon, text: "Шинэ тэмдэг: " + ev.badges[i].name_mn });
      }
      msgs.forEach(function (m, i) {
        setTimeout(function () {
          var el = document.createElement("div");
          el.className = "px-4 py-2 rounded-xl bg-white shadow-lg border border-slate-200 text-sm font-semibold text-ink-800 flex items-center gap-2 transition-all duration-300 translate-y-2 opacity-0";
          el.innerHTML = '<span class="text-lg">' + m.icon + "</span><span>" + m.text + "</span>";
          host.appendChild(el);
          requestAnimationFrame(function () { el.classList.remove("translate-y-2", "opacity-0"); });
          setTimeout(function () {
            el.classList.add("opacity-0", "translate-y-2");
            setTimeout(function () { el.remove(); }, 300);
          }, 2600);
        }, i * 400);
      });
    },
  };

  window.Gamify = Gamify;
  window.addEventListener("load", function () { Gamify.render(); });
})();
