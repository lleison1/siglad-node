import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { loadConfig } from '../utils/config.js';

const { JWT_SECRET, TOKEN_EXPIRES_IN } = loadConfig();
export const authRouter = Router();

// Register (admin will use /api/users, but keep this for first admin bootstrap if needed)
authRouter.post('/register', async (req, res) => {
  const { name, email, password, role='ADMIN' } = req.body;
  try {
    const pwd = await hashPassword(password);
    const q = `INSERT INTO users(name,email,password_hash,role,active) VALUES ($1,$2,$3,$4,true) RETURNING id`;
    const { rows } = await query(q, [name, email.toLowerCase(), pwd, role]);
    return res.json({ id: rows[0].id });
  } catch (e) {
    if (String(e).includes('unique')) return res.status(409).json({ error: 'Email already registered' });
    return res.status(500).json({ error: 'Failed to register' });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await query(`SELECT id,name,email,password_hash,role,active FROM users WHERE email=$1`, [email.toLowerCase()]);
  if (!rows.length) return res.status(401).json({ error: 'Usuario o contraseña incorrecta' });
  const u = rows[0];
  if (!u.active) return res.status(403).json({ error: 'Usuario deshabilitado' });
  const ok = await comparePassword(password, u.password_hash);
  if (!ok) return res.status(401).json({ error: 'Usuario o contraseña incorrecta' });
  const token = jwt.sign({ sub: u.id, name: u.name, email: u.email, role: u.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
  await query(`INSERT INTO bitacora(user_id, ip_origen, operacion, resultado, numero_declaracion) VALUES ($1,$2,'LOGIN', $3, NULL)`,
              [u.id, req.ip || req.headers['x-forwarded-for'] || 'unknown', 'EXITO']);
  return res.json({ token, role: u.role, name: u.name });
});
