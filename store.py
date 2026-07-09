"""
Data store for Заавар (Math Guide).

Loads the static JSON content (curriculum, knowledge graph, lessons, diagnostic)
once at import time and exposes typed helpers. No database — the prototype's
corpus is small and read-only.
"""

from __future__ import annotations

import json
import pathlib

DATA = pathlib.Path(__file__).parent / "data"


def _load(name: str) -> dict:
    return json.loads((DATA / name).read_text(encoding="utf-8"))


CURRICULUM = _load("curriculum.json")
GRAPH = _load("knowledge_graph.json")
DIAGNOSTIC = _load("diagnostic.json")
LEVELTEST = _load("level_test.json")

LESSONS: dict[str, dict] = {}
for path in sorted((DATA / "lessons").glob("*.json")):
    lesson = json.loads(path.read_text(encoding="utf-8"))
    LESSONS[lesson["id"]] = lesson

# skill_id -> node
NODES = {n["skill_id"]: n for n in GRAPH["nodes"]}


# --------------------------------------------------------------------------- #
# Curriculum / lessons
# --------------------------------------------------------------------------- #

def curriculum() -> dict:
    return CURRICULUM


def lesson(lesson_id: str) -> dict | None:
    return LESSONS.get(lesson_id)


def available_lessons() -> list[dict]:
    """Every fully built lesson, in id order."""
    return [LESSONS[k] for k in sorted(LESSONS.keys())]


def derivative_lessons() -> list[dict]:
    """The deep-slice chapter (Gr11 VIII — Уламжлал), in lesson-number order."""
    ls = [l for l in available_lessons() if l.get("chapter_num") == "VIII" and l.get("grade") == 11]
    return sorted(ls, key=lambda l: l["lesson_num"])


def siblings(lesson_data: dict) -> list[dict]:
    """Lessons in the same grade+chapter, for prev/next navigation."""
    ls = [l for l in available_lessons()
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


def router_catalog() -> list[dict]:
    """Compact lesson catalog handed to the Haiku router."""
    cat = []
    for n in GRAPH["nodes"]:
        keywords = [n["title_mn"]]
        cat.append({
            "id": n.get("lesson_id") or n["skill_id"],
            "skill_id": n["skill_id"],
            "grade": n["grade"],
            "chapter": n["chapter"],
            "title_mn": n["title_mn"],
            "status": n["status"],
            "keywords": keywords,
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

_LEVEL_TOPICS = {t["skill_id"]: t for t in LEVELTEST["topics"]}


def _level_label(score: int) -> tuple[str, str]:
    """(label_mn, band) for a 0-100 topic score."""
    if score >= 85:
        return "Бэлэн", "ready"
    if score >= 60:
        return "Сайн", "good"
    if score >= 35:
        return "Дунд", "mid"
    return "Эхлэн суралцах", "low"


def level_topics() -> list[dict]:
    """Topic cards (no questions/answers) in authored order."""
    return [
        {
            "skill_id": t["skill_id"],
            "title_mn": t["title_mn"],
            "lesson_id": t.get("lesson_id"),
            "pages_mn": t.get("pages_mn", ""),
            "count": len(t["questions"]),
        }
        for t in LEVELTEST["topics"]
    ]


def level_questions(topic_id: str) -> list[dict] | None:
    """Questions for one topic, WITHOUT the answer index or solution (safe to send)."""
    topic = _LEVEL_TOPICS.get(topic_id)
    if not topic:
        return None
    return [
        {k: q[k] for k in ("id", "difficulty", "stem_mn", "latex", "choices") if k in q}
        for q in topic["questions"]
    ]


def grade_level_topic(topic_id: str, answers: list) -> dict | None:
    """
    answers: list of chosen indices (or None) aligned to the topic's questions.
    Returns per-question feedback (correct + answer + solution) plus the topic
    score, level label and the lesson to study.
    """
    topic = _LEVEL_TOPICS.get(topic_id)
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
            "solution_mn": q.get("solution_mn", ""),
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
