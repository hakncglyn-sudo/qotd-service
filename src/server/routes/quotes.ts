import { Hono } from 'hono';
import { countQuotes, deleteQuote, getRandomQuote, insertQuote, listQuotes } from '../db.ts';

export const quotesRouter = new Hono();

const errorBody = (code: string, message: string) => ({ error: { code, message } });

quotesRouter.get('/quotes', (c) => {
  const author = c.req.query('author');
  const data = listQuotes(author);
  return c.json({ data });
});

quotesRouter.get('/quotes/count', (c) => {
  return c.json({ data: { count: countQuotes() } });
});

quotesRouter.get('/quotes/random', (c) => {
  const row = getRandomQuote();
  if (!row) {
    return c.json(errorBody('NOT_FOUND', 'No quotes available.'), 404);
  }
  return c.json({ data: row });
});

quotesRouter.post('/quotes', async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json(errorBody('INVALID_INPUT', 'Body must be valid JSON.'), 400);
  }

  if (!body || typeof body !== 'object') {
    return c.json(errorBody('INVALID_INPUT', 'Body must be a JSON object.'), 400);
  }
  const { text, author } = body as { text?: unknown; author?: unknown };
  if (typeof text !== 'string' || text.trim().length === 0) {
    return c.json(errorBody('INVALID_INPUT', 'Field "text" is required.'), 400);
  }
  if (typeof author !== 'string' || author.trim().length === 0) {
    return c.json(errorBody('INVALID_INPUT', 'Field "author" is required.'), 400);
  }
  if (text.length > 1000 || author.length > 200) {
    return c.json(errorBody('INVALID_INPUT', 'Field too long.'), 400);
  }
  const created = insertQuote(text.trim(), author.trim());
  return c.json({ data: created }, 201);
});

quotesRouter.delete('/quotes/:id', (c) => {
  const idParam = c.req.param('id');
  const id = Number.parseInt(idParam, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return c.json(errorBody('INVALID_INPUT', 'Invalid id.'), 400);
  }
  const ok = deleteQuote(id);
  if (!ok) {
    return c.json(errorBody('NOT_FOUND', 'Quote not found.'), 404);
  }
  return c.json({ data: { id } });
});
