# "Баталгаа" — Ойлголт батлах давхарга (Mastery Confirmation Layer)

**Date:** 2026-07-10
**App:** Заавар (math-guide) — Flask, localStorage-only client state, deployed on Render free tier
**Status:** Design approved (Approach A). Awaiting spec review → writing-plans.

## 1. Problem & Goal

Students can currently click through the level test and land a lucky-correct score without real understanding ("click hiiseer baigaad zuv onoo avchihval yag sursan esehee medehgui gap"). The goal is to **re-verify genuine conceptual understanding** — not just answer-correctness — and let a student (and their parent/teacher) **see improvement over time** from a personal record.

**Success:** For each derivative topic and for a comprehensive mock exam, the app can distinguish "🟢 truly understood" from "🟡 partial" / "🔴 weak / probably guessing," backed by *multiple independent signals*, and shows the student a longitudinal report that connects consecutive attempts.

### Non-goals (YAGNI)
- No real authentication / passwords / cross-device sync (see §3).
- No teacher dashboard / central roster (local profile only).
- No confidence-rating tier (user declined; replaced by rapid-guess time tracking — see §5.3).
- No high-stakes "certification" claim from a single test (research: a short test is formative only — see §7).

## 2. Research grounding (deep-research, 2026-07-10)

Verified findings that shape the design (full report: workflow wf_432cc516-c9e):
- **OMC + misconception distractors** (high): write every distractor to map to a specific misconception so *which* wrong answer is chosen diagnoses understanding. Our existing 90 level-test items already use misconception-based distractors; new items add explicit `misconception` tags.
- **Two-tier "why"** (high): answer + reason. `tier1-correct & tier2-wrong` ⇒ lucky/rote → the core "not truly understood" flag. Keep reason options **short & linguistically simple** (Mongolian readers — avoid measuring reading load).
- **Ordering items + partial credit** (medium): expose *where* the procedure breaks; score by fraction in correct position, not all-or-nothing.
- **Parameterized isomorphs** (high): vary numbers, hold structure fixed → defeats answer-memorization; BUT versions are **not guaranteed equal difficulty** (±~10%), so treat mock scores as **formative**, keep item structure fixed across versions.
- **Thresholds** (medium): a 12-item test reached only α≈0.67 — fine for formative feedback, insufficient to *certify* individual mastery (want 0.80+). ⇒ require **multiple signals** and repeated confirmation, never a single lucky score.
- **Rapid-guess filtering** (high): flag non-effortful (too-fast) responses **post-hoc** — no proctoring. This directly targets the "lucky click" gap and substitutes for the declined confidence tier.

## 3. Student profile (local, no backend)

**Decision:** lightweight local profile (name + optional 4-digit PIN), stored in `localStorage`. No server, works on the current free tier, private.

- `zaavar.profiles = { "<name>": { progress, leveltest, mastery, lastLesson, created } }`
- `zaavar.activeProfile = "<name>"`
- First visit → modal: "Нэрээ оруул" + optional PIN. Header shows a name chip → switch/new/reset profile.
- **Non-invasive integration:** existing code reads flat keys (`zaavar.progress.v1`, `zaavar.leveltest`). A thin `static/js/profile.js` manages profiles by **snapshotting** the flat working-set keys into `zaavar.profiles[old]` on switch and **restoring** `zaavar.profiles[new]` back into the flat keys. Existing readers/writers stay untouched. PIN is a soft separator (keep siblings' records apart on a shared device), *not* real security.

## 4. Item types (new `data/mastery_bank.json`, per topic)

Authored per derivative topic via a parallel Workflow (same pattern as level_test.json), all answers/solutions **server-side only**.

1. **`order`** — a stem + N solution steps; student arranges them (tap-to-order or pick-the-correct-ordering on mobile). Field: `steps` (correct order), scored by fraction in correct absolute position.
2. **`two_tier`** — `tier1` (answer MCQ) then `tier2` ("Яагаад?" reason MCQ, short options). Correct = both. Records the `tier1/tier2` pattern.
3. **`param`** — a parameterized template: number slots + a Python expression for the correct value + distractor generators tied to misconceptions. Server renders fresh numbers per request; answer never leaves the server.

Every MCQ-style option carries an optional `misconception` label for diagnostic reporting.

## 5. Scoring & the mastery signal

### 5.1 Per-item scoring
- `two_tier`: 1.0 if both tiers right; **0.5 "азаар/цээжээр" (flagged)** if tier1 right & tier2 wrong; 0 otherwise.
- `order`: partial credit = (# steps in correct position) / N.
- `param`/MCQ: 1/0, plus misconception tag on wrong.

### 5.2 Topic verdict (multi-signal, formative)
Computed over a topic's confirmation check (mix of the 3 types). A topic is **🟢 "Батлагдсан"** only if ALL hold:
- `answerPct ≥ 80` AND
- `reasonPct ≥ 80` (two-tier tier-2 accuracy) AND
- `rapidPct < 20` (see 5.3) AND
- `orderPct ≥ 70`.
Else **🟡 "Гүйцэд биш"** or **🔴 "Сул"**, annotated with the *specific* gap, e.g.:
- high answer, low reason → "хариу зөв ч шалтгаан сул → цээжилсэн байж магадгүй";
- high rapidPct → "хэт хурдан таамагласан — дахин анхааралтай бод";
- low orderPct → "алхмуудын дараалал бүрхэг".

### 5.3 Rapid-guess detection
Client records `ms` per item. Server (or client) flags an item `rapid` if answered faster than a per-type floor (e.g. compute item < 3000ms, reason tier < 2500ms). Flagged items are **excluded** from the "confirmed" signal and surfaced in the report. Thresholds live in one config for easy tuning.

## 6. Mock test (10 versions)

- **Comprehensive**: ~15 items sampling all 9 topics, mixing the 3 item types.
- **10 versions** via `param` number variation + sampling from the pool; **structure held fixed** across versions to control difficulty.
- Scored **formatively** (not certification). Produces `byTopic` breakdown + overall + `rapidPct`.
- After submission: per-item review with solutions + a per-topic verdict roll-up.

## 7. Report / log (longitudinal) — `zaavar.mastery`

```
zaavar.mastery = {
  topics: { <skill_id>: [ {ts, answerPct, reasonPct, orderPct, rapidPct, verdict, gap} ] },
  mocks:  [ {ts, version, score, byTopic:{<skill_id>:pct}, rapidPct} ]
}
```

**"Тайлан" page** (new nav item or under Түвшин тогтоох):
- Per-topic **timeline** of confirmation attempts (improvement trend) + current verdict + the specific gap.
- **Mock history** that *connects consecutive attempts*: "Өмнөх 60 → одоо 78, +18", per-concept movement.
- **Explicitly flags** topics where score is high but reason/rapid signals say "not truly understood" — the core anti-guessing surface.

## 8. Backend & units

- **`static/js/profile.js`** — profile CRUD + localStorage snapshot/restore. One purpose, no deps on app logic.
- **`data/mastery_bank.json`** — authored item bank (order / two_tier / param templates) per topic.
- **`store.py`** additions — `mastery_topics()`, `mastery_check(topic_id)` (safe questions), `grade_mastery(topic_id, responses)`, `mock_version(v)` (parameterized render), `grade_mock(...)`; misconception/rapid config constants.
- **`app.py`** additions — `/api/mastery/{check,grade}`, `/api/mock/{version,grade}`; answers server-side, clean JSON errors.
- **`templates/`** — `mastery.html` (topic confirmation check), `mock.html` (exam), `report.html` (log); small edits to home/leveltest/base for entry points + nav.
- **Authoring workflow** — parallel agents author + adversarially verify the mastery bank (order/two_tier/param) per topic, like the level-test build.

## 9. Flow integration
- Level-test topic result → "Ойлголтоо батал →" (the confirmation check).
- Home: profile chip + "Тайлан" link; "Таны түвшин" card gains a confirmed/not-confirmed marker.
- Nav: add "Тайлан" (or fold under Түвшин тогтоох).

## 10. Phasing (for writing-plans)
1. **Profile + data model + report scaffold** (profile.js, zaavar.mastery schema, empty Тайлан page, nav/home entry points).
2. **Item types + per-topic confirmation check** (order + two_tier authored for the 9 topics; store/api/mastery.html; scoring + verdict).
3. **Mock test** (param templates + 10 versions + rapid-guess + mock.html/api).
4. **Report polish** (timelines, mock-to-mock deltas, misconception surfacing) + cross-links.

## 11. Testing
- Unit: scoring functions (two-tier flag, partial-credit order, verdict thresholds, rapid-flag) with table-driven cases.
- API: questions endpoints never leak answer/solution; grade endpoints return correct verdicts.
- Browser: full flow per phase (profile create/switch, confirmation check, mock, report) with **0 console errors**; guard against the recurring `x-data="fn({{ x|tojson }})"` attribute break (use a `<script>` global).
- Data: validate authored bank (counts, answer indices in range, param templates evaluate, distinct choices).
