#!/usr/bin/env python3
"""Append workflow-authored extra examples + practice to each existing lesson.
Purely additive (existing content untouched). html.unescape on the additions."""
import json, html, pathlib, sys

ENH_JSON = sys.argv[1] if len(sys.argv) > 1 else "enhanced.json"
BASE = pathlib.Path("/Users/tuvshinb/math-guide")

def unesc(x):
    if isinstance(x, str): return html.unescape(x)
    if isinstance(x, list): return [unesc(v) for v in x]
    if isinstance(x, dict): return {k: unesc(v) for k, v in x.items()}
    return x

data = json.load(open(ENH_JSON, encoding="utf-8"))
items = data["enhanced"] if isinstance(data, dict) and "enhanced" in data else data

count = 0
sec_added = prac_added = 0
for it in items:
    p = BASE / it["path"]
    if not p.exists():
        print("MISSING", it["path"]); continue
    lesson = json.loads(p.read_text(encoding="utf-8"))
    ex = unesc(it.get("extra_examples") or [])
    pr = unesc(it.get("extra_practice") or [])
    # normalize example section type
    for s in ex:
        s.setdefault("type", "example")
    lesson.setdefault("sections", []).extend(ex)
    lesson.setdefault("practice", []).extend(pr)
    p.write_text(json.dumps(lesson, ensure_ascii=False, indent=2), encoding="utf-8")
    count += 1; sec_added += len(ex); prac_added += len(pr)

print(f"enhanced {count} lessons | +{sec_added} example sections | +{prac_added} practice items")
