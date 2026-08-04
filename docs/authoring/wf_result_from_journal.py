#!/usr/bin/env python3
"""Rebuild a lesson-authoring workflow's result JSON from its run journal.

Why this exists
---------------
`*_wf.js` workflows return a bundle per lesson. For a 22-lesson book that return
value is several megabytes, which is a poor thing to hand back through a chat
transcript. Every run already writes `journal.jsonl` in its transcript directory
with one `{"type":"result", ...}` line per agent, so the same data can be lifted
straight off disk — and it also works when a run was interrupted, resumed, or
its final `return` never arrived.

How it tells the two stages apart
---------------------------------
The author agent returns `{lesson, level_questions, mastery}`; the verify agent
returns the same plus `notes`. So a result carrying `notes` is the verified,
corrected bundle and always wins. A lesson whose verify agent died falls back to
its author bundle, and is listed in the report so the loss is never silent.

Usage
-----
  python3 wf_result_from_journal.py <transcript_dir> <out.json>

The output shape is exactly what `write_subject.py` ingests:
  {"topics": [{"skill": ..., "id": ..., "verified": bool, "notes": str,
               "bundle": {"lesson": ..., "level_questions": ..., "mastery": ...}}]}
"""
import json
import pathlib
import sys


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__.strip())
        return 2
    journal = pathlib.Path(sys.argv[1])
    if journal.is_dir():
        journal = journal / "journal.jsonl"
    if not journal.exists():
        print(f"! journal not found: {journal}")
        return 1
    out_path = pathlib.Path(sys.argv[2])

    authored: dict[str, dict] = {}   # lesson id -> author bundle
    verified: dict[str, dict] = {}   # lesson id -> verified bundle
    skipped = 0

    for line in journal.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            skipped += 1
            continue
        if rec.get("type") != "result":
            continue
        res = rec.get("result")
        # Only per-lesson bundles are of interest; the workflow's own final
        # return value (subject/grade/topics) and any null result are not.
        if not isinstance(res, dict) or "lesson" not in res:
            continue
        lid = (res.get("lesson") or {}).get("id")
        if not lid:
            skipped += 1
            continue
        (verified if "notes" in res else authored)[lid] = res

    topics = []
    fell_back = []
    for lid in sorted(set(authored) | set(verified)):
        res = verified.get(lid)
        if res is None:
            res = authored[lid]
            fell_back.append(lid)
        topics.append({
            "skill": (res.get("lesson") or {}).get("skill_id", ""),
            "id": lid,
            "verified": lid in verified,
            "notes": res.get("notes", "(verify missing → author bundle kept)"),
            "bundle": {
                "lesson": res["lesson"],
                "level_questions": res.get("level_questions", []),
                "mastery": res.get("mastery"),
            },
        })

    out_path.write_text(json.dumps({"topics": topics}, ensure_ascii=False, indent=1),
                        encoding="utf-8")

    n_mastery = sum(1 for t in topics if t["bundle"]["mastery"])
    n_q = sum(len(t["bundle"]["level_questions"]) for t in topics)
    print(f"journal          : {journal}")
    print(f"lessons recovered: {len(topics)}  (verified {len(topics) - len(fell_back)}, "
          f"author-only {len(fell_back)})")
    print(f"level questions  : {n_q}")
    print(f"mastery bundles  : {n_mastery}")
    if fell_back:
        print(f"! author-only (verify never landed): {', '.join(fell_back)}")
    if skipped:
        print(f"! unparsable/idless result lines skipped: {skipped}")
    print(f"written          : {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
