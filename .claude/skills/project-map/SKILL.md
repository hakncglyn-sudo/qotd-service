---
name: project-map
description: Architectural map of qotd-service — directory layout, modules, and where to put new code. Load when the user asks about structure, adds a new endpoint, or seems to have lost the layout.
---

# qotd-service — Project map

## Top-level
- `src/server/` — Hono HTTP server; this is where new API endpoints go.
- `src/scripts/` — one-off CLI scripts (seed, migrations).
- `public/` — single `index.html` + vanilla JS. No build step.
- `tests/` — `node:test` files named `<feature>.test.ts`.
- `data/` — runtime SQLite file (`qotd.db`); gitignored.
- `.claude/` — Claude Code project configuration (rules, agents, skills, hooks).

## Module responsibilities
- `src/server/main.ts` — entrypoint; binds to port and loads the app.
- `src/server/app.ts` — Hono app factory; mounts routes and static files.
- `src/server/db.ts` — `better-sqlite3` connection + migrations + prepared statements.
- `src/server/routes/quotes.ts` — `/api/quotes` endpoints (GET, POST, DELETE, random).

## Where to add a new endpoint
1. Add a route file under `src/server/routes/<entity>.ts`.
2. Register it in `src/server/app.ts`.
3. Add `tests/<entity>.test.ts` covering one happy path and one failure per route.
4. Follow the shape rules in `.claude/rules/api-design.md`.
