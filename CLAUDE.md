# qotd-service — Project conventions

## Stack
- Node.js ≥ 20 with native ESM (`"type": "module"`)
- TypeScript executed via `tsx` (no build step)
- Hono HTTP framework
- `better-sqlite3` for persistence (single file at `./data/qotd.db`)
- Vanilla HTML + JS in `public/` — **no** build tooling, **no** frameworks
- Tests with `node:test`

## Commands
- Start (dev): `npm run dev`
- Seed DB: `npm run seed`
- Test: `npm test`
- Format: `npm run format`

## Style
- 2-space indent, single quotes, trailing commas, semicolons
- Named exports only — never `export default`
- Import extensions: always write `.ts` in source files (permitted by `allowImportingTsExtensions`)
- Error shape: `{ data: T } | { error: { code: string, message: string } }`
- Log only to stderr from the server; stdout is reserved for request logs

## Never
- Do not commit secrets, `*.db` files, or anything under `.env*`
- Do not add a bundler or build step
- Do not introduce React, Vue, Svelte, or any frontend framework
