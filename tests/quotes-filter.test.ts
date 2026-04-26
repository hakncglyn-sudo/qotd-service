import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server/app.ts';
import { seedIfEmpty } from '../src/server/db.ts';

seedIfEmpty();
const app = createApp();

type Quote = { id: number; text: string; author: string; created_at: number };

test('Filtering by an existing author returns only that author rows', async () => {
  const res = await app.request('http://localhost/api/quotes?author=Edsger%20Dijkstra');
  assert.equal(res.status, 200);
  const body = (await res.json()) as { data: Quote[] };
  assert.ok(body.data.length > 0, 'expected at least one Dijkstra quote');
  for (const q of body.data) {
    assert.equal(q.author, 'Edsger Dijkstra');
  }
});

test('Filtering by a missing author returns an empty array with no error', async () => {
  const res = await app.request('http://localhost/api/quotes?author=Nobody%20McNobody');
  assert.equal(res.status, 200);
  const body = (await res.json()) as { data: Quote[] };
  assert.deepEqual(body.data, []);
});
