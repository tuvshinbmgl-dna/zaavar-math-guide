# Заавар (Zaavar) — Project Handover

> A Mongolian-language **self-study platform** for national-curriculum school subjects.
> Guide lessons + level test + mastery confirmation + AI textbook-router tutor + daily streak.
> **Live:** https://zaavar-math-guide.onrender.com · **Repo:** github.com/tuvshinbmgl-dna/zaavar-math-guide · **Local:** `~/math-guide`

This document is written for a **fresh Claude with zero conversation context**. Read it fully before making changes.

---

## 1. What this is & who it's for

A prototype (now fairly mature) that lets a Mongolian student **learn a subject ALONE** from the national textbook — which is too hard to self-study from. Three pillars:
1. **Guide** — scaffolded lessons that make the textbook self-learnable.
2. **Assessment** — a per-topic "Түвшин тогтоох шалгалт" (level test) + a "Баталгаа" mastery-confirmation layer that catches lucky-clicking, + a 10-version mock test.
3. **AI tutor** ("AI багш") — a Socratic tutor + a router that answers "which lesson/section of MY textbook should I study?".

Design target: a real student on any device (mobile-first), no login/DB. First real student tester (2026-07) praised it (clear lessons, works on any device, "it's OK to get it wrong" is encouraging) and asked for more worked examples, a streak, and more subjects — all since delivered.

**4 subjects live:** Математик (10/11/12), Физик (7/8/9/10/11), Мэдээллийн технологи (12), Англи хэл (12).

---

## 2. Quick start

**Run locally** (Python 3.9+; no Node, no DB):
```bash
cd ~/math-guide
python3 app.py            # → http://127.0.0.1:5001  (or ./run.sh)
# AI tutor is OFF unless ANTHROPIC_API_KEY is set:
ANTHROPIC_API_KEY=sk-... python3 app.py
```
The guide + assessment + streak work fully **without** an API key; only the AI tutor/router need one.

**Dependencies:** `pip install -r requirements.txt` (Flask + gunicorn; the Claude client is stdlib `urllib`, no anthropic SDK).

---

## 3. Architecture & tech stack

- **Backend:** Flask (`app.py`) + a read-only data layer (`store.py`) that loads all JSON content at import time. No database — content is static JSON under `data/`.
- **Frontend:** server-rendered Jinja2 templates + **Tailwind (Play CDN)** + **Alpine.js** + **KaTeX** (auto-render). **Zero build step.**
- **AI:** `claude_client.py` (stdlib urllib wrapper). Tutor model = Sonnet (streamed, Socratic); router = Haiku (structured question→lesson). Reads `ANTHROPIC_API_KEY` from env.
- **State:** 100% browser **localStorage** (progress, level-test, mastery, streak, profile). No accounts/DB.
- **Hosting:** Render free tier (gunicorn), Cloudflare in front. Deploy files: `Procfile`, `render.yaml`, `requirements.txt`.

---

## 4. Directory structure

```
app.py                     Flask routes (pages + JSON APIs)
store.py                   Data layer — subject-aware; all public fns take a `subject` arg
claude_client.py           stdlib Claude API client (tutor stream + structured route)
templates/                 base, home, curriculum, lesson, leveltest, mastery, mock, report, chat, not_found
static/js/  app.js         Progress + Streak + KaTeX render + SSE + `richtext`/renderRich (fenced code)
            profile.js     Local student profile (name+PIN, header chip, "start fresh" reset)
            explainers.js  Hand-built animated SVG explainers for 3 derivative lessons
static/css/ app.css
data/
  curriculum.json          Math curriculum (grades 10/11/12)
  level_test.json          Math level test (40 topics, ~338 Q)
  mastery_bank.json        Math mastery (9 topics)
  knowledge_graph.json     Math-only prereq graph (drives AI router + prerequisites)
  diagnostic.json          Legacy adaptive diagnostic pool (MATH-ONLY, mostly unused)
  lessons/*.json           42 math lessons (g10-*, g11-*, g12-*)
  physics/  {curriculum,level_test,mastery_bank}.json + lessons/p{7,8,9,10,11}-*.json  (66 lessons)
  it/       {curriculum,level_test,mastery_bank}.json + lessons/it-*.json   (11 lessons)
  english/  {curriculum,level_test,mastery_bank}.json + lessons/en-*.json   (10 lessons)
docs/authoring/            Reusable content-generation workflow scripts (see §11)
docs/superpowers/          Older specs/plans
```

Lesson-id prefixes are unique per subject: `g*` math, `p7-*`/`p8-*`/`p9-*`/`p10-*`/`p11-*` physics, `it-*` IT, `en-*` English.

---

## 5. Subjects & content (current)

| subject key | Name | Grades | Lessons | Level topics | Mastery topics | Source |
|---|---|---|---|---|---|---|
| `math` | Математик | 10,11,12 | 42 | 40 | 9 | econtent books 279/273/343 |
| `physics` | Физик | 7,8,9,10,11 | 66 | 66 | 63 | g7: 2019 core-curriculum PDF (Ф7.1–Ф7.4); g8–11: econtent textbook ГАРЧИГ (books 306/320/258/269) |
| `it` | Мэдээллийн технологи | 12 | 11 | 11 | 11 | **ESIS** textbook PDF (Small Basic) |
| `english` | Англи хэл | 12 | 10 | 10 | 10 | **ESIS** textbook PDF (CEFR ~B1, bilingual) |

**Authenticity model (IMPORTANT — the user cares a lot about this):** the user asks for "номын хэллэг" (textbook wording), NOT made-up content. Reality:
- econtent.edu.mn books are **image-only flipbooks** (can't extract text) and are **MECSS copyright** → cannot copy their prose verbatim (legally/technically), and the flipbook **cannot deep-link** to a page.
- **ESIS CDN hosts text-parseable official textbook PDFs** — use these! e.g. `https://cdn.esis.edu.mn/cover/12/12_medeelliin%20technology.pdf` (IT-12, 148pp), `https://cdn.esis.edu.mn/cover/12/12_english.pdf` (English-12, 244pp). Download + parse with PyMuPDF (`pip install pymupdf`).
- The **2019 core-curriculum standard** gives authentic learning-objective codes (physics used `Ф7.1`…). Basic-ed (grades 6-9) PDF: `https://cdn.greensoft.mn/uploads/users/2649/files/Curriculum/EBS/Suuri.pdf`. Upper-secondary standard is listed at `moe.gov.mn/curriculum-buren-dund` (the mier.mn PDF links there are currently DEAD/empty — use ESIS or econtent readers instead).
- The delivered approach (accepted by the user): **anchor every lesson to authentic official structure/objectives + textbook page refs, write scaffolding/examples in standard terminology.** Do NOT copy copyrighted prose verbatim onto the public site.

- **Reading an econtent flipbook's table of contents (ГАРЧИГ) without a PDF** — the page images are directly addressable, so you can screenshot the contents page in a real browser instead of clicking through the reader:
  `https://econtent.edu.mn/content/<N>rangi/<subject>/pages/<subject>-<book_id>-<page>.jpg`
  e.g. `.../content/8rangi/fizik/pages/fizik-306-3.jpg`. The image index equals the printed page number (index 0 = cover). ГАРЧИГ sits at index 3 (physics 8) or 4–5 (physics 9/10/11). This is how the grade 8–11 physics structure was obtained; `mier.mn` curriculum PDFs are **dead** (connection refused) and ESIS has no physics file under the `cover/<grade>/<grade>_<subject>.pdf` naming.

Textbook `reader_url` per subject points at the econtent reader (`more.php?id=NNN`): math g10=279/g11=273/g12=343, physics g7=291/g8=306/g9=320/g10=258/g11=269, IT=340, English=357.

---

## 6. Data model (author content in this exact shape)

**`data/<subject>/curriculum.json`**
```jsonc
{ "note": "...", "grades": [ { "grade": 12, "title_mn": "...", "book_id": 340,
  "reader_url": "https://econtent.edu.mn/pages/more.php?id=340",
  "chapters": [ { "num": "I", "title_mn": "...", "title_en": "...", "deep": true,
    "lessons": [ { "num": "1.1", "title_mn": "...", "lesson_id": "it-1-1", "skill_id": "it-ict-trends" } ] } ] } ] }
```

**`data/<subject>/lessons/<id>.json`**
```jsonc
{ "id": "it-1-1", "grade": 12, "chapter_num": "I", "chapter_title_mn": "...",
  "lesson_num": "1.1", "title_mn": "...", "title_en": "...", "skill_id": "it-ict-trends",
  "prerequisite_skill_ids": [],
  "textbook": { "book_id": 340, "pages_mn": "Бүлэг I ...", "reader_url": "https://econtent.edu.mn/pages/more.php?id=340" },
  "objectives_mn": ["...", "..."],
  "pretest": { "stem_mn": "...", "latex": "", "choices": ["a","b","c","d"], "answer": 0, "explanation_mn": "..." },
  "sections": [ { "type": "concept|definition|example", "title_mn": "...", "body_mn": "**bold**, `code`, ```fenced```, $math$" } ],
  "practice": [ { "stem_mn": "...", "latex": "", "choices": ["..x4.."], "answer": 0, "hint_mn": "...", "solution_mn": "..." } ],
  "mastery_check": [ { ...same shape as practice... } ] }
```

**`data/<subject>/level_test.json`** — answers stay SERVER-SIDE (never sent to client via `/api/leveltest/questions`).
```jsonc
{ "note": "...", "topics": [ { "skill_id": "it-loops", "title_mn": "...", "lesson_id": "it-4-3",
  "pages_mn": "...", "grade": 12,
  "questions": [ { "id": "lt-it-loops-1", "skill_id": "it-loops", "difficulty": 1,
    "stem_mn": "...", "latex": "", "choices": ["..x4.."], "answer": 2, "explanation_mn": "..." } ]  // 10 per topic
  } ] }
```
Grading falls back `solution_mn or explanation_mn` (math uses solution_mn, others explanation_mn — keep this dual support).

**`data/<subject>/mastery_bank.json`** — ordering steps are stored in CORRECT order but SHUFFLED before sending (order never leaks); two-tier answers stay server-side.
```jsonc
{ "note": "...", "topics": [ { "skill_id": "it-loops", "title_mn": "...", "lesson_id": "it-4-3",
  "ordering": [ { "id": "mo-it-loops-1", "stem_mn": "...", "latex": "", "steps": ["step1","step2","step3"] } ],
  "two_tier": [ { "id": "mt-it-loops-1", "stem_mn": "...", "latex": "",
    "t1_choices": ["..x4.."], "t1_answer": 1, "t2_prompt_mn": "Яагаад?",
    "t2_choices": ["..x4.."], "t2_answer": 0, "misconception_mn": "what a wrong t2 reveals" } ] } ] }
```

`latex` is a **bare fragment** (no `$...$` — templates add the delimiters). Leave it `""` for IT/English (no math).

---

## 7. Subject-aware system (how multi-subject works)

- Active subject = the **`subject` cookie** (`math|physics|it|english`), validated in `app._subject()`; default `math`.
- Switch via **`GET /set-subject/<subject>?next=<path>`** (sets cookie, redirects). Header has an Alpine **dropdown** selector (was pills — switched to dropdown so it scales past 2 subjects).
- `store._SUBJ` holds one bundle per subject (`curriculum/leveltest/mastery/lessons/level_topics/mastery_topics/level_idx`); **every public store fn takes `subject` as its first arg**. `app.context_processor` injects `subject`, `subject_name`, `subjects` into every template.
- `knowledge_graph.json` + the legacy adaptive diagnostic are **MATH-ONLY**. For subjects with no graph, `router_catalog(subject)` is built from lessons, and the AI router (`/api/route`) resolves lessons straight from the catalog.

**To add a NEW subject:**
1. `mkdir -p data/<key>/lessons`; create `curriculum.json` (+ empty `level_test.json`/`mastery_bank.json` stubs `{"note":"","topics":[]}`).
2. Add to `store.SUBJECTS` and to `store._SUBJ` (one `_load_subject(...)` line).
3. Author lessons + level test + mastery in the shape above (see §11 for the workflow approach).
4. Everything else (routes, templates, selector, grading, streak) is already subject-generic.

---

## 8. State management (localStorage)

All learner state is **subject-scoped** except the profile and the streak:
| key | scope | holds |
|---|---|---|
| `zaavar.<subject>.progress.v1` | per subject | `{lessons:{id:{done,score,ts}}, last:{id,title,ts}, diagnostic}` (via `Progress` in app.js) |
| `zaavar.<subject>.progress.<lessonId>` | per subject | per-lesson resume/stage state |
| `zaavar.<subject>.leveltest` | per subject | `{topics:{skill_id:{score,level_mn,band,...}}}` |
| `zaavar.<subject>.mastery` | per subject | `{topics:{sk:[attempts]}, latest:{sk:{verdict,band}}, mocks:[...]}` |
| `zaavar.<subject>.lastLesson` | per subject | last lesson id |
| `zaavar.streak` | **GLOBAL** | `{count,best,last(YYYY-MM-DD),freezes}` — one streak spans all subjects |
| `zaavar.profile` | GLOBAL | `{name,pin,created}` |

- Subject is exposed to JS via `window.ZAAVAR_SUBJECT` (set in base.html before app.js); app.js uses `zKey(name)` → `zaavar.<subject>.<name>`. Templates interpolate `'zaavar.{{ subject }}.<name>'`.
- **Streak** (app.js `Streak`): gentle — consecutive-day `ping()` increments; a single missed day is bridged by a freeze (earned every 7-day milestone, max 2); bigger gap resets to 1. Fired by `zaavarActivity()` on lesson pass + level/mastery/mock grade. 🔥 chip in header (`#streak-slot`) + home card.
- **"Start fresh"** (profile.js `clearRecords`) purges **every** `zaavar.*` key except `zaavar.profile`.
- ⚠️ If you add a subject-scoped key, it MUST include `{{ subject }}` (or `zKey`) or math/physics/it/english state will collide (this was a real HIGH-severity bug — see §12).

---

## 9. AI tutor (optional)

- `/chat` (AI багш) + a per-lesson tutor FAB. `/api/tutor` streams a Socratic answer (never gives the answer outright; recommends which lesson/grade/chapter to study). `/api/route` maps a free-form question → the exact lesson via the subject's `router_catalog`.
- **Requires `ANTHROPIC_API_KEY`.** It is intentionally **blank on the live site** — the user must set it in Render → Environment to enable AI. I never enter secrets. Everything else works without it.

---

## 10. Deploy pipeline

1. `git push origin main` (credential is stored in macOS osxkeychain; push works without prompting).
2. **Render does NOT auto-deploy reliably** — trigger a **manual** deploy: Render dashboard (dashboard.render.com, account `tuvshinbmgl@gmail.com`, org "DNA", service `srv-d91qgbjsq97s73dn9b20`) → **Manual Deploy → Deploy latest commit**. Drive it via the browser tools if needed (the extension's Chrome must be logged into Render). Free instance spins down (~50s cold start).
3. **VERIFY LIVE CORRECTLY** — onrender.com gzip-compresses responses via Cloudflare. **Do NOT** trust `curl URL | wc -c` / `grep` (they see compressed bytes → false negatives). Instead compare **decompressed byte length to a local `test_client()` render** — they match exactly when deployed:
   ```python
   import app, urllib.request, gzip
   c = app.app.test_client(); c.set_cookie("subject","math")
   local = len(c.get("/lesson/g10-10-1").data)
   req = urllib.request.Request("https://zaavar-math-guide.onrender.com/lesson/g10-10-1",
         headers={"Cookie":"subject=math","Accept-Encoding":"gzip"})
   r = urllib.request.urlopen(req, timeout=60); raw = r.read()
   if r.headers.get("Content-Encoding")=="gzip": raw = gzip.decompress(raw)
   print(local, len(raw), local==len(raw))   # → equal when the deploy is live
   ```
   Render → Logs (gunicorn access log) shows the true response size too. (A whole session was nearly lost chasing a phantom "not deployed" that was really a gzip measurement bug.)

---

## 11. Content authoring (how the content was made — reusable)

Content was generated with **Claude Code `Workflow` (multi-agent)** — an author→adversarial-verify pipeline per topic, with `StructuredOutput` JSON schemas matching §6. Reference scripts live in **`docs/authoring/`**:
- `physics_wf.js` — physics grade-7 (11 topics: lesson + 10 level Q + mastery), author→verify.
- `physics_g8_wf.js` — physics grade-8 (14 topics), same shape, anchored to the Физик VIII ГАРЧИГ + page ranges.
- `physics_upper_wf.js` — physics grades **9, 10, 11** in one script; pick the grade with `Workflow({scriptPath, args:{grade:10}})`. 41 topics total.
- `write_physics_grade.py` — **merging** writer: appends/replaces level-test + mastery topics by `skill_id` and **rebuilds `curriculum.json` from whatever lessons are on disk**, so earlier grades are never clobbered. Run with `PHYSICS_DIR=<repo>/data/physics python3 write_physics_grade.py topics_g9.json topics_g10.json …`.
- `it_en_wf.js` — IT + English grade-12 (21 topics), subject-branched prompts (IT = Small Basic code; English = bilingual grammar).
- `enhance_wf.js` — appends +2 worked examples + +2 detailed-solution practice to EXISTING lessons (purely additive).
- `write_physics.py` / `write_subjects.py` — write a workflow's `{topics:[...]}` output into per-subject `data/` files.
- `append_enhancements.py` — append `enhance_wf.js` output to existing lessons.

Pattern to add/expand content: (1) get authentic structure from the ESIS textbook PDF; (2) write `curriculum.json`; (3) adapt a `*_wf.js` (feed it real objectives + documented misconceptions); (4) run `Workflow({scriptPath})`; (5) extract `result.topics` from the task output file; (6) run the matching `write_*.py`; (7) **`html.unescape`** every string (the write scripts already do — see §12); (8) validate + render-test locally; (9) commit + deploy + verify (§10).

The workflow scripts take their work-list via `args`. **`args` arrives in the script as a JSON STRING** — parse it: `let L = typeof args==='string' ? JSON.parse(args) : args`.

---

## 12. Recurring gotchas (these WILL bite you)

1. **HTML entities in `$...$` / code** — agent-authored content emits `&gt; &lt; &amp;` inside math/code. ALWAYS `html.unescape()` before writing JSON, or KaTeX renders the literal entity. (Write scripts do this.)
2. **`x-data="fn({{ x|tojson }})"` breaks Alpine** — `tojson` emits double-quotes inside the double-quoted attribute. Use `<script>window.__x = {{ x|tojson }}</script>` + `x-data="fn(window.__x)"`, or for a list use a Jinja `... | tojson` expression assigned inside the component object.
3. **`latex` must be a bare fragment** — templates wrap it in `$…$`/`$$…$$`. If a `latex` value already contains `$`, you get `$$…$$` (wrong). Matrix `&` column separators are fine (browser decodes `&amp;`→`&` before KaTeX reads textContent).
3b. **Two KaTeX inputs that LOOK fine but throw** (found 2026-07-28 — they render as red raw source because `throwOnError:false`, so they are easy to ship unnoticed):
   - **`\,^` — a spacing macro immediately before a script.** `$20\,^\circ C$` → `Got group of unknown type: 'internal'`. Hits every temperature written the natural LaTeX way. Fix: give the script a base — `$20\,{}^\circ C$`. Same for `\;^`, `\!^`, `\,_`. A plain `\ ^` is fine.
   - **`·` (U+00B7) inside `\text{}`.** `$\text{кВт·ц}$` → `Undefined control sequence: \cdotp`. Fix: `$\text{кВт}\cdot\text{ц}$`.
   **Sweep for these before every deploy** — extract every `$…$` span from `data/**/*.json` and run `katex.renderToString(span, {throwOnError:true})` in a browser console (KaTeX is already loaded on any app page). 11 449 spans validate in a few seconds. Grepping for the two patterns above is the cheap version.
4. **Fenced code blocks** — IT lessons use ```` ``` ````-fenced Small Basic. `richtext` (app.py) + `renderRich` (app.js) split code out FIRST (regex on ` ``` `), so code adjacent to text on the next line still renders. Inline `` `code` `` too.
5. **localStorage must be subject-scoped** (§8) — unscoped keys make subjects' progress collide/overwrite.
6. **Deploy verification via gzip** — §10. Byte-match to local; don't grep compressed curl output.
7. **`Progress` global** — reference as `typeof Progress !== 'undefined'`, not `window.Progress` (it's a top-level `const`).
8. **econtent flipbook can't deep-link** — show page numbers in `pages_mn`; don't fake a `?page=` URL.
9. **Grading expects a plain index list** — `/api/leveltest/grade` `answers` is a list of chosen indices aligned to questions (NOT `{id,choice}` dicts). Mock/mastery use `{id,choice/t1/t2,ms}`.

---

## 13. Verification checklist (run before every deploy)

```bash
cd ~/math-guide
python3 -c "import app, store; print('import OK')"
python3 - <<'PY'
import json, glob
for f in glob.glob("data/**/*.json", recursive=True):
    json.loads(open(f,encoding="utf-8").read())   # all JSON valid
print("json OK")
import app; c=app.app.test_client()
for s in ["math","physics","it","english"]:
    c.set_cookie("subject", s)
    codes=[c.get(p).status_code for p in ["/","/curriculum","/diagnostic","/mastery","/mock","/report","/chat"]]
    assert all(x==200 for x in codes), (s, codes)
print("all pages 200 for all subjects")
PY
```
Then (optional, high-value) load a couple of lessons in a real browser and confirm KaTeX/code render + 0 console errors. Deploy (§10), then byte-match live==local.

---

## 14. Status & possible next steps

**Done & live (2026-07):** 4 subjects with lessons+level-test+mastery; per-grade level test; mastery-confirmation (ordering + two-tier + rapid-guess filter + verdict); 10-version mock; local profile; daily streak; subject dropdown; +106 worked examples & +106 detailed-solution practice across all math+physics lessons; AI tutor/router (needs key). Full functional audit (17 defects) fixed.

**Added 2026-07-28 — physics grades 8, 9, 10, 11 (+55 lessons, 550 level-test Q, 54 mastery topics):**
- Structure taken from the **authentic econtent ГАРЧИГ** of books 306 / 320 / 258 / 269, read page-image by page-image in a real browser (see §5). `pages_mn` therefore carries a real chapter + page range, e.g. `Бүлэг II. Механик хөдөлгөөн ба механик энерги, 60–67 тал`.
- Authored by `physics_g8_wf.js` + `physics_upper_wf.js` (author→adversarial-verify, 110 agents, 0 errors), merged with `write_physics_grade.py`.
- Verified: 143/143 JSON valid; every one of the 66 physics lesson pages returns 200; level-test/mastery/mock APIs leak no answer keys; grading round-trips 100% per grade. **200 numeric questions were re-solved from scratch by independent auditor agents — 0 wrong answer keys.**
- **`/mock` is now grade-aware** (`store.mock_grades()`, `mock_version(subject, v, grade)`, `grade` in the `/api/mock/version` payload, grade tabs in `mock.html`). Without this the physics mock would have been 132 items; it is now 22–28 per grade, and math dropped from 80 to ~30. Omitting `grade` keeps the old all-topics behaviour.

**Known pre-existing defect (NOT introduced by the above):** ~172 occurrences of **Cyrillic inside KaTeX math mode** (e.g. `$\rho_{бие}$`, `$V_{дундаж}$`) in shipped content — `data/physics/lessons/p7-1-3, p7-1-4, p7-1-6, p7-3-1`, physics `level_test.json` / `mastery_bank.json` (grade-7 topics only), and `data/lessons/g10-15-1.json` (116 of them). `throwOnError:false` stops it from crashing, but KaTeX has no Cyrillic glyphs in math fonts so the subscripts render cramped and mis-set. Fix is mechanical: wrap in `\text{…}` (`$\rho_{\text{бие}}$`). The grade 8–11 content is already clean — the verify agents caught and fixed these at authoring time.

**Not done / ideas (nothing is blocking):**
- Turn on AI: user adds `ANTHROPIC_API_KEY` in Render → Environment.
- Reconnect Render auto-deploy webhook so pushes deploy automatically (currently manual).
- More grade-12 subjects the user mentioned (Хими, Биологи, Нийгэм) — same pipeline; ESIS has their PDFs (`cdn.esis.edu.mn/cover/12/…`).
- Enrich the thinner math-12 chapters (currently 1 lesson each) and add ЭЕШ-format mock papers.
- MECSS permission before promoting the public site (copyright flag on textbook-derived content).
- Streak best-practice tuning (deep-research couldn't verify streak-specific citations; current gentle design is standard).

**Access:** GitHub `tuvshinbmgl-dna/zaavar-math-guide` (push cred in osxkeychain). Render account `tuvshinbmgl@gmail.com` / org DNA / service `srv-d91qgbjsq97s73dn9b20`. Do not enter secrets on the user's behalf — direct them to do it.

**Working style the user expects:** move fast, use parallel agents/workflows for big content jobs, don't over-ask, be honest about limits (esp. the textbook-copyright/authenticity reality), verify before claiming done.
