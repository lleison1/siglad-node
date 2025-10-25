import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const declarationsRouter = Router();

// Create DUCA (TRANSPORTISTA)
declarationsRouter.post('/', requireAuth, requireRole('TRANSPORTISTA'), async (req, res) => {
  const duca = req.body?.duca;
  if (!duca?.numeroDocumento) return res.status(400).json({ error: 'numeroDocumento requerido' });
  try {
    await query(`INSERT INTO declarations(numero_documento, duca_json, estado, created_by, valor_aduana_total, moneda)
                 VALUES ($1, $2, 'PENDIENTE', $3, $4, $5)`,
                [duca.numeroDocumento, duca, req.user.sub, duca?.valores?.valorAduanaTotal || null, duca?.valores?.moneda || null]);
    await query(`INSERT INTO bitacora(user_id, ip_origen, operacion, resultado, numero_declaracion) 
                 VALUES ($1,$2,'REGISTRO_DECLARACION','EXITO',$3)`,
                [req.user.sub, req.ip || 'unknown', duca.numeroDocumento]);
    res.status(201).json({ message: 'Declaración registrada correctamente' });
  } catch (e) {
    if (String(e).includes('unique')) return res.status(409).json({ error: 'DUCA ya existe' });
    res.status(500).json({ error: 'Error al registrar declaración' });
  }
});

// List own declarations (Transportista) or all (Admin/Agente)
declarationsRouter.get('/', requireAuth, async (req, res) => {
  let q = `SELECT id,numero_documento,estado,created_at,validated_by,validated_at FROM declarations WHERE 1=1`;
  let params = [];
  if (req.user.role === 'TRANSPORTISTA') { q += ` AND created_by=$1`; params = [req.user.sub]; }
  q += ` ORDER BY id DESC`;
  const { rows } = await query(q, params);
  res.json(rows);
});

// Validate / Reject (AGENTE)
declarationsRouter.patch('/:id/validate', requireAuth, requireRole('AGENTE'), async (req, res) => {
  const { accion='APROBAR' } = req.body; // APROBAR | RECHAZAR
  const estado = accion === 'APROBAR' ? 'VALIDADA' : 'RECHAZADA';
  await query(`UPDATE declarations SET estado=$1, validated_by=$2, validated_at=NOW() WHERE id=$3`, 
              [estado, req.user.sub, req.params.id]);
  res.json({ ok: true, estado });
});
