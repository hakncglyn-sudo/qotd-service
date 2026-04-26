import { serve } from '@hono/node-server';
import { createApp } from './app.ts';
import { seedIfEmpty } from './db.ts';

const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);

const seeded = seedIfEmpty();
if (seeded > 0) {
  process.stderr.write(`[seed] inserted ${seeded} quotes on first boot\n`);
}

const app = createApp();

serve({ fetch: app.fetch, port: PORT }, (info) => {
  process.stderr.write(`Listening on http://localhost:${info.port}\n`);
});
