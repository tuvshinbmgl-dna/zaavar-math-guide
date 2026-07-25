#!/usr/bin/env python3
"""Read physics workflow output (topics.json) and write lessons + level_test + mastery_bank.
Applies html.unescape to every string so KaTeX never renders literal &gt;/&lt;/&amp;."""
import json, html, pathlib, sys

TOPICS_JSON = sys.argv[1] if len(sys.argv) > 1 else "topics.json"
ROOT = pathlib.Path("/Users/tuvshinb/math-guide/data/physics")
LES = ROOT / "lessons"
LES.mkdir(parents=True, exist_ok=True)

def unesc(x):
    if isinstance(x, str):
        return html.unescape(x)
    if isinstance(x, list):
        return [unesc(v) for v in x]
    if isinstance(x, dict):
        return {k: unesc(v) for k, v in x.items()}
    return x

data = json.load(open(TOPICS_JSON, encoding="utf-8"))
topics = data["topics"] if isinstance(data, dict) and "topics" in data else data

# Curriculum order for stable sorting.
ORDER = ["p7-length-time","p7-mass-weight","p7-density","p7-floating","p7-temperature",
         "p7-speed","p7-magnetism","p7-sound-propagation","p7-sound-properties",
         "p7-earth-sun-moon","p7-constellations"]
def rank(sk): return ORDER.index(sk) if sk in ORDER else 99
topics.sort(key=lambda t: rank(t.get("skill") or t["bundle"]["lesson"]["skill_id"]))

lt_topics, mastery_topics = [], []
written = []
for t in topics:
    b = unesc(t["bundle"])
    lesson = b["lesson"]
    lid = lesson["id"]
    (LES / f"{lid}.json").write_text(json.dumps(lesson, ensure_ascii=False, indent=2), encoding="utf-8")
    written.append(lid)
    # level_test topic
    lt_topics.append({
        "skill_id": lesson["skill_id"],
        "title_mn": lesson["title_mn"],
        "lesson_id": lid,
        "pages_mn": lesson.get("textbook", {}).get("pages_mn", ""),
        "grade": 7,
        "questions": b["level_questions"],
    })
    if b.get("mastery"):
        mastery_topics.append(b["mastery"])

(ROOT / "level_test.json").write_text(json.dumps(
    {"note": "Физик 7 — түвшин тогтоох (Ф7.1–Ф7.4). Хариултууд серверт үлдэнэ.",
     "topics": lt_topics}, ensure_ascii=False, indent=2), encoding="utf-8")
(ROOT / "mastery_bank.json").write_text(json.dumps(
    {"note": "Физик 7 — ойлголт батлах (ordering + two-tier).",
     "topics": mastery_topics}, ensure_ascii=False, indent=2), encoding="utf-8")

print(f"lessons: {len(written)} -> {written}")
print(f"level_test topics: {len(lt_topics)} ({sum(len(x['questions']) for x in lt_topics)} Q)")
print(f"mastery topics: {len(mastery_topics)}")
