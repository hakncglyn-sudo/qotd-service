---
paths:
  - "src/server/**/*.ts"
  - "tests/**/*.ts"
---

# API Design Rules (scoped to src/server/** and tests/**)

- All endpoints live under `/api/...` and return JSON.
- Response shape: `{ data }` on success; `{ error: { code, message } }` on failure.
- Error codes: `NOT_FOUND`, `INVALID_INPUT`, `CONFLICT`, `INTERNAL`.
- Validate input with a hand-written guard (keep dependencies minimal — no Zod).
- Every endpoint has at least one `node:test` covering the happy path + one failure.
- Use prepared statements (`db.prepare(...)`) — never string-concat SQL.
