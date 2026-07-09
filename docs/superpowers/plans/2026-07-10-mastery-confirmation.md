# Баталгаа (Mastery Confirmation) Implementation Plan

> Execution: inline (executing-plans style), fast. Verification per task = local server curl + browser console check (project has no pytest suite; scoring logic gets a Python `assert` smoke-check).

**Goal:** Verify GENUINE understanding (not lucky clicks) per derivative topic + a comprehensive mock, with a local student profile and a longitudinal report.

**Architecture:** Flask + Jinja + Alpine + KaTeX, localStorage per profile. New mastery bank (ordering + two-tier items) authored by workflow; mock = seeded sample from the combined pool; rapid-guess via client timing. Answers server-side.

## Global Constraints
- All UI text Mongolian. Math in `$...$` (KaTeX). Touch targets ≥44px, no horizontal overflow.
- NEVER pass arrays/objects via `x-data="fn({{ x|tojson }})"` (breaks the attribute) — use `<script>window.__x={{x|tojson}}</script>` then `x-data="fn(window.__x)"`. `ai_enabled|tojson`→bool is fine.
- `Progress`/globals are `const` — guard with `typeof X !== 'undefined'`, not `window.X`.
- Answers/solutions never sent in `/questions`-style endpoints.

## File Structure
- Create `data/mastery_bank.json` — per-topic {ordering[], two_tier[]} (from workflow).
- Create `static/js/profile.js` — profile CRUD + localStorage snapshot/restore; global `Profile`.
- Modify `store.py` — mastery + mock loaders/graders.
- Modify `app.py` — `/api/mastery/*`, `/api/mock/*`, `/report` route.
- Create `templates/mastery.html` — per-topic confirmation check.
- Create `templates/mock.html` — 10-version comprehensive exam.
- Create `templates/report.html` — longitudinal log.
- Modify `templates/base.html` (nav +Тайлан), `home.html` (profile chip + report link), `leveltest.html` (link to "Ойлголтоо батал"), `static/js/app.js` (profile include hook if needed).

---

### Task 1: Profile system (`static/js/profile.js` + base.html include + first-run modal)
**Produces:** global `Profile` with `.active()`, `.list()`, `.use(name,pin?)`, `.create(name,pin?)`, `.remove(name)`; snapshots flat keys (`zaavar.progress.v1`, `zaavar.leveltest`, `zaavar.mastery`, `zaavar.lastLesson`) into `zaavar.profiles[name]` on switch, restores on use.
- Storage: `zaavar.profiles={name:{data:{},pin,created}}`, `zaavar.activeProfile`.
- base.html: include profile.js; header shows active-name chip → modal (create/switch/PIN).
- Verify: browser — create "Тест", reload → name persists; switch creates isolated set; console clean.

### Task 2: mastery_bank.json + store.py loaders (safe questions)
- Load `mastery_bank.json`. `mastery_topics()`→[{skill_id,title_mn,lesson_id,n_order,n_tier}]; `mastery_items(topic)`→ordering (stem/steps SHUFFLED, no correct order leaked as "answer" beyond the list the client must arrange) + two_tier (stems + t1_choices + t2_prompt + t2_choices; NO t1_answer/t2_answer/misconception).
- Verify: `python3 -c "import store; print(len(store.mastery_topics()))"` = 9; questions endpoint has no `*_answer`.

### Task 3: store.py graders + app.py endpoints
- `grade_mastery(topic, responses)`: responses = {ordering:[{id,order:[idx...]}], two_tier:[{id,t1,t2,ms}]}. Score: ordering partial = frac correct position; two_tier: both→1, t1-right/t2-wrong→0.5+`rote` flag; rapid if ms<floor. Return per-item feedback (correct order, correct answers, solution/misconception) + `answerPct,reasonPct,orderPct,rapidPct,verdict,gap`.
- Verdict rule: 🟢 if answerPct≥80 & reasonPct≥80 & rapidPct<20 & orderPct≥70; else 🟡/🔴 + gap string.
- `POST /api/mastery/check {topic}` (safe items), `POST /api/mastery/grade {topic,responses}`.
- Smoke: `assert` scoring in a python one-liner; curl grade → verdict.

### Task 4: mastery.html (per-topic confirmation check)
- topic picker (reuse level_topics list) OR entered via `?topic=`. Renders ordering (tap-to-order list, up/down or click-sequence) + two-tier (answer then reveal "Яагаад?" tier). Tracks per-item `ms` (Date-less: use performance.now via a start stamp) for rapid detection.
- On submit → `/api/mastery/grade` → verdict banner + per-item review (correct order, correct reason, misconception note) + save to `zaavar.mastery.topics[skill]`.
- Verify browser: full flow, 0 console errors, verdict shows, rote/rapid flags surface.

### Task 5: Mock test — store.py mock + app.py + mock.html (10 versions)
- Pool = level_test items + mastery two_tier (answer-only view). `mock_version(v)` (v=0..9): seeded deterministic sample of ~12 items (structure fixed: sample per topic) — seed = v so versions are stable/distinct; no answers sent. `grade_mock(v, responses)` → per-topic pct + overall + rapidPct + per-item review.
- `POST /api/mock/version {v}`, `POST /api/mock/grade {v,responses}`.
- mock.html: pick version 1–10 (or "санамсаргүй"), answer, submit → formative score + byTopic + rapid note; save to `zaavar.mastery.mocks[]`.
- Verify: 2 versions differ; grade returns byTopic; browser clean.

### Task 6: report.html + /report + integrations
- `/report` renders report.html (client reads `zaavar.mastery`): per-topic timeline (attempts, current verdict+gap, "оноо өндөр ч ойлголт сул" flag), mock history with consecutive deltas ("Өмнөх 60→78 +18") + per-concept movement.
- base.html nav +"Тайлан"; home profile chip + "Тайлан"; leveltest result → "Ойлголтоо батал →" (link `/mastery?topic=<skill>` — via a new `/mastery` route or reuse) ; mastery result → "Mock тест өгөх".
- Verify browser: after doing a check + a mock, report shows timeline + deltas; nav works; 0 console errors.

### Task 7: Deploy
- Commit all; push; confirm live (explainers/leveltest already blocked on Render — coordinate with user).

## Self-Review notes
- Spec coverage: profile(T1), items(T2), scoring/verdict+rapid(T3), confirmation UI(T4), mock 10-ver(T5), report+integration(T6). ✓
- Parameterization simplified to seeded sampling (formative, honest per research) — documented deviation from spec §4.3/§6, acceptable for speed; true param deferred.
- x-data/tojson + typeof-guard constraints carried into every template task.
