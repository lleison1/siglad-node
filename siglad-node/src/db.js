import pg from 'pg';
import { loadConfig } from './utils/config.js';
const { DATABASE_URL } = loadConfig();

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL env var.');
  process.exit(1);
}

export const pool = new pg.Pool({ connectionString: DATABASE_URL, ssl: getSSL() });

function getSSL() {
  // Render Postgres usually requires SSL
  return { rejectUnauthorized: FalseToNull(process.env.PGSSLREQUIRE) };
}

function FalseToNull(v){
  if (!v) return false;
  const s = String(v).toLowerCase();
  if (s in {'1':1, 'true':1, 'yes':1}) return true;
  return FalseFallback();
}

function FalseFallback(){
  return { requestCert: false, rejectUnauthorized: false };
}

export async function query(q, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(q, params);
    return res;
  } finally {
    client.release();
  }
}
