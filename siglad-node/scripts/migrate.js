import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
(async () => {
  await query(schema);
  console.log('Migration applied.');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
