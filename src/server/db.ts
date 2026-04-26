import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export type Quote = {
  id: number;
  text: string;
  author: string;
  created_at: number;
};

const DB_PATH = process.env.QOTD_DB_PATH ?? './data/qotd.db';

mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000)
  );
`);

const stmtList = db.prepare('SELECT id, text, author, created_at FROM quotes ORDER BY id ASC');
const stmtListByAuthor = db.prepare(
  'SELECT id, text, author, created_at FROM quotes WHERE author = ? ORDER BY id ASC',
);
const stmtRandom = db.prepare(
  'SELECT id, text, author, created_at FROM quotes ORDER BY RANDOM() LIMIT 1',
);
const stmtInsert = db.prepare(
  'INSERT INTO quotes (text, author, created_at) VALUES (?, ?, ?) RETURNING id, text, author, created_at',
);
const stmtDelete = db.prepare('DELETE FROM quotes WHERE id = ?');
const stmtCount = db.prepare('SELECT COUNT(*) AS n FROM quotes');
const stmtGet = db.prepare('SELECT id, text, author, created_at FROM quotes WHERE id = ?');

export const listQuotes = (author?: string): Quote[] => {
  if (author && author.length > 0) {
    return stmtListByAuthor.all(author) as Quote[];
  }
  return stmtList.all() as Quote[];
};

export const getRandomQuote = (): Quote | undefined => {
  return stmtRandom.get() as Quote | undefined;
};

export const insertQuote = (text: string, author: string): Quote => {
  const now = Date.now();
  const row = stmtInsert.get(text, author, now) as Quote;
  return row;
};

export const deleteQuote = (id: number): boolean => {
  const info = stmtDelete.run(id);
  return info.changes > 0;
};

export const countQuotes = (): number => {
  const row = stmtCount.get() as { n: number };
  return row.n;
};

export const getQuote = (id: number): Quote | undefined => {
  return stmtGet.get(id) as Quote | undefined;
};

const SEED_QUOTES: Array<{ text: string; author: string }> = [
  { text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger Dijkstra' },
  {
    text: 'Walking on water and developing software from a specification are easy if both are frozen.',
    author: 'Edward V. Berard',
  },
  {
    text: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    author: 'Harold Abelson',
  },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
];

export const seedIfEmpty = (): number => {
  if (countQuotes() > 0) return 0;
  const insertMany = db.transaction((rows: Array<{ text: string; author: string }>) => {
    for (const r of rows) insertQuote(r.text, r.author);
  });
  insertMany(SEED_QUOTES);
  return SEED_QUOTES.length;
};
