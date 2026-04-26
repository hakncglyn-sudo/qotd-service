# qotd-service

A "Quote of the Day" microservice — Hono HTTP + SQLite + a vanilla static UI.
Built end-to-end as part of the Claude Code training scenario, with a full
multi-agent toolkit committed under `.claude/`.

## Features

- List quotes (`GET /api/quotes`), filter by author (`?author=...`)
- Random quote (`GET /api/quotes/random`)
- Total count (`GET /api/quotes/count`)
- Create (`POST /api/quotes`) with input validation (`INVALID_INPUT`)
- Delete (`DELETE /api/quotes/:id`) with `NOT_FOUND` semantics
- Static UI at `/` with counter, random, refresh, and author-filter controls

## Running locally

```bash
npm install
npm run seed   # populates 5 starter quotes on first run
npm run dev    # starts on http://localhost:3000
npm test       # runs the node:test suite (5 tests)
npm run lint   # prettier --check
```

## Project layout

- `src/server/` — Hono app, routes, SQLite layer
- `src/scripts/seed.ts` — idempotent seed script
- `public/index.html` — single-file vanilla UI
- `tests/` — `node:test` files
- `.claude/` — committed Claude Code configuration:
  rules, settings, hooks, skills, and five specialist subagents
- `.github/workflows/ci.yml` — lint + test on every push and PR

## Claude Code roster

| Agent | Role |
| --- | --- |
| `architect` | Read-only planner, Opus |
| `backend-dev` | Server + tests, Sonnet, project memory |
| `frontend-dev` | Static UI, Sonnet, preloaded `project-map` skill |
| `tester` | Worktree-isolated test author, Sonnet |
| `security-auditor` | Plan-mode diff reviewer, Opus |

Skills: `project-map` (architectural reference), `add-quote` (invocable with
shell injection), `db-audit` (forked-context schema audit).

Hooks: SessionStart (git status reminder), PreToolUse (protect-files block on
`.env`, `data/qotd.db`, `.git/`, `.github/workflows/`), PostToolUse (auto
Prettier).

## Plugin

The reusable bits (5 agents, 2 skills, 2 hooks) are packaged at
`../qotd-toolkit/` — install in any sibling repo with
`claude --plugin-dir <path>` for a one-command house-style starter.

## License

Internal training material — Softtech Claude Code Enablement Series.
