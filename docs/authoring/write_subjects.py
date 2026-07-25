#!/usr/bin/env python3
"""Write IT + English (or any subject) workflow output → per-subject data files.
Each topic carries a `subject`. Applies html.unescape to every string."""
import json, html, pathlib, sys

TOPICS_JSON = sys.argv[1] if len(sys.argv) > 1 else "topics.json"
ROOT = pathlib.Path("/Users/tuvshinb/math-guide/data")

def unesc(x):
    if isinstance(x, str): return html.unescape(x)
    if isinstance(x, list): return [unesc(v) for v in x]
    if isinstance(x, dict): return {k: unesc(v) for k, v in x.items()}
    return x

data = json.load(open(TOPICS_JSON, encoding="utf-8"))
topics = data["topics"] if isinstance(data, dict) and "topics" in data else data

# group by subject
by_sub = {}
for t in topics:
    by_sub.setdefault(t["subject"], []).append(t)

for sub, ts in by_sub.items():
    sdir = ROOT / sub
    (sdir / "lessons").mkdir(parents=True, exist_ok=True)
    # order by curriculum lesson order
    cur = json.load(open(sdir / "curriculum.json", encoding="utf-8"))
    order = []
    for g in cur["grades"]:
        for ch in g["chapters"]:
            for l in ch.get("lessons", []):
                order.append(l["skill_id"])
    rank = {sk: i for i, sk in enumerate(order)}
    ts.sort(key=lambda t: rank.get(t.get("skill") or t["bundle"]["lesson"]["skill_id"], 99))

    lt_topics, mastery_topics, written = [], [], []
    for t in ts:
        b = unesc(t["bundle"])
        lesson = b["lesson"]
        lid = lesson["id"]
        (sdir / "lessons" / f"{lid}.json").write_text(json.dumps(lesson, ensure_ascii=False, indent=2), encoding="utf-8")
        written.append(lid)
        lt_topics.append({
            "skill_id": lesson["skill_id"], "title_mn": lesson["title_mn"], "lesson_id": lid,
            "pages_mn": lesson.get("textbook", {}).get("pages_mn", ""), "grade": 12,
            "questions": b["level_questions"],
        })
        if b.get("mastery"):
            mastery_topics.append(b["mastery"])

    (sdir / "level_test.json").write_text(json.dumps(
        {"note": f"{sub} 12 — түвшин тогтоох.", "topics": lt_topics}, ensure_ascii=False, indent=2), encoding="utf-8")
    (sdir / "mastery_bank.json").write_text(json.dumps(
        {"note": f"{sub} 12 — ойлголт батлах.", "topics": mastery_topics}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[{sub}] lessons: {len(written)} | level topics: {len(lt_topics)} ({sum(len(x['questions']) for x in lt_topics)} Q) | mastery: {len(mastery_topics)}")
    print(f"        {written}")
