#!/usr/bin/env bash
# Заавар / Math Guide — launcher
set -e
cd "$(dirname "$0")"

# Load .env if present (so ANTHROPIC_API_KEY is available to the app)
if [ -f .env ]; then
  set -a; . ./.env; set +a
fi

python3 -m pip install --quiet --disable-pip-version-check -r requirements.txt
echo ""
echo "  Заавар (Math Guide) ажиллаж байна → http://127.0.0.1:5001"
echo "  AI tutor:  ${ANTHROPIC_API_KEY:+ENABLED}${ANTHROPIC_API_KEY:-DISABLED (set ANTHROPIC_API_KEY to enable)}"
echo ""
exec python3 app.py
