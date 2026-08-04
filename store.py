"""
Data store for Заавар (Math Guide).

Loads the static JSON content (curriculum, knowledge graph, lessons, diagnostic)
once at import time and exposes typed helpers. No database — the prototype's
corpus is small and read-only.
"""

from __future__ import annotations

import json
import pathlib
import random

DATA = pathlib.Path(__file__).parent / "data"


def _load(name: str) -> dict:
    return json.loads((DATA / name).read_text(encoding="utf-8"))


# --------------------------------------------------------------------------- #
# Subject-aware loading (math + physics)
# --------------------------------------------------------------------------- #

SUBJECTS = {"math": "Математик", "physics": "Физик", "it": "Мэдээллийн технологи",
            "english": "Англи хэл", "mongolian": "Монгол хэл",
            "health": "Эрүүл мэнд", "uran": "Уран зохиол",
            "dtech": "Дизайн технологи", "oros": "Орос хэл",
            "irgen": "Иргэний ёс зүй"}
DEFAULT_SUBJECT = "math"


def _load_opt(path: pathlib.Path, default: dict) -> dict:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else default


def _load_subject(cur_f: pathlib.Path, lt_f: pathlib.Path, mast_f: pathlib.Path, lessons_dir: pathlib.Path) -> dict:
    lessons: dict[str, dict] = {}
    if lessons_dir.exists():
        for p in sorted(lessons_dir.glob("*.json")):
            l = json.loads(p.read_text(encoding="utf-8"))
            lessons[l["id"]] = l
    leveltest = _load_opt(lt_f, {"topics": []})
    mastery = _load_opt(mast_f, {"topics": []})
    return {
        "curriculum": _load_opt(cur_f, {"grades": []}),
        "leveltest": leveltest,
        "mastery": mastery,
        "lessons": lessons,
        "level_topics": {t["skill_id"]: t for t in leveltest["topics"]},
        "mastery_topics": {t["skill_id"]: t for t in mastery["topics"]},
        "level_idx": {q["id"]: {**q, "topic": tp["skill_id"], "topic_mn": tp["title_mn"]}
                      for tp in leveltest["topics"] for q in tp["questions"]},
    }


_SUBJ = {
    "math": _load_subject(DATA / "curriculum.json", DATA / "level_test.json",
                          DATA / "mastery_bank.json", DATA / "lessons"),
    "physics": _load_subject(DATA / "physics" / "curriculum.json", DATA / "physics" / "level_test.json",
                             DATA / "physics" / "mastery_bank.json", DATA / "physics" / "lessons"),
    "it": _load_subject(DATA / "it" / "curriculum.json", DATA / "it" / "level_test.json",
                        DATA / "it" / "mastery_bank.json", DATA / "it" / "lessons"),
    "english": _load_subject(DATA / "english" / "curriculum.json", DATA / "english" / "level_test.json",
                             DATA / "english" / "mastery_bank.json", DATA / "english" / "lessons"),
    "mongolian": _load_subject(DATA / "mongolian" / "curriculum.json", DATA / "mongolian" / "level_test.json",
                               DATA / "mongolian" / "mastery_bank.json", DATA / "mongolian" / "lessons"),
    "health": _load_subject(DATA / "health" / "curriculum.json", DATA / "health" / "level_test.json",
                            DATA / "health" / "mastery_bank.json", DATA / "health" / "lessons"),
    "uran": _load_subject(DATA / "uran" / "curriculum.json", DATA / "uran" / "level_test.json",
                          DATA / "uran" / "mastery_bank.json", DATA / "uran" / "lessons"),
    "dtech": _load_subject(DATA / "dtech" / "curriculum.json", DATA / "dtech" / "level_test.json",
                           DATA / "dtech" / "mastery_bank.json", DATA / "dtech" / "lessons"),
    "oros": _load_subject(DATA / "oros" / "curriculum.json", DATA / "oros" / "level_test.json",
                          DATA / "oros" / "mastery_bank.json", DATA / "oros" / "lessons"),
    "irgen": _load_subject(DATA / "irgen" / "curriculum.json", DATA / "irgen" / "level_test.json",
                           DATA / "irgen" / "mastery_bank.json", DATA / "irgen" / "lessons"),
}


# Контентгүй хичээлийг сонголтод харуулахгүй. `data/<subject>/lessons/`-д файл
# орж ирмэгц хичээл өөрөө гарч ирнэ — код өөрчлөх шаардлагагүй.
SUBJECTS = {k: v for k, v in SUBJECTS.items() if _SUBJ.get(k, {}).get("lessons")}


def _sub(subject: str | None) -> dict:
    return _SUBJ.get(subject or DEFAULT_SUBJECT, _SUBJ[DEFAULT_SUBJECT])


# Merged lesson lookup (ids are unique across subjects: g*/p*) + subject map.
LESSONS: dict[str, dict] = {}
LESSON_SUBJECT: dict[str, str] = {}
for _s, _b in _SUBJ.items():
    for _lid, _l in _b["lessons"].items():
        LESSONS[_lid] = _l
        LESSON_SUBJECT[_lid] = _s

# Knowledge graph + old adaptive diagnostic stay math-only (AI router, prereqs).
GRAPH = _load("knowledge_graph.json")
DIAGNOSTIC = _load("diagnostic.json")
NODES = {n["skill_id"]: n for n in GRAPH["nodes"]}
# Back-compat aliases (math is the default subject).
CURRICULUM = _SUBJ["math"]["curriculum"]
LEVELTEST = _SUBJ["math"]["leveltest"]
MASTERY = _SUBJ["math"]["mastery"]


# --------------------------------------------------------------------------- #
# Grades (F-GRADE) — сурагчийн хэсэг АНГИАР зохион байгуулагдана.
# Хичээл сонгох нь багшийн удирдлагад (F-TEACHER) шилжсэн; сурагч эхлээд
# ангиа сонгож, тэр ангид ЗААГДДАГ хичээлүүдийг л хардаг.
# --------------------------------------------------------------------------- #

def subject_grades(subject: str) -> list[int]:
    """Grades this subject has curriculum entries for, ascending."""
    return sorted({g["grade"] for g in _sub(subject)["curriculum"].get("grades", [])
                   if g.get("grade") is not None})


# grade -> [subject keys], built once at import from the curricula on disk. A new
# subject folder therefore appears in its grade with no code change (as with
# SUBJECT-AUTOHIDE-1).
GRADE_SUBJECTS: dict[int, list[str]] = {}
for _k in SUBJECTS:
    for _g in subject_grades(_k):
        GRADE_SUBJECTS.setdefault(_g, []).append(_k)

DEFAULT_GRADE = max(GRADE_SUBJECTS) if GRADE_SUBJECTS else 12


def grades() -> list[int]:
    """Grades that have content, highest first — drives the grade picker."""
    return sorted(GRADE_SUBJECTS, reverse=True)


def subjects_for_grade(grade: int | None) -> dict[str, str]:
    """{key: name_mn} taught in that grade. None → every subject."""
    if grade is None:
        return dict(SUBJECTS)
    return {k: SUBJECTS[k] for k in GRADE_SUBJECTS.get(grade, []) if k in SUBJECTS}


def subject_in_grade(subject: str, grade: int | None) -> bool:
    return grade is None or subject in GRADE_SUBJECTS.get(grade, [])


def lesson_count(subject: str, grade: int | None = None) -> int:
    return sum(1 for l in _sub(subject)["lessons"].values()
               if grade is None or l.get("grade") == grade)


def subject_stats(subject: str) -> dict:
    """Content inventory for one subject — feeds the teacher console (T-TEACHER)."""
    b = _sub(subject)
    topics = b["leveltest"]["topics"]
    cur_grades = b["curriculum"].get("grades", [])
    return {
        "key": subject,
        "name": SUBJECTS.get(subject, subject),
        "grades": subject_grades(subject),
        "lessons": len(b["lessons"]),
        "chapters": sum(len(g.get("chapters", [])) for g in cur_grades),
        "level_topics": len(topics),
        "level_questions": sum(len(t["questions"]) for t in topics),
        "mastery_topics": len(b["mastery"]["topics"]),
        "books": [{"grade": g.get("grade"), "book_id": g.get("book_id"),
                   "reader_url": g.get("reader_url", "")}
                  for g in cur_grades if g.get("book_id")],
    }


def grade_overview() -> list[dict]:
    """One card per grade for the picker: how many subjects and lessons it holds."""
    out = []
    for g in grades():
        subs = subjects_for_grade(g)
        out.append({
            "grade": g,
            "subjects": list(subs.values()),
            "n_subjects": len(subs),
            "lessons": sum(lesson_count(k, g) for k in subs),
        })
    return out


def catalog() -> list[dict]:
    """Every registered subject's stats, richest first — the teacher console table."""
    return sorted((subject_stats(k) for k in SUBJECTS),
                  key=lambda s: (-s["lessons"], s["name"]))


# --------------------------------------------------------------------------- #
# Curriculum / lessons
# --------------------------------------------------------------------------- #

def curriculum(subject: str = "math", grade: int | None = None) -> dict:
    """The subject's grade→chapter→lesson tree.

    With `grade`, only that grade is returned. A subject that does not run in
    that grade falls back to its full tree rather than rendering an empty page.
    """
    cur = _sub(subject)["curriculum"]
    if grade is None:
        return cur
    kept = [g for g in cur.get("grades", []) if g.get("grade") == grade]
    return {**cur, "grades": kept} if kept else cur


def lesson(lesson_id: str) -> dict | None:
    return LESSONS.get(lesson_id)


def lesson_subject(lesson_id: str) -> str:
    return LESSON_SUBJECT.get(lesson_id, DEFAULT_SUBJECT)


def available_lessons(subject: str = "math", grade: int | None = None) -> list[dict]:
    """Every fully built lesson of a subject, in id order (optionally one grade)."""
    b = _sub(subject)
    ls = [b["lessons"][k] for k in sorted(b["lessons"].keys())]
    if grade is None:
        return ls
    return [l for l in ls if l.get("grade") == grade] or ls


def featured_lessons(subject: str = "math", grade: int | None = None) -> dict:
    """Home-page featured slice: the built lessons of the subject's richest chapter."""
    ls = available_lessons(subject, grade)
    if not ls:
        return {"grade": None, "chapter_num": None, "chapter_title_mn": "", "lessons": []}
    # pick the (grade, chapter) with the most built lessons; math keeps derivatives if present.
    for l in ls:
        if l.get("chapter_num") == "VIII" and l.get("grade") == 11:
            key = (11, "VIII")
            break
    else:
        from collections import Counter
        counts = Counter((l.get("grade"), l.get("chapter_num")) for l in ls)
        key = counts.most_common(1)[0][0]
    chap = [l for l in ls if (l.get("grade"), l.get("chapter_num")) == key]
    chap.sort(key=lambda l: l["lesson_num"])
    return {"grade": key[0], "chapter_num": key[1],
            "chapter_title_mn": chap[0].get("chapter_title_mn", ""), "lessons": chap}


# Back-compat: math home used this name.
def derivative_lessons() -> list[dict]:
    return featured_lessons("math")["lessons"]


def siblings(lesson_data: dict) -> list[dict]:
    """Lessons in the same subject+grade+chapter, for prev/next navigation."""
    subject = LESSON_SUBJECT.get(lesson_data.get("id"), DEFAULT_SUBJECT)
    ls = [l for l in available_lessons(subject)
          if l.get("grade") == lesson_data.get("grade")
          and l.get("chapter_num") == lesson_data.get("chapter_num")]
    return sorted(ls, key=lambda l: l["lesson_num"])


def lesson_by_skill(skill_id: str) -> dict | None:
    node = NODES.get(skill_id)
    if node and node.get("lesson_id"):
        return LESSONS.get(node["lesson_id"])
    return None


# --------------------------------------------------------------------------- #
# Knowledge graph
# --------------------------------------------------------------------------- #

def node(skill_id: str) -> dict | None:
    return NODES.get(skill_id)


def prerequisites(skill_id: str) -> list[dict]:
    """Direct prerequisite nodes of a skill (one hop back)."""
    pres = [e["from"] for e in GRAPH["edges"] if e["to"] == skill_id]
    return [NODES[p] for p in pres if p in NODES]


def all_prerequisites(skill_id: str) -> list[dict]:
    """Transitive prerequisites (everything you should know first), deepest first."""
    seen: list[str] = []
    stack = [skill_id]
    while stack:
        cur = stack.pop()
        for e in GRAPH["edges"]:
            if e["to"] == cur and e["from"] not in seen:
                seen.append(e["from"])
                stack.append(e["from"])
    return [NODES[s] for s in seen if s in NODES]


def graph() -> dict:
    return GRAPH


def router_catalog(subject: str = "math") -> list[dict]:
    """Compact lesson catalog handed to the Haiku router (for the subject)."""
    if subject == "math":
        return [{
            "id": n.get("lesson_id") or n["skill_id"], "skill_id": n["skill_id"],
            "grade": n["grade"], "chapter": n["chapter"],
            "title_mn": n["title_mn"], "status": n["status"], "keywords": [n["title_mn"]],
        } for n in GRAPH["nodes"]]
    # physics (no graph) — build the catalog from its lessons.
    cat = []
    for l in available_lessons(subject):
        cat.append({
            "id": l["id"], "skill_id": l.get("skill_id", l["id"]),
            "grade": l.get("grade"), "chapter": l.get("chapter_num"),
            "title_mn": l["title_mn"], "status": "available", "keywords": [l["title_mn"]],
        })
    return cat


# --------------------------------------------------------------------------- #
# Diagnostic — simple adaptive engine
# --------------------------------------------------------------------------- #

def diagnostic_items() -> list[dict]:
    return DIAGNOSTIC["items"]


def diagnostic_skills() -> list[str]:
    """Skills covered by the diagnostic bank, in graph order."""
    covered = {it["skill_id"] for it in DIAGNOSTIC["items"]}
    ordered = [n["skill_id"] for n in GRAPH["nodes"] if n["skill_id"] in covered]
    return ordered


def pick_next_item(answered_ids: list[str], mastery: dict[str, float]) -> dict | None:
    """
    Adaptive selection: target the skill we're least sure about, preferring an
    unseen item near the student's current level. Returns None when the bank for
    the relevant skills is exhausted.
    """
    remaining = [it for it in DIAGNOSTIC["items"] if it["id"] not in answered_ids]
    if not remaining:
        return None
    # Prefer the skill we're least sure about (mastery nearest 0.5), then an
    # item whose difficulty sits near the student's current level.
    def key(it: dict):
        m = mastery.get(it["skill_id"], 0.5)
        return (abs(m - 0.5), abs(it["difficulty"] - 2))
    remaining.sort(key=key)
    return remaining[0]


def grade_diagnostic(responses: list[dict]) -> dict:
    """
    responses: [{item_id, correct: bool}]
    Returns per-skill mastery (0-100 SmartScore-style), a weak-skill list, and a
    prerequisite-aware study playlist.
    """
    by_skill: dict[str, list[bool]] = {}
    item_skill = {it["id"]: it["skill_id"] for it in DIAGNOSTIC["items"]}
    item_diff = {it["id"]: it["difficulty"] for it in DIAGNOSTIC["items"]}
    for r in responses:
        sid = item_skill.get(r["item_id"])
        if sid:
            by_skill.setdefault(sid, []).append(bool(r.get("correct")))

    pie = []
    weak = []
    for sid in diagnostic_skills():
        results = by_skill.get(sid, [])
        if not results:
            score = None
        else:
            score = round(100 * sum(results) / len(results))
        node_ = NODES.get(sid, {})
        entry = {
            "skill_id": sid,
            "title_mn": node_.get("title_mn", sid),
            "grade": node_.get("grade"),
            "chapter": node_.get("chapter"),
            "lesson_id": node_.get("lesson_id"),
            "score": score,
            "seen": len(results),
        }
        pie.append(entry)
        if score is not None and score < 80:
            weak.append(entry)

    # Playlist: weak skills, prerequisites first (topological-ish by grade/chapter).
    playlist = sorted(
        [w for w in weak if w["lesson_id"]],
        key=lambda w: (w["grade"] or 99, str(w["chapter"])),
    )
    return {"pie": pie, "weak": weak, "playlist": playlist}


# --------------------------------------------------------------------------- #
# Level test (Түвшин тогтоох шалгалт) — topic blocks, 10 questions each
# --------------------------------------------------------------------------- #

def _level_label(score: int) -> tuple[str, str]:
    """(label_mn, band) for a 0-100 topic score."""
    if score >= 85:
        return "Бэлэн", "ready"
    if score >= 60:
        return "Сайн", "good"
    if score >= 35:
        return "Дунд", "mid"
    return "Эхлэн суралцах", "low"


def level_topics(subject: str = "math", grade: int | None = None) -> list[dict]:
    """Topic cards (no questions/answers) in authored order, optionally one grade."""
    cards = [
        {
            "skill_id": t["skill_id"],
            "title_mn": t["title_mn"],
            "grade": t.get("grade", 11),
            "lesson_id": t.get("lesson_id"),
            "pages_mn": t.get("pages_mn", ""),
            "count": len(t["questions"]),
        }
        for t in _sub(subject)["leveltest"]["topics"]
    ]
    if grade is None:
        return cards
    return [c for c in cards if c["grade"] == grade] or cards


def level_questions(subject: str, topic_id: str) -> list[dict] | None:
    """Questions for one topic, WITHOUT the answer index or solution (safe to send)."""
    topic = _sub(subject)["level_topics"].get(topic_id)
    if not topic:
        return None
    return [
        {k: q[k] for k in ("id", "difficulty", "stem_mn", "latex", "choices") if k in q}
        for q in topic["questions"]
    ]


def grade_level_topic(subject: str, topic_id: str, answers: list) -> dict | None:
    """
    answers: list of chosen indices (or None) aligned to the topic's questions.
    Returns per-question feedback (correct + answer + solution) plus the topic
    score, level label and the lesson to study.
    """
    topic = _sub(subject)["level_topics"].get(topic_id)
    if not topic:
        return None
    qs = topic["questions"]
    feedback = []
    correct_n = 0
    for i, q in enumerate(qs):
        chosen = answers[i] if i < len(answers) else None
        ok = (chosen == q["answer"])
        if ok:
            correct_n += 1
        feedback.append({
            "id": q["id"],
            "chosen": chosen,
            "answer": q["answer"],
            "correct": ok,
            "solution_mn": q.get("solution_mn") or q.get("explanation_mn") or "",
        })
    total = len(qs) or 1
    score = round(100 * correct_n / total)
    label, band = _level_label(score)
    return {
        "skill_id": topic_id,
        "title_mn": topic["title_mn"],
        "lesson_id": topic.get("lesson_id"),
        "pages_mn": topic.get("pages_mn", ""),
        "correct": correct_n,
        "total": total,
        "score": score,
        "level_mn": label,
        "band": band,
        "feedback": feedback,
    }


# --------------------------------------------------------------------------- #
# Mastery confirmation (Баталгаа) — ordering + two-tier "why" items
# --------------------------------------------------------------------------- #

# A response answered faster than this (ms) is a likely non-effortful "rapid guess".
RAPID_MS = {"two_tier": 2500, "order": 5000}


def mastery_topics(subject: str = "math", grade: int | None = None) -> list[dict]:
    """Mastery cards. Mastery topics carry no grade of their own, so the grade
    filter is resolved through the lesson each topic confirms."""
    cards = [
        {
            "skill_id": t["skill_id"],
            "title_mn": t["title_mn"],
            "lesson_id": t.get("lesson_id"),
            "grade": (LESSONS.get(t.get("lesson_id") or "") or {}).get("grade"),
            "n_order": len(t["ordering"]),
            "n_tier": len(t["two_tier"]),
        }
        for t in _sub(subject)["mastery"]["topics"]
    ]
    if grade is None:
        return cards
    return [c for c in cards if c["grade"] == grade] or cards


def mastery_items(subject: str, topic_id: str) -> dict | None:
    """Safe items for a topic: ordering steps SHUFFLED (no correct order leaked),
    two-tier without answer indices / misconception."""
    topic = _sub(subject)["mastery_topics"].get(topic_id)
    if not topic:
        return None
    ordering = []
    for o in topic["ordering"]:
        steps = list(o["steps"])
        random.shuffle(steps)  # display order; grading compares text to canonical
        ordering.append({"id": o["id"], "stem_mn": o["stem_mn"], "latex": o.get("latex", ""), "steps": steps})
    two_tier = [
        {
            "id": q["id"], "stem_mn": q["stem_mn"], "latex": q.get("latex", ""),
            "t1_choices": q["t1_choices"], "t2_prompt_mn": q["t2_prompt_mn"], "t2_choices": q["t2_choices"],
        }
        for q in topic["two_tier"]
    ]
    return {"skill_id": topic_id, "title_mn": topic["title_mn"], "lesson_id": topic.get("lesson_id"),
            "ordering": ordering, "two_tier": two_tier}


def _verdict(answer_pct, reason_pct, order_pct, rapid_pct) -> tuple[str, str, str]:
    """(verdict_mn, band, gap_mn) from the four signals. Formative, multi-signal."""
    if answer_pct >= 80 and reason_pct >= 80 and rapid_pct < 20 and order_pct >= 70:
        return "Батлагдсан", "ready", "Ойлголт бат — үндэслэлээ ч зөв тайлбарлаж байна. 🎉"
    gaps = []
    if answer_pct >= 80 and reason_pct < 80:
        gaps.append("хариу зөв ч шалтгаан сул → цээжилсэн байж магадгүй")
    if rapid_pct >= 20:
        gaps.append("зарим асуултыг хэт хурдан хариулсан → дахин анхааралтай бод")
    if order_pct < 70:
        gaps.append("бодолтын алхмуудын дараалал бүрхэг")
    if answer_pct < 80 and reason_pct < 80 and not gaps:
        gaps.append("үндсэн ойлголт сул — хичээлээ дахин үз")
    band = "mid" if (answer_pct >= 50 or reason_pct >= 50) else "low"
    label = "Гүйцэд биш" if band == "mid" else "Сул"
    return label, band, "; ".join(gaps) if gaps else "Бэхжүүлэх шаардлагатай."


def grade_mastery(subject: str, topic_id: str, responses: dict) -> dict | None:
    """responses = {ordering:[{id, order:[step_text,...], ms}], two_tier:[{id, t1, t2, ms}]}"""
    topic = _sub(subject)["mastery_topics"].get(topic_id)
    if not topic:
        return None
    ord_by = {o["id"]: o for o in topic["ordering"]}
    tt_by = {q["id"]: q for q in topic["two_tier"]}
    feedback = {"ordering": [], "two_tier": []}
    rapid_n = 0
    total_items = 0

    order_fracs = []
    for r in (responses.get("ordering") or []):
        if not isinstance(r, dict):
            continue
        item = ord_by.get(r.get("id"))
        if not item:
            continue
        total_items += 1
        canonical = item["steps"]
        submitted = r.get("order") or []
        n = len(canonical)
        correct_pos = sum(1 for i in range(min(n, len(submitted))) if submitted[i] == canonical[i])
        frac = correct_pos / n if n else 0
        order_fracs.append(frac)
        rapid = (r.get("ms") or 0) < RAPID_MS["order"] and (r.get("ms") or 0) > 0
        if rapid:
            rapid_n += 1
        feedback["ordering"].append({"id": item["id"], "correct_order": canonical, "frac": round(frac, 2), "rapid": rapid})

    t1_correct = 0
    t2_correct = 0
    tt_n = 0
    for r in (responses.get("two_tier") or []):
        if not isinstance(r, dict):
            continue
        item = tt_by.get(r.get("id"))
        if not item:
            continue
        tt_n += 1
        total_items += 1
        ok1 = (r.get("t1") == item["t1_answer"])
        ok2 = (r.get("t2") == item["t2_answer"])
        if ok1:
            t1_correct += 1
        if ok2:
            t2_correct += 1
        rote = ok1 and not ok2
        rapid = (r.get("ms") or 0) < RAPID_MS["two_tier"] and (r.get("ms") or 0) > 0
        if rapid:
            rapid_n += 1
        feedback["two_tier"].append({
            "id": item["id"], "t1_answer": item["t1_answer"], "t2_answer": item["t2_answer"],
            "ok1": ok1, "ok2": ok2, "rote": rote, "rapid": rapid,
            "misconception_mn": item.get("misconception_mn", "") if not ok2 else "",
        })

    answer_pct = round(100 * t1_correct / tt_n) if tt_n else 0
    reason_pct = round(100 * t2_correct / tt_n) if tt_n else 0
    order_pct = round(100 * sum(order_fracs) / len(order_fracs)) if order_fracs else 0
    rapid_pct = round(100 * rapid_n / total_items) if total_items else 0
    label, band, gap = _verdict(answer_pct, reason_pct, order_pct, rapid_pct)
    return {
        "skill_id": topic_id, "title_mn": topic["title_mn"], "lesson_id": topic.get("lesson_id"),
        "answerPct": answer_pct, "reasonPct": reason_pct, "orderPct": order_pct, "rapidPct": rapid_pct,
        "verdict": label, "band": band, "gap": gap, "feedback": feedback,
    }


# --------------------------------------------------------------------------- #
# Mock test — 10 formative versions sampled from the level-test pool
# --------------------------------------------------------------------------- #

MOCK_VERSIONS = 10
MOCK_RAPID_MS = 3000


def mock_grades(subject: str = "math") -> list[int]:
    """Grades that have level-test topics, ascending — drives the mock grade picker."""
    return sorted({t.get("grade") for t in _sub(subject)["leveltest"]["topics"]
                   if t.get("grade") is not None})


def mock_version(subject: str, v: int, grade: int | None = None) -> dict:
    """Deterministic per-version sample: 1–2 items from each topic (structure fixed,
    numbers/items vary by seed). Returns SAFE items (no answer/solution).

    When `grade` is given, only that grade's topics are sampled, so a subject that
    spans many grades still yields a sittable paper instead of one huge test."""
    v = int(v) % MOCK_VERSIONS
    rng = random.Random(1000 + v)
    topics = _sub(subject)["leveltest"]["topics"]
    if grade is not None:
        topics = [t for t in topics if t.get("grade") == grade]
    items = []
    for tp in topics:
        pool = list(tp["questions"])
        rng.shuffle(pool)
        for q in pool[:2]:  # 2 per topic
            items.append({"id": q["id"], "topic": tp["skill_id"], "topic_mn": tp["title_mn"],
                          "stem_mn": q["stem_mn"], "latex": q.get("latex", ""), "choices": q["choices"]})
    rng.shuffle(items)
    return {"version": v, "grade": grade, "n": len(items), "items": items}


def grade_mock(subject: str, v: int, responses: list) -> dict:
    """responses = [{id, choice, ms}]. Returns overall + per-topic pct + rapid + review."""
    b = _sub(subject)
    level_idx = b["level_idx"]
    by_topic_hits: dict[str, list[bool]] = {}
    correct_n = 0
    rapid_n = 0
    review = []
    for r in responses:
        if not isinstance(r, dict):
            continue
        q = level_idx.get(r.get("id"))
        if not q:
            continue
        ok = (r.get("choice") == q["answer"])
        if ok:
            correct_n += 1
        by_topic_hits.setdefault(q["topic"], []).append(ok)
        rapid = 0 < (r.get("ms") or 0) < MOCK_RAPID_MS
        if rapid:
            rapid_n += 1
        review.append({"id": q["id"], "answer": q["answer"], "chosen": r.get("choice"),
                       "correct": ok, "solution_mn": q.get("solution_mn") or q.get("explanation_mn") or "", "rapid": rapid})
    total = len(responses) or 1
    by_topic = {t: round(100 * sum(h) / len(h)) for t, h in by_topic_hits.items()}
    topic_names = {tp["skill_id"]: tp["title_mn"] for tp in b["leveltest"]["topics"]}
    return {
        "version": int(v) % MOCK_VERSIONS,
        "score": round(100 * correct_n / total),
        "correct": correct_n, "total": total,
        "rapidPct": round(100 * rapid_n / total),
        "byTopic": by_topic,
        "topicNames": topic_names,
        "review": review,
    }
