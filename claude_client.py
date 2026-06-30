"""
Claude API client for Заавар (Math Guide).

Pure stdlib (urllib) — no SDK dependency, so the only pip install is Flask.
Encapsulates the two model roles the platform uses:

  * MODEL_TUTOR  (Sonnet 4.6)  — the live Socratic chat tutor, streamed.
  * MODEL_ROUTER (Haiku 4.5)   — cheap/fast question -> textbook-lesson routing,
                                 returned as structured JSON.

Messages API contract (https://platform.claude.com/docs):
  POST https://api.anthropic.com/v1/messages
  headers: x-api-key, anthropic-version: 2023-06-01, content-type: application/json
  body:    {model, max_tokens, system, messages:[{role, content}], ...}

Model notes baked in here:
  * Sonnet 4.6 / Haiku 4.5 are current; do NOT append date suffixes.
  * `output_config.effort` and adaptive `thinking` ERROR on Haiku 4.5 -> never set
    them on the router. We omit `thinking` on Sonnet too, for snappy chat latency.
  * Haiku 4.5 supports structured outputs (`output_config.format`), which we use to
    force the router to return a clean {lesson_id, ...} object.
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request

API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"

# Current model IDs (exact strings — no date suffixes).
MODEL_TUTOR = "claude-sonnet-4-6"   # $3 / $15 per 1M tokens
MODEL_ROUTER = "claude-haiku-4-5"   # $1 / $5  per 1M tokens


class ClaudeNotConfigured(RuntimeError):
    """Raised when ANTHROPIC_API_KEY is missing."""


class ClaudeError(RuntimeError):
    """Raised on a non-2xx API response or transport failure."""


def api_key() -> str | None:
    key = os.environ.get("ANTHROPIC_API_KEY")
    return key.strip() if key else None


def is_configured() -> bool:
    return bool(api_key())


def _headers() -> dict[str, str]:
    key = api_key()
    if not key:
        raise ClaudeNotConfigured(
            "ANTHROPIC_API_KEY is not set. The AI tutor is disabled until you set it."
        )
    return {
        "x-api-key": key,
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
    }


def _post(payload: dict, *, stream: bool, timeout: float = 60.0):
    """Low-level POST. Returns the raw urllib response object (caller reads it)."""
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(API_URL, data=data, headers=_headers(), method="POST")
    try:
        return urllib.request.urlopen(req, timeout=timeout)
    except urllib.error.HTTPError as exc:  # 4xx / 5xx come back here
        body = exc.read().decode("utf-8", "replace")
        try:
            msg = json.loads(body).get("error", {}).get("message", body)
        except Exception:
            msg = body
        raise ClaudeError(f"Claude API {exc.code}: {msg}") from exc
    except urllib.error.URLError as exc:
        raise ClaudeError(f"Network error reaching Claude API: {exc.reason}") from exc


# --------------------------------------------------------------------------- #
# Tutor (Sonnet) — non-streaming and streaming
# --------------------------------------------------------------------------- #

def tutor_complete(system: str, messages: list[dict], *, max_tokens: int = 1500) -> str:
    """Single-shot tutor reply (non-streaming). Returns concatenated text."""
    payload = {
        "model": MODEL_TUTOR,
        "max_tokens": max_tokens,
        "system": system,
        "messages": messages,
    }
    resp = _post(payload, stream=False)
    body = json.loads(resp.read().decode("utf-8"))
    parts = [b.get("text", "") for b in body.get("content", []) if b.get("type") == "text"]
    return "".join(parts).strip()


def tutor_stream(system: str, messages: list[dict], *, max_tokens: int = 1500):
    """Generator yielding text deltas from the tutor as they stream in (SSE)."""
    payload = {
        "model": MODEL_TUTOR,
        "max_tokens": max_tokens,
        "stream": True,
        "system": system,
        "messages": messages,
    }
    resp = _post(payload, stream=True)
    for raw in resp:
        line = raw.decode("utf-8", "replace").strip()
        if not line.startswith("data:"):
            continue
        chunk = line[len("data:"):].strip()
        if not chunk or chunk == "[DONE]":
            continue
        try:
            event = json.loads(chunk)
        except json.JSONDecodeError:
            continue
        if event.get("type") == "content_block_delta":
            delta = event.get("delta", {})
            if delta.get("type") == "text_delta":
                text = delta.get("text", "")
                if text:
                    yield text


# --------------------------------------------------------------------------- #
# Router (Haiku) — structured question -> lesson classification
# --------------------------------------------------------------------------- #

_ROUTER_SCHEMA = {
    "type": "object",
    "properties": {
        "lesson_id": {
            "type": "string",
            "description": "The id of the single best-matching lesson from the catalog, "
                           "or the empty string if nothing matches.",
        },
        "prerequisite_lesson_ids": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Lesson ids the student should review first if they are stuck "
                           "(ordered easiest-first). May be empty.",
        },
        "confidence": {
            "type": "string",
            "enum": ["high", "medium", "low"],
        },
        "reason_mn": {
            "type": "string",
            "description": "One short sentence in Mongolian explaining the match.",
        },
    },
    "required": ["lesson_id", "prerequisite_lesson_ids", "confidence", "reason_mn"],
    "additionalProperties": False,
}


def route_question(question: str, catalog: list[dict]) -> dict:
    """
    Map a free-form student question to the best textbook lesson.

    `catalog` is a list of {id, grade, chapter, title_mn, skill_id, keywords} dicts.
    Returns the parsed router object (see _ROUTER_SCHEMA). Fast + cheap (Haiku).
    """
    catalog_lines = [
        f'- id="{c["id"]}" | {c.get("grade","?")}-р анги, бүлэг {c.get("chapter","")} | '
        f'{c.get("title_mn","")} | түлхүүр үг: {", ".join(c.get("keywords", []))}'
        for c in catalog
    ]
    system = (
        "Чи бол Монгол улсын ахлах ангийн математикийн сурах бичигт суурилсан "
        "чиглүүлэгч. Сурагчийн асуултыг доорх ХИЧЭЭЛИЙН ЖАГСААЛТ-аас яг тохирох "
        "нэг хичээлд буулгаж өг. Хариултыг өгөхгүй — зөвхөн аль хичээлийг үзэхийг "
        "зөв тодорхойл. Хэрэв сурагч урьдчилсан мэдлэг дутаж байвал prerequisite_lesson_ids-д "
        "эхэлж үзэх хичээлүүдийг жагсаа.\n\nХИЧЭЭЛИЙН ЖАГСААЛТ:\n" + "\n".join(catalog_lines)
    )
    payload = {
        "model": MODEL_ROUTER,
        "max_tokens": 400,
        "system": system,
        "messages": [{"role": "user", "content": f"Сурагчийн асуулт: {question}"}],
        "output_config": {"format": {"type": "json_schema", "schema": _ROUTER_SCHEMA}},
    }
    resp = _post(payload, stream=False)
    body = json.loads(resp.read().decode("utf-8"))
    text = next((b.get("text", "") for b in body.get("content", []) if b.get("type") == "text"), "{}")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"lesson_id": "", "prerequisite_lesson_ids": [], "confidence": "low", "reason_mn": ""}
