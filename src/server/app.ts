// qotd-service — Hono app
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { quotesRouter } from './routes/quotes.ts';

export const createApp = (): Hono => {
  const app = new Hono();

  app.route('/api', quotesRouter);

  app.use('/*', serveStatic({ root: './public' }));
  app.get('/', serveStatic({ path: './public/index.html' }));

  app.notFound((c) =>
    c.json(
      { error: { code: 'NOT_FOUND', message: `No route for ${c.req.method} ${c.req.path}` } },
      404,
    ),
  );

  app.onError((err, c) => {
    process.stderr.write(`[error] ${err.message}\n`);
    return c.json({ error: { code: 'INTERNAL', message: 'Internal server error' } }, 500);
  });

  return app;
};
