import { seedIfEmpty, countQuotes } from '../server/db.ts';

const inserted = seedIfEmpty();
const total = countQuotes();
process.stdout.write(`Seeded ${inserted} quotes; total now ${total}\n`);
