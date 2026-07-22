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

from flask import Flask, Response, jsonify, redirect, render_template, request

from markupsafe import Markup, escape

import claude_client as claude
import store

app = Flask(__name__)


def _subject() -> str:
    """Active subject from the `subject` cookie (math default), validated."""
    s = request.cookies.get("subject", store.DEFAULT_SUBJECT)
    return s if s in store.SUBJECTS else store.DEFAULT_SUBJECT


@app.context_processor
def _inject_subject():
    s = _subject()
    return {"subject": s, "subject_name": store.SUBJECTS.get(s, ""), "subjects": store.SUBJECTS}


@app.route("/set-subject/<subject>")
def set_subject(subject):
    """Switch the active subject (Math/Physics) via cookie, then return home."""
    target = subject if subject in store.SUBJECTS else store.DEFAULT_SUBJECT
    nxt = request.args.get("next", "/")
    if not nxt.startswith("/"):
        nxt = "/"
    resp = redirect(nxt)
    resp.set_cookie("subject", target, max_age=60 * 60 * 24 * 365, samesite="Lax")
    return resp


@app.template_filter("richtext")
def richtext(text: str) -> Markup:
    """Markdown-lite -> HTML: paragraphs, line breaks, **bold**, `inline code`,
    and ```fenced code blocks``` (for IT/programming). Leaves $..$ math intact
    for client-side KaTeX. HTML-escaped first for safety."""
    import re
    out = []
    # First split out ```fenced code blocks``` (may sit inline next to text). Even
    # segments are prose, odd segments are code.
    for i, seg in enumerate(re.split(r"```(.*?)```", text or "", flags=re.S)):
        if i % 2 == 1:  # code block
            code = str(escape(seg.strip("\n")))
            out.append(f'<pre class="my-2 p-3 rounded-lg bg-slate-900 text-slate-100 text-sm overflow-x-auto"><code>{code}</code></pre>')
            continue
        for para in seg.split("\n\n"):
            if not para.strip():
                continue
            body = str(escape(para)).replace("\n", "<br>")
            body = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", body)
            body = re.sub(r"`([^`]+)`", r'<code class="px-1 py-0.5 rounded bg-slate-100 text-[0.9em] font-mono">\1</code>', body)
            out.append(f"<p>{body}</p>")
    return Markup("".join(out))


# --------------------------------------------------------------------------- #
# Pages
# --------------------------------------------------------------------------- #

@app.route("/")
def home():
    s = _subject()
    featured = store.featured_lessons(s)
    return render_template(
        "home.html",
        lessons=featured["lessons"],
        featured=featured,
        ai_enabled=claude.is_configured(),
    )


@app.route("/curriculum")
def curriculum():
    return render_template(
        "curriculum.html",
        curriculum=store.curriculum(_subject()),
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
        prereqs=store.prerequisites(data.get("skill_id", "")),
        all_lessons=store.siblings(data),
        ai_enabled=claude.is_configured(),
    )


@app.route("/diagnostic")
def diagnostic():
    return render_template(
        "leveltest.html",
        topics=store.level_topics(_subject()),
        ai_enabled=claude.is_configured(),
    )


@app.route("/chat")
def chat():
    return render_template(
        "chat.html",
        ai_enabled=claude.is_configured(),
    )


@app.route("/mastery")
def mastery():
    return render_template(
        "mastery.html",
        topics=store.mastery_topics(_subject()),
        ai_enabled=claude.is_configured(),
    )


@app.route("/mock")
def mock():
    return render_template(
        "mock.html",
        versions=store.MOCK_VERSIONS,
        ai_enabled=claude.is_configured(),
    )


@app.route("/report")
def report():
    return render_template(
        "report.html",
        ai_enabled=claude.is_configured(),
    )


# --------------------------------------------------------------------------- #
# API — config
# --------------------------------------------------------------------------- #

@app.route("/api/config")
def api_config():
    return jsonify({"ai_enabled": claude.is_configured()})


# --------------------------------------------------------------------------- #
# API — level test (Түвшин тогтоох шалгалт)
# --------------------------------------------------------------------------- #

@app.route("/api/leveltest/questions", methods=["POST"])
def api_leveltest_questions():
    payload = request.get_json(force=True) or {}
    topic_id = payload.get("topic")
    qs = store.level_questions(_subject(), topic_id)
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
    result = store.grade_level_topic(_subject(), topic_id, answers)
    if result is None:
        return jsonify({"error": "unknown topic"}), 404
    return jsonify(result)


# --------------------------------------------------------------------------- #
# API — mastery confirmation (Баталгаа) + mock test
# --------------------------------------------------------------------------- #

@app.route("/api/mastery/check", methods=["POST"])
def api_mastery_check():
    payload = request.get_json(force=True) or {}
    items = store.mastery_items(_subject(), payload.get("topic"))
    if items is None:
        return jsonify({"error": "unknown topic"}), 404
    return jsonify(items)


@app.route("/api/mastery/grade", methods=["POST"])
def api_mastery_grade():
    payload = request.get_json(force=True) or {}
    responses = payload.get("responses") or {}
    if not isinstance(responses, dict):
        return jsonify({"error": "responses must be an object"}), 400
    result = store.grade_mastery(_subject(), payload.get("topic"), responses)
    if result is None:
        return jsonify({"error": "unknown topic"}), 404
    return jsonify(result)


@app.route("/api/mock/version", methods=["POST"])
def api_mock_version():
    payload = request.get_json(force=True) or {}
    try:
        v = int(payload.get("v", 0))
    except (TypeError, ValueError):
        v = 0
    return jsonify(store.mock_version(_subject(), v))


@app.route("/api/mock/grade", methods=["POST"])
def api_mock_grade():
    payload = request.get_json(force=True) or {}
    responses = payload.get("responses", [])
    if not isinstance(responses, list):
        return jsonify({"error": "responses must be a list"}), 400
    try:
        v = int(payload.get("v", 0))
    except (TypeError, ValueError):
        v = 0
    return jsonify(store.grade_mock(_subject(), v, responses))


# --------------------------------------------------------------------------- #
# API — AI tutor (Socratic, streamed) + router (question -> lesson)
# --------------------------------------------------------------------------- #

def _tutor_system(subject: str, lesson_id: str | None) -> str:
    subj_mn = store.SUBJECTS.get(subject, "математик").lower()
    catalog = store.router_catalog(subject)
    catalog_lines = [
        f'- {c["grade"]}-р анги, бүлэг {c["chapter"]}: {c["title_mn"]}'
        + (f'  (хичээл нээлттэй, id="{c["id"]}")' if c["status"] == "available" else "  (өмнөх ангийн суурь)")
        for c in catalog
    ]
    base = (
        f"Чи бол Монгол сурагчдад зориулсан {subj_mn}ийн дотно багш — "
        "нэр нь \"Заавар\". Дүрэм:\n"
        "1) ХАРИУЛТЫГ ШУУД БҮҮ ХЭЛ. Сократын аргаар асуулт, сэжүүр, жижиг алхмаар "
        "сурагчийг өөрөө бодоход нь хөтлөн чиглүүл.\n"
        "2) Сурагч гацсан үед яг АЛЬ ХИЧЭЭЛийг (анги, бүлэг) үзэхийг зөвлө. "
        "Хэрэв урьдчилсан мэдлэг дутаж байвал өмнөх суурь хичээл рүү буцаа.\n"
        f"3) Богино, тодорхой, урам зориг өгөхүйц бич. Томьёог $...$ дотор LaTeX-ээр бич.\n"
        f"4) Зөвхөн {subj_mn}ийн сэдвээр ярь.\n\n"
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
    system = _tutor_system(_subject(), lesson_id)

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

    catalog = store.router_catalog(_subject())
    try:
        result = claude.route_question(question, catalog)
    except claude.ClaudeError as exc:
        return jsonify({"error": str(exc)}), 502

    def describe(ident: str) -> dict | None:
        node = store.node(ident)
        if not node:
            c = next((c for c in catalog if c["id"] == ident), None)
            if c:
                node = store.node(c["skill_id"])
                if not node:  # subject with no knowledge graph (e.g. physics) — use the catalog entry directly
                    return {
                        "lesson_id": c["id"] if c.get("status") == "available" else None,
                        "skill_id": c["skill_id"],
                        "title_mn": c["title_mn"],
                        "grade": c["grade"],
                        "chapter": c["chapter"],
                        "status": c["status"],
                    }
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
