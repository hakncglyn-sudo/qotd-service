---
name: add-quote
description: Inserts a quote into the local database via the running API. Use when the user types /add-quote followed by the quote text and author.
argument-hint: <"text" "author">
disable-model-invocation: true
allowed-tools: Bash(curl *), Bash(sqlite3 *)
---

# Add Quote skill

## Current state (injected at load time)

- Quotes currently in DB: !`sqlite3 data/qotd.db "SELECT COUNT(*) AS n FROM quotes;" 2>/dev/null || echo 'db missing'`
- Last 3 quotes: !`sqlite3 data/qotd.db "SELECT id || ' | ' || author || ' — ' || substr(text, 1, 60) FROM quotes ORDER BY id DESC LIMIT 3;" 2>/dev/null || echo '(none)'`

## Task

The user typed: `/add-quote $ARGUMENTS`

Parse `$ARGUMENTS` as two shell-quoted strings: the first is the quote text, the second is the author. If you cannot confidently parse them, ask the user to re-run with the format `/add-quote "<text>" "<author>"` and stop.

Otherwise, POST the new quote to the **running dev server**:

```bash
curl -s -X POST http://localhost:3000/api/quotes \
  -H 'Content-Type: application/json' \
  -d "{\"text\": \"<text>\", \"author\": \"<author>\"}"
```

Parse the response. Report:
1. The new quote's ID.
2. The new total count (fetch `GET /api/quotes` and report `.data.length`).
3. A one-sentence confirmation.

If the POST fails (4xx or connection refused), explain the likely cause (server not running, bad input shape) and suggest `npm run dev` in another terminal.
