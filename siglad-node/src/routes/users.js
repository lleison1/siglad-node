import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { hashPassword } from '../utils/hash.js';

export const usersRouter = Router();
usersRouter.use(requireAuth, requireRole('ADMIN'));

// Create user (Admin)
usersRouter.post('/', async (req, res) => {
  const { name, email, role, active=true, password='Temporal#2025' } = req.body;
  try {
    const hp = await hashPassword(password);
    const q = `INSERT INTO users(name,email,password_hash,role,active) VALUES ($1,$2,$3,$4,$5) RETURNING id`;
    const { rows } = await query(q, [name, email.toLowerCase(), hp, role, !!active]);
    await query(`INSERT INTO bitacora(user_id, ip_origen, operacion, resultado, numero_declaracion) VALUES ($1,$2,'USUARIO_CREADO','EXITO',NULL)`,
                [req.user.sub, req.ip || 'unknown']);
    res.status(201).json({ id: rows[0].id });
  } catch (e) {
    if (String(e).includes('unique')) return res.status(409).json({ error: 'Correo ya registrado' });
    res.status(500).json({ error: 'No se pudo crear el usuario' });
  }
});

// List users
usersRouter.get('/', async (_req, res) => {
  const { rows } = await query(`SELECT id,name,email,role,active,created_at FROM users ORDER BY id DESC`);
  res.json(rows);
});

// Update user
usersRouter.put('/:id', async (req, res) => {
  const { name, role, active } = req.body;
  await query(`UPDATE users SET name=COALESCE($1,name), role=COALESCE($2,role), active=COALESCE($3,active) WHERE id=$4`, 
              [name, role, active, req.params.id]);
  res.json({ ok: true });
});

// Reset password
usersRouter.post('/:id/reset-password', async (req, res) => {
  const { newPassword } = req.body;
  const hp = await hashPassword(newPassword || 'Temporal#2025');
  await query(`UPDATE users SET password_hash=$1 WHERE id=$2`, [hp, req.params.id]);
  res.json({ ok: true });
});
