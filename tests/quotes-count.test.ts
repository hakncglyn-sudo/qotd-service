import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server/app.ts';
import { seedIfEmpty } from '../src/server/db.ts';

seedIfEmpty();
const app = createApp();

test('GET /api/quotes/count returns a positive integer for the seeded DB', async () => {
  const res = await app.request('http://localhost/api/quotes/count');
  assert.equal(res.status, 200);
  const body = (await res.json()) as { data: { count: number } };
  assert.equal(typeof body.data.count, 'number');
  assert.ok(Number.isInteger(body.data.count));
  assert.ok(body.data.count > 0, 'expected count > 0 with seeded DB');
});
