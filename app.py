"""
Заавар (Math Guide) — Flask web app.

A Mongolian-language self-study platform for high-school maths (grades 10–12),
built on the national econtent.edu.mn curriculum. Four capabilities:
  1. Self-study guide  (scaffolded lesson flow)
  2. Assessment        (adaptive diagnostic -> skill pie + playlist)
  3. AI tutor chat     (Socratic, routes you to WHICH textbook lesson)
  4. Gap-filling       (prerequisite graph + diagnostic)

Student progress lives in the browser (localStorage) — no accounts, no DB.
"""

from __future__ import annotations

import json

from flask import Flask, Response, jsonify, render_template, request

from markupsafe import Markup, escape

import claude_client as claude
import store

app = Flask(__name__)
MAX_DIAGNOSTIC_ITEMS = 8


@app.template_filter("richtext")
def richtext(text: str) -> Markup:
    """Markdown-lite -> HTML: paragraphs, line breaks, **bold**. Leaves $..$ math
    intact for client-side KaTeX. HTML-escaped first for safety."""
    out = []
    for para in (text or "").split("\n\n"):
        body = str(escape(para)).replace("\n", "<br>")
        # **bold** (operate on the escaped string; ** are not escaped)
        import re
        body = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", body)
        out.append(f"<p>{body}</p>")
    return Markup("".join(out))


# --------------------------------------------------------------------------- #
# Pages
# --------------------------------------------------------------------------- #

@app.route("/")
def home():
    return render_template(
        "home.html",
        lessons=store.derivative_lessons(),
        ai_enabled=claude.is_configured(),
    )


@app.route("/curriculum")
def curriculum():
    return render_template(
        "curriculum.html",
        curriculum=store.curriculum(),
        ai_enabled=claude.is_configured(),
    )


@app.route("/lesson/<lesson_id>")
def lesson(lesson_id: str):
    data = store.lesson(lesson_id)
    if not data:
        return render_template("not_found.html", lesson_id=lesson_id), 404
    return render_template(
        "lesson.html",
        lesson=data,
        prereqs=store.prerequisites(data["skill_id"]),
        all_lessons=store.siblings(data),
        ai_enabled=claude.is_configured(),
    )


@app.route("/diagnostic")
def diagnostic():
    return render_template(
        "leveltest.html",
        topics=store.level_topics(),
        ai_enabled=claude.is_configured(),
    )


@app.route("/chat")
def chat():
    return render_template(
        "chat.html",
        ai_enabled=claude.is_configured(),
    )


# --------------------------------------------------------------------------- #
# API — config
# --------------------------------------------------------------------------- #

@app.route("/api/config")
def api_config():
    return jsonify({"ai_enabled": claude.is_configured()})


# --------------------------------------------------------------------------- #
# API — diagnostic
# --------------------------------------------------------------------------- #

def _mastery_from(responses: list[dict]) -> dict[str, float]:
    by_skill: dict[str, list[bool]] = {}
    item_skill = {it["id"]: it["skill_id"] for it in store.diagnostic_items()}
    for r in responses:
        sid = item_skill.get(r.get("item_id"))
        if sid:
            by_skill.setdefault(sid, []).append(bool(r.get("correct")))
    return {s: sum(v) / len(v) for s, v in by_skill.items()}


@app.route("/api/diagnostic/next", methods=["POST"])
def api_diagnostic_next():
    payload = request.get_json(force=True) or {}
    responses = payload.get("responses", [])
    answered_ids = [r["item_id"] for r in responses if "item_id" in r]
    if len(answered_ids) >= MAX_DIAGNOSTIC_ITEMS:
        return jsonify({"done": True})
    mastery = _mastery_from(responses)
    item = store.pick_next_item(answered_ids, mastery)
    if not item:
        return jsonify({"done": True})
    # Never leak the answer index/solution to the client mid-test.
    safe = {k: item[k] for k in ("id", "skill_id", "difficulty", "stem_mn", "latex", "choices")}
    return jsonify({"done": False, "item": safe,
                    "progress": {"answered": len(answered_ids), "total": MAX_DIAGNOSTIC_ITEMS}})


@app.route("/api/diagnostic/check", methods=["POST"])
def api_diagnostic_check():
    """Grade a single answered item (returns correctness + worked solution)."""
    payload = request.get_json(force=True) or {}
    item_id = payload.get("item_id")
    choice = payload.get("choice")
    item = next((it for it in store.diagnostic_items() if it["id"] == item_id), None)
    if not item:
        return jsonify({"error": "unknown item"}), 404
    correct = (choice == item["answer"])
    return jsonify({"correct": correct, "answer": item["answer"]})


@app.route("/api/diagnostic/grade", methods=["POST"])
def api_diagnostic_grade():
    payload = request.get_json(force=True) or {}
    responses = payload.get("responses", [])
    return jsonify(store.grade_diagnostic(responses))


# --------------------------------------------------------------------------- #
# API — level test (Түвшин тогтоох шалгалт)
# --------------------------------------------------------------------------- #

@app.route("/api/leveltest/questions", methods=["POST"])
def api_leveltest_questions():
    payload = request.get_json(force=True) or {}
    topic_id = payload.get("topic")
    qs = store.level_questions(topic_id)
    if qs is None:
        return jsonify({"error": "unknown topic"}), 404
    return jsonify({"topic": topic_id, "questions": qs})


@app.route("/api/leveltest/grade", methods=["POST"])
def api_leveltest_grade():
    payload = request.get_json(force=True) or {}
    topic_id = payload.get("topic")
    answers = payload.get("answers", [])
    if not isinstance(answers, list):
        return jsonify({"error": "answers must be a list"}), 400
    result = store.grade_level_topic(topic_id, answers)
    if result is None:
        return jsonify({"error": "unknown topic"}), 404
    return jsonify(result)


# --------------------------------------------------------------------------- #
# API — AI tutor (Socratic, streamed) + router (question -> lesson)
# --------------------------------------------------------------------------- #

def _tutor_system(lesson_id: str | None) -> str:
    catalog = store.router_catalog()
    catalog_lines = [
        f'- {c["grade"]}-р анги, бүлэг {c["chapter"]}: {c["title_mn"]}'
        + (f'  (хичээл нээлттэй, id="{c["id"]}")' if c["status"] == "available" else "  (өмнөх ангийн суурь)")
        for c in catalog
    ]
    base = (
        "Чи бол Монгол сурагчдад зориулсан ЭЕШ-д бэлддэг математикийн дотно багш — "
        "нэр нь \"Заавар\". Дүрэм:\n"
        "1) ХАРИУЛТЫГ ШУУД БҮҮ ХЭЛ. Сократын аргаар асуулт, сэжүүр, жижиг алхмаар "
        "сурагчийг өөрөө бодоход нь хөтлөн чиглүүл.\n"
        "2) Сурагч гацсан үед яг АЛЬ ХИЧЭЭЛийг (анги, бүлэг) үзэхийг зөвлө. "
        "Хэрэв урьдчилсан мэдлэг дутаж байвал өмнөх ангийн суурь хичээл рүү буцаа.\n"
        "3) Богино, тодорхой, урам зориг өгөхүйц бич. Математикийг $...$ дотор LaTeX-ээр бич.\n"
        "4) Зөвхөн математикийн сэдвээр ярь.\n\n"
        "СУРАХ БИЧГИЙН АГУУЛГА (чиглүүлэхэд ашигла):\n" + "\n".join(catalog_lines)
    )
    if lesson_id:
        cur = store.lesson(lesson_id)
        if cur:
            base += (
                f"\n\nОдоо сурагч '{cur['grade']}-р анги, {cur['lesson_num']} "
                f"{cur['title_mn']}' хичээл дээр байна. Энэ хичээлийн хүрээнд тусал."
            )
    return base


@app.route("/api/tutor", methods=["POST"])
def api_tutor():
    payload = request.get_json(force=True) or {}
    messages = payload.get("messages", [])
    lesson_id = payload.get("lesson_id")
    system = _tutor_system(lesson_id)

    def sse(obj: dict) -> str:
        return f"data: {json.dumps(obj, ensure_ascii=False)}\n\n"

    def generate():
        if not claude.is_configured():
            yield sse({"text": "🔑 AI багш идэвхгүй байна. ANTHROPIC_API_KEY-г тохируулаад дахин ажиллуулаарай."})
            yield sse({"done": True})
            return
        try:
            for chunk in claude.tutor_stream(system, messages, max_tokens=1200):
                yield sse({"text": chunk})
        except claude.ClaudeError as exc:
            yield sse({"text": f"\n\n⚠️ Алдаа: {exc}"})
        yield sse({"done": True})

    return Response(generate(), mimetype="text/event-stream",
                    headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.route("/api/route", methods=["POST"])
def api_route():
    """Map a free-form question to the exact textbook lesson (Haiku, structured)."""
    payload = request.get_json(force=True) or {}
    question = (payload.get("question") or "").strip()
    if not question:
        return jsonify({"error": "empty question"}), 400
    if not claude.is_configured():
        return jsonify({"ai_enabled": False})

    catalog = store.router_catalog()
    try:
        result = claude.route_question(question, catalog)
    except claude.ClaudeError as exc:
        return jsonify({"error": str(exc)}), 502

    def describe(ident: str) -> dict | None:
        node = store.node(ident)
        if not node:
            node = next((c for c in catalog if c["id"] == ident), None)
            if node:
                node = store.node(node["skill_id"])
        if not node:
            return None
        return {
            "lesson_id": node.get("lesson_id"),
            "skill_id": node["skill_id"],
            "title_mn": node["title_mn"],
            "grade": node["grade"],
            "chapter": node["chapter"],
            "status": node["status"],
        }

    main = describe(result.get("lesson_id", ""))
    prereqs = [d for d in (describe(p) for p in result.get("prerequisite_lesson_ids", [])) if d]
    return jsonify({
        "ai_enabled": True,
        "match": main,
        "prerequisites": prereqs,
        "confidence": result.get("confidence"),
        "reason_mn": result.get("reason_mn"),
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
