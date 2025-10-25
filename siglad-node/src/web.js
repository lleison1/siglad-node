import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { declarationsRouter } from './routes/declarations.js';
import { statusRouter } from './routes/status.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Static frontend (very simple demo UI)
app.use('/', express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/declarations', declarationsRouter);
app.use('/api/status', statusRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
