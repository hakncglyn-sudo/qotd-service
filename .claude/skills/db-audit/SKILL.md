---
name: db-audit
description: Performs a focused audit of the SQLite schema and data quality. Returns a concise summary without bloating main conversation context. Use when the user asks for a DB health check or before releases.
context: fork
agent: Explore
allowed-tools: Bash(sqlite3 *), Read, Grep, Glob
---

# DB Audit skill (runs in a forked Explore subagent)

Perform a focused audit of `./data/qotd.db` and the migration code in `src/server/db.ts`.

Report the following:
1. **Schema summary** — list each table and each column with type and nullability.
2. **Row counts** per table.
3. **Data-quality findings** — duplicates, empty strings in `NOT NULL` columns, suspiciously long values (>1000 chars), `created_at` values that fall outside plausible ranges.
4. **Migration drift** — any mismatch between `CREATE TABLE` in `src/server/db.ts` and the actual DB schema (`PRAGMA table_info(quotes);`).
5. **Recommendations** — concrete follow-ups with the affected files.

Keep your reply under 250 words. Do not dump the full table contents. Do not propose code edits in this run — the parent session will decide what to act on.
