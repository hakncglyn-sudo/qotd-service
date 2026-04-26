#!/usr/bin/env bash
set -euo pipefail

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'no-git')
COMMIT=$(git log -1 --pretty=format:'%h %s' 2>/dev/null || echo 'no-commits')
STATUS=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')

echo "Branch: ${BRANCH}"
echo "Last commit: ${COMMIT}"
echo "Uncommitted files: ${STATUS}"
echo "Reminder: follow the rules in .claude/rules/ and the conventions in CLAUDE.md."
