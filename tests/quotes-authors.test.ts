import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server/app.ts';
import { seedIfEmpty } from '../src/server/db.ts';

seedIfEmpty();
const app = createApp();

test('GET /api/authors returns 200 with an array of { author, count } entries for each seeded author', async () => {
  const res = await app.request('http://localhost/api/authors');
  assert.equal(res.status, 200);
  const body = (await res.json()) as { data: Array<{ author: string; count: number }> };
  assert.ok(Array.isArray(body.data));
  assert.ok(body.data.length > 0, 'expected at least one author after seeding');
  for (const entry of body.data) {
    assert.equal(typeof entry.author, 'string');
    assert.ok(entry.author.length > 0, 'author should be a non-empty string');
    assert.equal(typeof entry.count, 'number');
    assert.ok(Number.isInteger(entry.count));
    assert.ok(entry.count >= 1, 'count should be >= 1');
  }
});

test('GET /api/authors entries are sorted by count DESC, then author ASC', async () => {
  const res = await app.request('http://localhost/api/authors');
  assert.equal(res.status, 200);
  const body = (await res.json()) as { data: Array<{ author: string; count: number }> };
  for (let i = 1; i < body.data.length; i++) {
    const prev = body.data[i - 1];
    const curr = body.data[i];
    if (prev.count === curr.count) {
      assert.ok(
        prev.author.localeCompare(curr.author) <= 0,
        `expected authors with equal count to be sorted ASC, got "${prev.author}" before "${curr.author}"`,
      );
    } else {
      assert.ok(
        prev.count > curr.count,
        `expected count DESC, got ${prev.count} before ${curr.count}`,
      );
    }
  }
});

test('GET /api/authors counts sum to /api/quotes/count', async () => {
  const authorsRes = await app.request('http://localhost/api/authors');
  assert.equal(authorsRes.status, 200);
  const authorsBody = (await authorsRes.json()) as {
    data: Array<{ author: string; count: number }>;
  };
  const sum = authorsBody.data.reduce((acc, entry) => acc + entry.count, 0);

  const countRes = await app.request('http://localhost/api/quotes/count');
  assert.equal(countRes.status, 200);
  const countBody = (await countRes.json()) as { data: { count: number } };

  assert.equal(sum, countBody.data.count);
});
