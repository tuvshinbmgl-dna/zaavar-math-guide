#!/usr/bin/env python3
"""Статик шалгагч — `data/<subject>/` доторх контентын алдааг олно.

Хэрэглээ:
  python docs/authoring/audit_content.py                 # бүх хичээл
  python docs/authoring/audit_content.py data/health     # нэг хичээл

АЛДАА (exit 1) — хуудсыг бодитоор эвдэнэ:
  1. JSON задлагдахгүй, эсвэл `id` файлын нэртэй таарахгүй.
  2. Сонголт ЯГ 4 биш, `answer` / `t1_answer` / `t2_answer` индекс мужаас гарсан.
  3. `curriculum.json` дахь `lesson_id`-д харгалзах файл алга (эвдэрсэн холбоос).
  4. `level_test.json` / `mastery_bank.json` дахь `skill_id` хичээлгүй.
  5. Хаагдаагүй `$` — араас нь бүх математик гажина.
  6. `\\,^` — KaTeX үүн дээр `throwOnError:false` үед ч `katex-error` буцаана (шалгасан).
  7. HTML entity (`&gt;` г.м.) үлдсэн.

САНУУЛГА (exit 0) — рендэрлэгддэг ч чанарын асуудал:
  8. math mode-д `\\text{}`-гүй нүцгэн кирилл. KaTeX 0.16.11 нь `strict` анхдагч
     («warn») тул ҮҮНИЙГ РЕНДЭРЛЭНЭ — зөвхөн console warning өгнө. Гэхдээ нэгжийг
     математик налуу үсгээр бичих нь буруу харагддаг (`8\\,см^3` → `\\mathrm{см}`).
  9. `\\text{}` доторх `·` (U+00B7).
  10. Зөв хариултын индекс нэг утга дээр төвлөрсөн (санамсаргүй биш).

Ноцтой байдлыг таамаглаагүй — `katex.renderToString`-оор апп-ын яг тохиргоогоор
(`{throwOnError:false}`, katex 0.16.11) туршиж баталгаажуулсан.
"""
import json
import pathlib
import re
import sys
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parents[2]
DATA = ROOT / "data"

CYRILLIC = re.compile(r"[\u0400-\u04FF]")
ENTITY = re.compile(r"&(?:[a-zA-Z]{2,10}|#\d{2,5});")
BAD_SPACING = re.compile(r"\\,\s*\^")
TEXT_MACRO = re.compile(r"\\(?:text|mathrm|operatorname)\{([^{}]*)\}")


def math_spans(s: str):
    """`$…$` ба `$$…$$` мужуудыг ЗӨВ хосоор нь буцаана.

    Энгийн `\\$([^$]+)\\$` regex нь `$$…$$`-г буруу таслаад дараагийн бүх хосыг
    ГАЖУУДУУЛДАГ — ингэснээр математикийн хоорондох энгийн монгол текст
    «math дотор кирилл» мэт харагдана. Тиймээс гараар тэмдэгт мөрөөр гүйнэ.
    Гурав дахь утга нь: муж хаагдаагүй (сондгой `$`) эсэх.
    """
    i, n = 0, len(s)
    while i < n:
        c = s[i]
        if c == "\\":
            i += 2
            continue
        if c != "$":
            i += 1
            continue
        if i + 1 < n and s[i + 1] == "$":
            j = s.find("$$", i + 2)
            if j == -1:
                yield s[i + 2:], True
                return
            yield s[i + 2:j], False
            i = j + 2
            continue
        j = i + 1
        while j < n and s[j] != "$":
            j += 2 if s[j] == "\\" else 1
        if j >= n:
            yield s[i + 1:], True
            return
        yield s[i + 1:j], False
        i = j + 1


def bare_cyrillic(body: str) -> str | None:
    """math mode дотор `\\text{}`-ээс ГАДНА кирилл байвал түүнийг буцаана.

    KaTeX-д `\\text{Монгол}` бол ЗӨВ (текст горим). Харин `см^3` шиг нүцгэн
    кирилл нь math mode-д «Unicode text character used in math mode» алдаа
    өгч, `throwOnError:false` тохиргоотой үед ЧИМЭЭГҮЙ л алга болдог.
    """
    stripped = TEXT_MACRO.sub("", body)
    m = CYRILLIC.search(stripped)
    return None if m is None else stripped[max(0, m.start() - 20):m.start() + 20]

errors: list[str] = []
warnings: list[str] = []


def err(where: str, msg: str) -> None:
    errors.append(f"{where}: {msg}")


def warn(where: str, msg: str) -> None:
    warnings.append(f"{where}: {msg}")


# --------------------------------------------------------------------------- #
# 1. Текстийн шалгалт (KaTeX, entity)
# --------------------------------------------------------------------------- #
def check_text(where: str, s: str) -> None:
    if "$" not in s and "&" not in s:
        return
    if ENTITY.search(s):
        err(where, f"HTML entity үлдсэн → {ENTITY.search(s).group(0)!r}")
    for body, unclosed in math_spans(s):
        if unclosed:
            err(where, f"хаагдаагүй `$` → {body[:60]!r}")
            continue
        bare = bare_cyrillic(body)
        if bare is not None:
            warn(where, rf"math mode-д нүцгэн кирилл → \mathrm{{}} болго: {bare!r}")
        if BAD_SPACING.search(body):
            err(where, rf"KaTeX `\,^` — рендэрлэгдэхгүй → {body[:60]!r}")
        for t in TEXT_MACRO.finditer(body):
            if "\u00b7" in t.group(1):
                warn(where, rf"\text{{}} дотор U+00B7 (·) → {t.group(1)[:40]!r}")


def walk(where: str, node) -> None:
    if isinstance(node, str):
        check_text(where, node)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(f"{where}[{i}]", v)
    elif isinstance(node, dict):
        for k, v in node.items():
            walk(f"{where}.{k}", v)


# --------------------------------------------------------------------------- #
# 2. Сонголт / хариултын индекс
# --------------------------------------------------------------------------- #
ANSWER_PAIRS = [("choices", "answer"), ("t1_choices", "t1_answer"), ("t2_choices", "t2_answer")]


def check_choices(where: str, node, tally: Counter) -> None:
    if isinstance(node, dict):
        for ch_key, a_key in ANSWER_PAIRS:
            if ch_key in node and a_key in node:
                ch, a = node[ch_key], node[a_key]
                if not isinstance(ch, list) or len(ch) != 4:
                    err(where, f"{ch_key} нь 4 биш ({len(ch) if isinstance(ch, list) else type(ch).__name__})")
                elif not isinstance(a, int) or not 0 <= a < len(ch):
                    err(where, f"{a_key}={a!r} нь мужид байхгүй")
                else:
                    if not str(ch[a]).strip():
                        err(where, f"{a_key} нь хоосон сонголтыг заасан")
                    tally[a] += 1
        for k, v in node.items():
            check_choices(f"{where}.{k}", v, tally)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            check_choices(f"{where}[{i}]", v, tally)


# --------------------------------------------------------------------------- #
# 3. Хичээл тус бүрийн шалгалт
# --------------------------------------------------------------------------- #
def audit_subject(sdir: pathlib.Path) -> None:
    name = sdir.name
    les_dir = sdir / "lessons"
    if not les_dir.exists():
        return

    lessons: dict[str, dict] = {}
    for p in sorted(les_dir.glob("*.json")):
        try:
            l = json.loads(p.read_text(encoding="utf-8"))
        except Exception as e:
            err(f"{name}/{p.name}", f"JSON задлагдахгүй: {e}")
            continue
        if l.get("id") != p.stem:
            err(f"{name}/{p.name}", f"id={l.get('id')!r} файлын нэртэй таарахгүй")
        lessons[l["id"]] = l

    tally: Counter = Counter()
    for lid, l in lessons.items():
        walk(f"{name}/lessons/{lid}", l)
        check_choices(f"{name}/lessons/{lid}", l, tally)

    # curriculum → lesson файл
    cur_f = sdir / "curriculum.json"
    if cur_f.exists():
        cur = json.loads(cur_f.read_text(encoding="utf-8"))
        walk(f"{name}/curriculum", cur)
        for ge in cur.get("grades", []):
            for ch in ge.get("chapters", []):
                for it in ch.get("lessons", []):
                    lid = it.get("lesson_id")
                    if lid is None:
                        continue
                    if lid not in lessons:
                        err(f"{name}/curriculum {ge.get('grade')}-{ch.get('num')}",
                            f"lesson_id={lid!r} файлгүй — эвдэрсэн холбоос")
                    elif it.get("skill_id") and it["skill_id"] != lessons[lid].get("skill_id"):
                        err(f"{name}/curriculum {lid}", "skill_id хичээлийнхтэй зөрж байна")

    skills = {l.get("skill_id") for l in lessons.values()}
    for bank, key in (("level_test.json", "questions"), ("mastery_bank.json", None)):
        f = sdir / bank
        if not f.exists():
            continue
        data = json.loads(f.read_text(encoding="utf-8"))
        walk(f"{name}/{bank}", data)
        check_choices(f"{name}/{bank}", data, tally)
        for t in data.get("topics", []):
            lid = t.get("lesson_id")
            if lid and lid not in lessons:
                # Заасан хичээл алга — эвдэрсэн холбоос.
                err(f"{name}/{bank}", f"{t.get('skill_id')}: lesson_id={lid!r} файлгүй")
            elif t.get("skill_id") not in skills:
                # `lesson_id: null` бол ЗОРИУДЫН — хичээл нь хараахан бичигдээгүй сэдэв
                # (`path.html` үүнийг «удахгүй» товч болгон харуулна). Тиймээс сануулга.
                warn(f"{name}/{bank}", f"skill_id={t.get('skill_id')!r} хичээлгүй "
                                       f"(lesson_id=null — контент хүлээгдэж буй)")
            if key and len(t.get(key, [])) < 5:
                err(f"{name}/{bank}", f"{t.get('skill_id')}: асуулт {len(t.get(key, []))} — цөөн")

    total = sum(tally.values())
    if total:
        share = ", ".join(f"{i}:{tally[i]}({tally[i] * 100 // total}%)" for i in range(4))
        skewed = max(tally.values()) > total * 0.40
        if skewed:
            warn(f"{name}", f"зөв хариултын индекс төвлөрсөн — {share}")
        print(f"  {name:<10} {len(lessons):>3} хичээл, {total:>4} асуулт — "
              f"хариулт {share}{' ⚠' if skewed else ''}")


def main() -> int:
    targets = [pathlib.Path(a) for a in sys.argv[1:] if not a.startswith("-")]
    if not targets:
        targets = [DATA] + [d for d in sorted(DATA.iterdir()) if d.is_dir() and d.name != "lessons"]
    print("Контентын шалгалт:")
    for t in targets:
        audit_subject(t if t.is_absolute() else ROOT / t)
    quiet = "-q" in sys.argv or "--quiet" in sys.argv
    if warnings:
        print(f"\n⚠ {len(warnings)} сануулга (рендэрлэгддэг, чанарын асуудал):")
        for w in warnings if not quiet else warnings[:15]:
            print("  " + w)
        if quiet and len(warnings) > 15:
            print(f"  … бас {len(warnings) - 15}")
    if errors:
        print(f"\n❌ {len(errors)} АЛДАА (хуудсыг эвдэнэ):")
        for e in errors:
            print("  " + e)
        return 1
    print("\n✅ эвдэрсэн алдаа олдсонгүй")
    return 0


if __name__ == "__main__":
    sys.exit(main())
