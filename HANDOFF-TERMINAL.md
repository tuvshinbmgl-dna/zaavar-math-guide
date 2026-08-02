# Заавар — handoff prompt for a terminal Claude Code session

> Paste everything below the line into a fresh `claude` session started from
> `C:\Users\tuvsh\Claude\Projects\EDM - Secondary education\zaavar-math-guide`.
> Read it once, verify the "First 5 minutes" checks, then continue.

---

You are taking over **Заавар (Zaavar)** — a Mongolian-language self-study platform
for secondary school. The previous session ran in a cloud sandbox and could not
reach github.com; you are running on the owner's own machine, so you can.

## 0. Chat rules (the owner asked for these explicitly)

1. **Replies under 30 words.**
2. **English.**

Long output goes in files, not in chat.

## 1. What this is

Flask + Jinja2 + Tailwind (Play CDN) + Alpine.js + KaTeX. **Zero build step. No
database. No login.** Content is static JSON under `data/`; every learner state
lives in the browser's `localStorage`. Hosted on Render at
<https://zaavar-guide.onrender.com> (manual deploy, free instance).

Run it:

```
pip install -r requirements.txt
python app.py           # http://127.0.0.1:5000
```

`ANTHROPIC_API_KEY` is optional — without it the AI tutor is simply off.

## 2. Read these two files before changing anything

| File | Why |
|---|---|
| `ARCHITECTURE.md` | The system index. Every part has an ID (`F-` feature, `A-` API, `D-` data, `S-` server module, `T-` template, `J-` client script, `X-` external). |
| `CHANGELOG.md` | One entry per change, newest first, each with **Хөндсөн хэсэг / Юу өөрчлөгдсөн / Шалгасан арга / Буцаах**. |

**Standing rule from the owner:** every change updates *both* — `ARCHITECTURE.md`
so the index stays true, and a new `CHANGELOG.md` entry so any bug can be rolled
back or traced. This is not optional; it is the reason those files exist.

Docs are written in Mongolian. Commit messages and code comments in the recent
commits are English/Mongolian mixed — match whatever file you are editing.

## 3. State right now

### Unpushed commits — do this first

The branch is **4 commits ahead of `origin/main`**:

```
6c27c4a Add Health 12 and Literature 12 authoring workflows
6448e50 Document grade-12 textbook contents read from econtent
e38e290 Add daily quests, gems, shop and backend research plan
a075802 Add Mongolian 12, report gamify summary, LF normalization
```

```
git push origin main
```

Then trigger a manual deploy on Render (service `zaavar-guide`,
`srv-d9kdg6qjobas738i5fng`) — it does not auto-deploy.

### Content shipped

| Subject | `data/` dir | Lessons |
|---|---|---|
| Математик 10–12 | `data/lessons/` | 42 |
| Физик 7–11 | `data/physics/` | 66 |
| Мэдээллийн технологи 12 | `data/it/` | 11 |
| Англи хэл 12 | `data/english/` | 10 |
| Монгол хэл 12 | `data/mongolian/` | 8 |

**137 lessons total.**

### Content in flight (needs restarting on your machine)

Two authoring workflows were running in the cloud sandbox and **did not finish**.
Their scripts are committed; the generated content was **not** — you need to
re-run them:

- `docs/authoring/health_g12_wf.js` — Эрүүл мэнд 12 (book 413), 17 topics.
  Was ~11/34 agents in when the sandbox session ended.
- `docs/authoring/uran_g12_wf.js` — Уран зохиол 12 (book 336), 18 works.
  Was ~2/36 agents in; paused deliberately so Health could use the CPUs.

The cloud sandbox had only 2 CPUs, which is why these crawled. On a real machine
they should be much faster.

## 4. How the authoring pipeline works

Each subject gets a `Workflow` script in `docs/authoring/`. The shape is always:

```
SPECS (one entry per lesson, taken from the real textbook ГАРЧИГ)
  → agent(authorPrompt)  → BUNDLE schema  { lesson, level_questions[10], mastery }
  → agent(verifyPrompt)  → VBUNDLE schema { ...BUNDLE, notes }
```

`pipeline()` runs author→verify per topic with no barrier. The verifier is
**adversarial** — its prompt tells it to hunt for wrong answer indices, copied
text, false facts, and taste-based questions.

Then a writer script turns the workflow result into `data/<subject>/`:

```
SUBJECT_DIR=data/health SUBJECT_TITLE="Эрүүл мэнд" BOOK_MAP='{"12":413}' \
  python docs/authoring/write_subject.py <result.json>
```

`write_subject.py` is generic (any subject); `write_physics_grade.py` is the
physics-specific one that merges grades without clobbering earlier ones.

To add a subject you also add it to `SUBJECTS` and `_SUBJ` in `store.py`. You do
**not** need to guard against empty content — `SUBJECT-AUTOHIDE-1` filters any
subject with no lesson files out of the picker automatically.

## 5. What to do next (owner's stated order)

The owner wants **grade 12 first, then 11, 10, 9, downward**.

1. Re-run `health_g12_wf.js`, write with `write_subject.py`, verify, commit, push.
2. Re-run `uran_g12_wf.js`, same.
3. Author the remaining grade-12 books. `docs/authoring/toc-grade12.md` already
   contains their **contents pages read from econtent**, plus the special rules
   each one needs — use it as the SPECS source, do not re-read the flipbooks:
   - Дизайн технологи 341 — 6 chapters, 22 lessons
   - Орос хэл 344 — 3 modules, 21 topics
   - Иргэний ёс зүй 431 — 3 chapters, ~30 sub-topics
   - **Монгол бичиг 337 — deferred.** Its contents page is entirely traditional
     vertical script and the chapter titles could not be read reliably. Ask the
     owner for a typed ГАРЧИГ before attempting it.
4. Then grade 11, 10, 9 for the subjects that have them.

`docs/BACKEND-PLAN.md` covers the three features that genuinely need a server
(leaderboard, payments, admin panel). **Do not start those without the owner's
decision** — §4.1 flags that charging for MECSS-derived content is a copyright
risk, and any account system triggers minors' data-protection obligations.

## 6. Gotchas that already cost time — do not rediscover these

**KaTeX fails silently.** Two patterns produced 59 invisible failures:
`\,^` (spacing macro before a script) and `·` (U+00B7) inside `\text{}`. Never
put Cyrillic inside `$...$`. To audit, run `katex.renderToString(span,
{throwOnError:true})` over every math span in a browser — a visual check will
not catch it.

**Line endings.** `.gitattributes` now forces LF. If `git status` ever shows
every file as modified again, that is CRLF, not real changes — check with
`git diff --ignore-cr-at-eol --stat` before panicking.

**econtent has no deep links.** Its reader hardcodes `startPage:0` and disables
the TOC and thumbnails, so you cannot link to a page. Page images are directly
addressable at
`econtent.edu.mn/content/<N>rangi/<slug>/pages/<slug>-<book_id>-<page>.jpg`
(index = printed page number, 0 = cover) — get `<slug>` from
`document.images[0].src` on `more.php?id=<book_id>`. **Do not display those
images in the app**: `ARCHITECTURE.md` §7 explains that MECSS permission is
required. `BookRef.MODE` in `templates/lesson.html` is `"cite"` today and
flips to `"page"` in one line the day written permission arrives.

**Copyright in literature lessons.** `uran_g12_wf.js` forbids reproducing any
primary text, caps quotes at 15 words once per lesson, and makes the verifier's
first job hunting for copied passages. Keep that guard in any literature work.

**Book IDs** (`econtent.edu.mn/pages/more.php?id=`): Math 10→279, 11→273,
12→343 · Physics 7→291, 8→306, 9→320, 10→258, 11→269 · IT 12→340 ·
English 12→357 · Mongolian 12→339 · Health 12→413 · Literature 12→336 ·
Mongol bichig 12→337 · Design tech 12→341 · Russian 12→344 · Civic ethics 12→431.

**localStorage keys must be subject-scoped.** Everything except
`zaavar.streak`, `zaavar.profile` and `zaavar.gamify` is namespaced
`zaavar.<subject>.*`. Forgetting this once caused a real cross-subject
data-overwrite bug.

## 7. Verify before you commit

```
python -c "
import app; c=app.app.test_client()
for s in ['math','physics','it','english','mongolian']:
    c.set_cookie('subject', s)
    print(s, [c.get(p).status_code for p in
      ['/','/path','/quests','/curriculum','/diagnostic','/mastery','/mock','/report','/chat']])
"
node --check static/js/gamify.js
python -c "
import json,glob
for f in glob.glob('data/**/*.json', recursive=True): json.load(open(f, encoding='utf-8'))
print('all json valid')
"
```

Also check that every `lesson_id` referenced in a `curriculum.json` either has a
file in `lessons/` or is `null` — `templates/path.html` renders `null` as a
non-clickable "soon" node, but a *wrong* id renders a broken link.

## 8. First 5 minutes

1. `git log --oneline -6` and `git status` — expect 4 unpushed commits, clean tree.
2. `git push origin main`.
3. `python app.py`, open `/quests` and `/path`, confirm they render.
4. Read `ARCHITECTURE.md` §6 and §8, and `docs/authoring/toc-grade12.md`.
5. Re-run `docs/authoring/health_g12_wf.js`.

Ask the owner before: starting any backend work, publishing textbook page
images, or adding a subject whose ГАРЧИГ you had to guess at.
