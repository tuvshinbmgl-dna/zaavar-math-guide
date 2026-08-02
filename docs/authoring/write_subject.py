#!/usr/bin/env python3
"""Merge a lesson-authoring workflow result into data/<subject>/.

Usage:
  SUBJECT_DIR=<repo>/data/mongolian \
  SUBJECT_TITLE="Монгол хэл" \
  BOOK_MAP='{"12": 339}' \
  python3 write_subject.py topics.json [topics.json ...]

Generalised from write_physics_grade.py so any subject can use it.
- Writes each lesson to <SUBJECT_DIR>/lessons/<id>.json
- APPENDS / replaces level_test + mastery topics by skill_id (earlier grades survive)
- Rebuilds curriculum.json from whatever lessons are on disk
- html.unescape()s every string (KaTeX must never see a literal &gt;)
"""
import json, html, os, pathlib, sys, re

ROOT = pathlib.Path(os.environ["SUBJECT_DIR"])
TITLE = os.environ.get("SUBJECT_TITLE", "Хичээл")
BOOKS = {int(k): v for k, v in json.loads(os.environ.get("BOOK_MAP", "{}")).items()}
LES = ROOT / "lessons"
LES.mkdir(parents=True, exist_ok=True)

ROMAN = {"0": 0, "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8}


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


# ---------- 1. ingest ----------
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

# ---------- 2/3. merge banks ----------
lt = load(ROOT / "level_test.json", {"note": "", "topics": []})
by = {x["skill_id"]: x for x in lt.get("topics", [])}
for x in new_lt:
    by[x["skill_id"]] = x
merged_lt = list(by.values())

mb = load(ROOT / "mastery_bank.json", {"note": "", "topics": []})
mby = {x["skill_id"]: x for x in mb.get("topics", [])}
for x in new_mastery:
    mby[x["skill_id"]] = x
merged_mb = list(mby.values())

# ---------- 4. rebuild curriculum ----------
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
    ch = l.get("chapter_num", "I")
    grades.setdefault(g, {}).setdefault(ch, {"title_mn": l.get("chapter_title_mn", ""), "lessons": []})
    grades[g][ch]["lessons"].append(l)

entries = []
for g in sorted(grades):
    chapters = []
    for ch in sorted(grades[g], key=lambda r: ROMAN.get(r, 99)):
        c = grades[g][ch]
        chapters.append({
            "num": ch, "title_mn": c["title_mn"], "title_en": "", "deep": True,
            "lessons": [{"num": l["lesson_num"], "title_mn": l["title_mn"],
                         "lesson_id": l["id"], "skill_id": l["skill_id"]}
                        for l in sorted(c["lessons"], key=lesson_key)],
        })
    book = BOOKS.get(g, 0)
    entries.append({
        "grade": g, "title_mn": f"{TITLE} {g}", "book_id": book,
        "reader_url": f"https://econtent.edu.mn/pages/more.php?id={book}" if book else "",
        "chapters": chapters,
    })

old = load(ROOT / "curriculum.json", {})
old_en = {(ge["grade"], ch["num"]): ch["title_en"]
          for ge in old.get("grades", []) for ch in ge.get("chapters", []) if ch.get("title_en")}
for ge in entries:
    for ch in ge["chapters"]:
        ch["title_en"] = old_en.get((ge["grade"], ch["num"]), ch["title_en"])

glist = ", ".join(str(g) for g in sorted(grades))
dump(ROOT / "curriculum.json", {
    "note": f"{TITLE} — {glist}-р анги. econtent.edu.mn дээрх албан ёсны сурах бичгийн бүтцэд нийцүүлэв.",
    "grades": entries})
dump(ROOT / "level_test.json", {
    "note": f"{TITLE} {glist} — түвшин тогтоох. Хариултууд серверт үлдэнэ.", "topics": merged_lt})
dump(ROOT / "mastery_bank.json", {
    "note": f"{TITLE} {glist} — ойлголт батлах (ordering + two-tier).", "topics": merged_mb})

print(f"lessons written this run : {len(new_lessons)}")
print(f"lessons on disk total    : {len(lessons)}")
print(f"level_test topics        : {len(merged_lt)} ({sum(len(x['questions']) for x in merged_lt)} Q)")
print(f"mastery topics           : {len(merged_mb)}")
for g in sorted(grades):
    print(f"  grade {g:>2}: {len(grades[g])} бүлэг, {sum(len(c['lessons']) for c in grades[g].values())} хичээл")
