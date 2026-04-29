import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server/app.ts';
import { seedIfEmpty } from '../src/server/db.ts';

seedIfEmpty();
const app = createApp();

type Quote = { id: number; text: string; author: string; created_at: number };

test('GET /api/quotes/by-author/:author returns 200 with quotes for a seeded author', async () => {
  const author = 'Edsger Dijkstra';
  const res = await app.request(
    `http://localhost/api/quotes/by-author/${encodeURIComponent(author)}`,
  );
  assert.equal(res.status, 200);
  const body = (await res.json()) as { data: { author: string; count: number; quotes: Quote[] } };
  assert.equal(body.data.author, author);
  assert.ok(body.data.count > 0, 'expected at least one quote for Edsger Dijkstra');
  assert.equal(body.data.count, body.data.quotes.length);
  for (const q of body.data.quotes) {
    assert.equal(q.author, author);
  }
});

test('GET /api/quotes/by-author/:author returns 404 for an unknown author', async () => {
  const author = 'Nobody McNobody';
  const res = await app.request(
    `http://localhost/api/quotes/by-author/${encodeURIComponent(author)}`,
  );
  assert.equal(res.status, 404);
  const body = (await res.json()) as { error: { code: string; message: string } };
  assert.equal(body.error.code, 'NOT_FOUND');
});

test('GET /api/quotes/by-author/:author returns 400 when author is longer than 200 chars', async () => {
  const author = 'a'.repeat(201);
  const res = await app.request(
    `http://localhost/api/quotes/by-author/${encodeURIComponent(author)}`,
  );
  assert.equal(res.status, 400);
  const body = (await res.json()) as { error: { code: string; message: string } };
  assert.equal(body.error.code, 'INVALID_INPUT');
});
