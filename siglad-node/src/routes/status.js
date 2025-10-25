import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const statusRouter = Router();

// Query status by numeroDocumento or list mine
statusRouter.get('/', requireAuth, async (req, res) => {
  const { numeroDocumento } = req.query;
  if (numeroDocumento) {
    const { rows } = await query(`SELECT numero_documento, estado, created_at, validated_at FROM declarations WHERE numero_documento=$1`, [numeroDocumento]);
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    return res.json(rows[0]);
  } else {
    const { rows } = await query(`SELECT numero_documento, estado, created_at FROM declarations WHERE created_by=$1 ORDER BY id DESC`, [req.user.sub]);
    return res.json(rows);
  }
});
