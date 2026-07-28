#!/usr/bin/env python3
"""Merge a physics-authoring workflow result into data/physics/.

Usage: write_physics_grade.py <topics.json> [<topics.json> ...]

- Writes each lesson to data/physics/lessons/<id>.json
- APPENDS (or replaces by skill_id) level_test.json / mastery_bank.json topics,
  preserving the existing grade-7 content.
- Rebuilds curriculum.json grade entries for every grade present in data/physics/lessons.
- html.unescape()s every string so KaTeX never renders a literal &gt;/&lt;/&amp;.
"""
import json, html, os, pathlib, sys, re

# Target dir: $PHYSICS_DIR, else ./data/physics next to this script.
ROOT = pathlib.Path(os.environ.get("PHYSICS_DIR")
                    or (pathlib.Path(__file__).resolve().parent / "data" / "physics"))
LES = ROOT / "lessons"
LES.mkdir(parents=True, exist_ok=True)

BOOKS = {7: 291, 8: 306, 9: 320, 10: 258, 11: 269}
GRADE_TITLE = {7: "Физик 7", 8: "Физик 8", 9: "Физик 9", 10: "Физик 10", 11: "Физик 11"}
ROMAN = {"I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6}


def unesc(x):
    if isinstance(x, str):
        return html.unescape(x)
    if isinstance(x, list):
        return [unesc(v) for v in x]
    if isinstance(x, dict):
        return {k: unesc(v) for k, v in x.items()}
    return x


def load(p, default):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return default


def dump(p, obj):
    p.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding="utf-8")


# ---------- 1. ingest workflow outputs ----------
new_lessons, new_lt, new_mastery = [], [], []
for path in sys.argv[1:]:
    data = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    topics = data["topics"] if isinstance(data, dict) and "topics" in data else data
    for t in topics:
        b = unesc(t["bundle"])
        lesson = b["lesson"]
        new_lessons.append(lesson)
        new_lt.append({
            "skill_id": lesson["skill_id"],
            "title_mn": lesson["title_mn"],
            "lesson_id": lesson["id"],
            "pages_mn": lesson.get("textbook", {}).get("pages_mn", ""),
            "grade": lesson["grade"],
            "questions": b["level_questions"],
        })
        if b.get("mastery"):
            new_mastery.append(b["mastery"])

for lesson in new_lessons:
    dump(LES / f"{lesson['id']}.json", lesson)

# ---------- 2. merge level_test.json ----------
lt = load(ROOT / "level_test.json", {"note": "", "topics": []})
by_skill = {x["skill_id"]: x for x in lt.get("topics", [])}
for x in new_lt:
    by_skill[x["skill_id"]] = x
merged_lt = list(by_skill.values())

# ---------- 3. merge mastery_bank.json ----------
mb = load(ROOT / "mastery_bank.json", {"note": "", "topics": []})
mb_by_skill = {x["skill_id"]: x for x in mb.get("topics", [])}
for x in new_mastery:
    mb_by_skill[x["skill_id"]] = x
merged_mb = list(mb_by_skill.values())

# ---------- 4. rebuild curriculum from every lesson on disk ----------
lessons = []
for f in sorted(LES.glob("*.json")):
    try:
        lessons.append(json.loads(f.read_text(encoding="utf-8")))
    except Exception as e:
        print(f"  ! skipping unreadable {f.name}: {e}")


def lesson_key(l):
    nums = [int(n) for n in re.findall(r"\d+", l.get("lesson_num", "0"))]
    return (nums + [0, 0])[:2]


grades = {}
for l in lessons:
    g = l["grade"]
    ch_num = l.get("chapter_num", "I")
    grades.setdefault(g, {}).setdefault(ch_num, {"title_mn": l.get("chapter_title_mn", ""), "lessons": []})
    grades[g][ch_num]["lessons"].append(l)

grade_entries = []
for g in sorted(grades):
    chapters = []
    for ch_num in sorted(grades[g], key=lambda r: ROMAN.get(r, 99)):
        ch = grades[g][ch_num]
        chapters.append({
            "num": ch_num,
            "title_mn": ch["title_mn"],
            "title_en": "",
            "deep": True,
            "lessons": [
                {"num": l["lesson_num"], "title_mn": l["title_mn"],
                 "lesson_id": l["id"], "skill_id": l["skill_id"]}
                for l in sorted(ch["lessons"], key=lesson_key)
            ],
        })
    book = BOOKS.get(g, 0)
    grade_entries.append({
        "grade": g,
        "title_mn": GRADE_TITLE.get(g, f"Физик {g}"),
        "book_id": book,
        "reader_url": f"https://econtent.edu.mn/pages/more.php?id={book}",
        "chapters": chapters,
    })

# preserve the human-written title_en values already in the shipped curriculum
old = load(ROOT / "curriculum.json", {})
old_en = {}
for ge in old.get("grades", []):
    for ch in ge.get("chapters", []):
        if ch.get("title_en"):
            old_en[(ge["grade"], ch["num"])] = ch["title_en"]
for ge in grade_entries:
    for ch in ge["chapters"]:
        ch["title_en"] = old_en.get((ge["grade"], ch["num"]), ch["title_en"])

glist = ", ".join(str(g) for g in sorted(grades))
dump(ROOT / "curriculum.json", {
    "note": f"Физик — {glist}-р анги. econtent.edu.mn дээрх албан ёсны сурах бичгийн бүтцэд нийцүүлэв.",
    "grades": grade_entries,
})
dump(ROOT / "level_test.json", {
    "note": f"Физик {glist} — түвшин тогтоох. Хариултууд серверт үлдэнэ.",
    "topics": merged_lt,
})
dump(ROOT / "mastery_bank.json", {
    "note": f"Физик {glist} — ойлголт батлах (ordering + two-tier).",
    "topics": merged_mb,
})

print(f"lessons written this run : {len(new_lessons)}")
print(f"lessons on disk total    : {len(lessons)}")
print(f"level_test topics        : {len(merged_lt)} ({sum(len(x['questions']) for x in merged_lt)} Q)")
print(f"mastery topics           : {len(merged_mb)}")
for g in sorted(grades):
    n = sum(len(c['lessons']) for c in grades[g].values())
    print(f"  grade {g:>2}: {len(grades[g])} бүлэг, {n} хичээл")
