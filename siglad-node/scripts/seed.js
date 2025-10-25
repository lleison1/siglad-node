import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = fs.readFileSync(path.join(__dirname, '../db/seed.sql'), 'utf8');
(async () => {
  await query(seed);
  console.log('Seed applied.');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
