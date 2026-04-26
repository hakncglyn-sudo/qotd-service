#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Protected patterns — blocked for Edit and Write tools
PROTECTED=(
  ".env"
  ".env.local"
  "data/qotd.db"
  ".git/"
  ".github/workflows/"
)

for p in "${PROTECTED[@]}"; do
  if [[ "$FILE_PATH" == *"$p"* ]]; then
    echo "Blocked: '$FILE_PATH' matches protected pattern '$p'. Use a plain terminal write or update settings if this is intended." >&2
    exit 2
  fi
done

exit 0
