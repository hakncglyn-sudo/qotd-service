import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server/app.ts';
import { seedIfEmpty } from '../src/server/db.ts';

seedIfEmpty();
const app = createApp();

const req = (path: string, init?: RequestInit) => app.request(`http://localhost${path}`, init);

test('GET /api/quotes returns seeded data', async () => {
  const res = await req('/api/quotes');
  assert.equal(res.status, 200);
  const body = (await res.json()) as { data: unknown[] };
  assert.ok(Array.isArray(body.data));
  assert.ok(body.data.length >= 5, 'expected at least 5 seeded quotes');
});

test('POST /api/quotes with bad input returns 400 + INVALID_INPUT', async () => {
  const res = await req('/api/quotes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: '', author: '' }),
  });
  assert.equal(res.status, 400);
  const body = (await res.json()) as { error?: { code?: string } };
  assert.equal(body.error?.code, 'INVALID_INPUT');
});
