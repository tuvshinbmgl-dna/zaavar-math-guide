# Заавар — handoff prompt for a terminal Claude Code session

> Start a fresh `claude` session from
> `C:\Users\tuvsh\Claude\Projects\EDM - Secondary education\zaavar-math-guide`
> and read this file first.
>
> Last updated: **2026-08-04** · run `git log --oneline origin/main..HEAD` for the
> real unpushed list rather than trusting a number written here.

---

## 0a. 12-р ангийн контент — БАРАГ ДУУССАН (2026-08-04)

12-р ангийн **9 хичээл** бэлэн: Математик, Мэдээллийн технологи, Англи хэл,
Монгол хэл, Эрүүл мэнд, Уран зохиол, **Дизайн технологи**, **Орос хэл**,
**Иргэний ёс зүй**. Сүүлийн гурвыг 2026-08-04-нд нэмсэн (`G12-COMPLETE`).

**Үлдсэн ганц ном: Үндэсний бичиг (Монгол бичиг) XII — 337.**
ГАРЧИГ нь 3-р хуудсанд, бүхэлдээ **босоо монгол бичгээр**. Хуудсыг татаж,
эргүүлж, томруулж уншихыг оролдоод бүтэц (3 бүлэг + ~11 бичлэг) харагдсан ч
нэрийг үсэгчлэн найдвартай гаргаж чадсангүй. **Эзнээс бичсэн ГАРЧИГ хүсэх
хэрэгтэй** — дэлгэрэнгүй `docs/authoring/toc-grade12.md` §5-д.
Хуудасны зураг татагддаг нь батлагдсан:
`https://econtent.edu.mn/content/12rangi/monb/pages/monb-337-<N>.jpg` (ГАРЧИГ = 3).

**Шинэ ном нэмэх бол** `ARCHITECTURE.md` §5-ын «Шинэ хичээл нэмэх дараалал»-ыг
дага. Workflow-ийн үр дүнг чат руу буцаахын оронд `W-JOURNAL`-ийг ашигла —
хэдэн МБ-ын JSON-г дискнээс шууд авна, тасарсан ажиллагаанаас ч сэргээнэ:

```
python docs/authoring/wf_result_from_journal.py <run_dir> /tmp/<slug>.json
SUBJECT_DIR="$PWD/data/<slug>" SUBJECT_TITLE="<Гарчиг>" \
  BOOK_MAP='{"12": <book_id>}' python docs/authoring/write_subject.py /tmp/<slug>.json
python docs/authoring/audit_content.py data/<slug>      # exit 0 байх ёстой
```

---

## 0. Chat rules (the owner asked for these explicitly)

1. **Replies under 30 words.**
2. **English.**

Long output goes in files, not in chat. Same rules in `CHAT-RULES.md`.

---

## 1. What this is

Flask + Jinja2 + Tailwind (Play CDN) + Alpine.js + KaTeX. **Zero build step.
No database. No login.** Content is static JSON under `data/`; every learner
state lives in the browser's `localStorage`. Hosted on Render, **manual deploy**.

```
pip install -r requirements.txt
python app.py            # http://127.0.0.1:5001   <- 5001, not 5000
```

`ANTHROPIC_API_KEY` is optional — without it the AI tutor is off, nothing else
changes.

---

## 2. Read these before changing anything

| File | Why |
|---|---|
| `ARCHITECTURE.md` | The system index. Every part has an ID: `F-` feature, `A-` API, `D-` data, `S-` server, `T-` template, `J-` client script, `X-` external, `W-` authoring tool. |
| `CHANGELOG.md` | One entry per change, newest first, each with **Хөндсөн хэсэг / Юу өөрчлөгдсөн / Шалгасан арга / Буцаах**. |
| `docs/CLEANUP-PLAN.md` | **NEW.** 62 verified findings, ranked. Read before touching code. |

**Standing rule from the owner:** every change updates *both* — `ARCHITECTURE.md`
so the index stays true, and a new `CHANGELOG.md` entry so any bug can be rolled
back or traced. This is not optional.

Docs are written in Mongolian. Match whatever file you are editing.

---

## 3. State right now

### Unpushed commits — do this first

```
git log --oneline -4      # 0acd4e9, c6fb4d1, 57af0cf unpushed
git push origin main
```

Then trigger a manual deploy on Render (`zaavar-guide`,
`srv-d9kdg6qjobas738i5fng`) — it does not auto-deploy.
⚠️ But read `docs/CLEANUP-PLAN.md` §5 **O1** first — **two Render services are
live** and one serves a stale build.

### Content shipped — 7 subjects, 172 lessons

| Subject | `data/` dir | Lessons | Book |
|---|---|---|---|
| Математик 10–12 | `data/lessons/` | 42 | 279 / 273 / 343 |
| Физик 7–11 | `data/physics/` | 66 | 291 / 306 / 320 / 258 / 269 |
| Мэдээллийн технологи 12 | `data/it/` | 11 | 340 |
| Англи хэл 12 | `data/english/` | 10 | 357 |
| Монгол хэл 12 | `data/mongolian/` | 8 | 339 |
| Эрүүл мэнд 12 | `data/health/` | 17 | 413 |
| **Уран зохиол 12** | `data/uran/` | **18** | **336** |

---

## 4. What the previous session did (2026-08-03)

1. **Уран зохиол 12** — 18 lessons, 180 questions, 18 mastery topics. (`0acd4e9`)
2. **`docs/authoring/audit_content.py`** — static content checker. (`57af0cf`)
3. **`docs/CLEANUP-PLAN.md`** — 13-agent repo audit, 62 verified findings. (`c6fb4d1`)
4. **Re-ran Health 12 by mistake.** A second session was working the same repo
   and had already committed it (`1a739bf`). Both versions were equivalent, so
   the committed one was kept and the duplicate discarded.
5. Removed a stale `.git/index.lock` (no git process, 0 bytes, frozen 78 min).

---

## 5. URGENT — 4 real bugs found

Full detail in `docs/CLEANUP-PLAN.md` §3.1. The first two were hand-verified.

| # | Bug | Fix |
|---|---|---|
| **B1** 🔴 | `/lesson/<id>` never checks which subject owns the lesson. With cookie `math`, opening a health lesson writes progress to `zaavar.math.*` — **cross-subject data corruption**. | `app.py:137`. `store.lesson_subject()` **already exists and is never called** — use it to override the template context's `subject`. |
| **B2** 🔴 | `mastery.html:211` tests `verdict === 'confirmed'`, but `store._verdict()` (`store.py:414`) only ever returns `"Батлагдсан"` / band `"ready"` → **never true**. So `mastery-5` badge is unreachable and the `q-mastery` quest **shows but cannot be completed**. | Change to `g.band === 'ready'`. No server change needed. |
| **B3** 🔴 | `/quests` has **no mobile entry point** — the bottom tab bar has 5 tabs and none is quests; the gems chip lives in a `hidden sm:flex` slot. On phones the whole F-QUESTS economy is dead. | `base.html:96` — `grid-cols-5` → `grid-cols-6`. |
| **O1** 🔴 | **Two live Render services.** `zaavar-guide.onrender.com` (current) and `zaavar-math-guide.onrender.com` (**no gamify.js — a pre-gamify build still public**). | Owner's decision. `CLEANUP-PLAN.md` §5 O1. |

---

## 6. What to do next (owner's order: 12 → 11 → 10 → 9)

`docs/authoring/toc-grade12.md` already holds these books' **contents pages
read from econtent** — do not re-read the flipbooks.

1. Дизайн технологи **341** — 6 chapters, 22 lessons
2. Орос хэл **344** — 3 modules, 21 topics
3. Иргэний ёс зүй **431** — 3 chapters, ~30 sub-topics
4. **Монгол бичиг 337 — deferred.** Its contents page is entirely traditional
   vertical script and could not be read reliably. **Ask the owner for a typed
   ГАРЧИГ before attempting it.**

Then grades 11, 10, 9.

`docs/BACKEND-PLAN.md` (leaderboard, payments, admin) — **do not start without
the owner's decision.** §4.1 flags that charging for MECSS-derived content is a
copyright risk, and any account system triggers minors' data-protection duties.

---

## 7. How to add a subject

```
1. Write SPECS from toc-grade12.md   ->  docs/authoring/<subject>_wf.js
2. Run the workflow                  ->  result JSON
3. SUBJECT_DIR=data/<s> SUBJECT_TITLE="…" BOOK_MAP='{"12":NNN}' \
     python docs/authoring/write_subject.py <result.json>
4. Add to SUBJECTS + _SUBJ in store.py
5. python docs/authoring/audit_content.py data/<s>     <- must exit 0
6. ARCHITECTURE.md §5 + a CHANGELOG.md entry
```

Empty subjects auto-hide (`SUBJECT-AUTOHIDE-1`), so step 4 is safe to do early.

### ⚠️ Make the mastery schema STRICT

`uran_g12_wf.js` declared MASTERY as `type: ['object','null']`, so **11 of 18
authors returned `mastery: null`** without violating the schema — no error was
raised. In new workflows always use `type: 'object'` with explicit
`minItems`/`maxItems` on `ordering` and `two_tier`. Backfill example:
`docs/authoring/uran_g12_mastery_patch_wf.js`.

### ⚠️ Derive `lesson_id` from disk, never by hand

The backfill run was given hand-written lesson ids and **7 of 11 were wrong**.
Build the `skill_id → id` map programmatically from `data/<s>/lessons/*.json`,
and when merging, force `skill_id`/`lesson_id`/`title_mn` from the lesson on disk.

---

## 8. Gotchas — do not rediscover these

**KaTeX — the old note was WRONG.** `ARCHITECTURE.md` §6 used to say Cyrillic
inside `$…$` "fails silently". Tested against the app's real config
(katex 0.16.11, `{throwOnError:false}`) and **disproved**:

- `\,^` → returns `katex-error`. **Really breaks.** (currently 0 in content)
- bare Cyrillic (`8\,см^3`) → **renders**, console warning only. It comes out in
  math italic, so `\mathrm{см}` is still correct style — but it is **not** a break.
- `\text{Cyrillic}` → clean.

`audit_content.py` treats the first as an ERROR and the second as a WARNING.

**Line endings.** `.gitattributes` forces LF. `write_subject.py` writes CRLF on
Windows, so `git add` prints CRLF warnings — **that is normal**. If everything
looks modified, check `git diff --ignore-cr-at-eol --stat` before panicking.

**econtent has no deep links.** The reader hardcodes `startPage:0` and disables
TOC and thumbnails. Page images are directly addressable at
`econtent.edu.mn/content/<N>rangi/<slug>/pages/<slug>-<book_id>-<page>.jpg`
(0 = cover; get `<slug>` from `document.images[0].src` on `more.php?id=<book_id>`).
**Do not display those images in the app** — `ARCHITECTURE.md` §7: written MECSS
permission is required. `BookRef.MODE` in `templates/lesson.html` is `"cite"`
today and flips to `"page"` in one line the day permission arrives.

**Literature copyright.** `uran_g12_wf.js` forbids reproducing primary text,
caps quotes at 15 words once per lesson, and makes the verifier's first job
hunting for copied passages. Every practice passage is an original "загвар
бичвэр" labelled as such inline. **Keep that guard in any literature work.**

**localStorage keys must be subject-scoped.** Everything except `zaavar.streak`,
`zaavar.profile` and `zaavar.gamify` is namespaced `zaavar.<subject>.*`.
Forgetting this once caused a real cross-subject data-overwrite bug. (B1 above
is a surviving instance of exactly this class.)

**Book IDs** (`econtent.edu.mn/pages/more.php?id=`): Math 10→279, 11→273,
12→343 · Physics 7→291, 8→306, 9→320, 10→258, 11→269 · IT 12→340 ·
English 12→357 · Mongolian 12→339 · Health 12→413 · Literature 12→336 ·
Mongol bichig 12→337 · Design tech 12→341 · Russian 12→344 · Civic ethics 12→431.

---

## 9. Verify before you commit

```powershell
# 1. Content audit — must exit 0
python docs/authoring/audit_content.py

# 2. Every page of every subject
python -c "
import app, store; c=app.app.test_client()
for s in store.SUBJECTS:
    c.set_cookie('subject', s)
    codes=[c.get(p).status_code for p in ['/','/path','/quests','/curriculum','/diagnostic','/mastery','/mock','/report','/chat']]
    bad=[l for l in store._SUBJ[s]['lessons'] if c.get('/lesson/'+l).status_code!=200]
    print(s, 'all200' if set(codes)=={200} else codes, 'lessons', len(store._SUBJ[s]['lessons']), bad or 'OK')
"

# 3. JS syntax
node --check static/js/gamify.js
```

`audit_content.py` already covers `curriculum.json`→`lesson_id` links, choice
counts, answer indices, unclosed `$`, `\,^` and HTML entities. A `lesson_id` of
`null` is intentional — `path.html` renders it as a non-clickable "soon" node.

---

## 10. Ask the owner before

- Starting any backend work (`docs/BACKEND-PLAN.md`).
- Publishing textbook page images (`BookRef.MODE = "page"`).
- Adding a subject whose ГАРЧИГ you had to guess at (especially **Монгол бичиг 337**).
- Anything in `docs/CLEANUP-PLAN.md` §5 (especially **O1** — the Render services).
- Deleting `_to_delete/` (`CLEANUP-PLAN.md` A19 — run `git fsck` first).
