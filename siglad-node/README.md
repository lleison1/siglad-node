# SIGLAD – Node.js + PostgreSQL (Render Ready)

API REST con autenticación JWT, roles (ADMIN, AGENTE, TRANSPORTISTA) y casos de uso: autenticación, gestión de usuarios, registro/validación de DUCA y consulta de estados.

## Requisitos
- Node 18+
- PostgreSQL 14+ (Render Postgres funciona perfecto)
- Variables de entorno: ver `.env.example`

## Correr local
```bash
cp .env.example .env
# edita DATABASE_URL y JWT_SECRET
npm install
npm run migrate
npm run seed
npm run dev
# abre http://localhost:8080
```

## Endpoints clave
- `POST /api/auth/login` → devuelve `{token, role}`
- `POST /api/users` (ADMIN) → crea usuario
- `GET /api/users` (ADMIN) → lista usuarios
- `POST /api/declarations` (TRANSPORTISTA) → registra DUCA
- `GET /api/declarations` (cualquiera autenticado) → lista; si es TRANSPORTISTA, solo las propias
- `PATCH /api/declarations/:id/validate` (AGENTE) → aprueba/rechaza
- `GET /api/status?numeroDocumento=GT2025DUCA001234` (autenticado) → estado puntual

## Despliegue en Render (paso a paso)
1. **Sube a GitHub**: crea un repo nuevo y sube todo este proyecto.
2. **Render – crear Postgres**: en Render, *New → PostgreSQL* (elige plan Free). Copia la cadena de conexión.
3. **Render – crear Web Service**: *New → Web Service → Build with your repo*.
   - Branch: `main`
   - Runtime: Node
   - Build Command: `npm install && npm run migrate && npm run seed`
   - Start Command: `npm start`
4. **Environment**: agrega variables de entorno:
   - `DATABASE_URL` = tu conexión de Render Postgres (usa opción *External Connection*; suele requerir SSL)
   - `JWT_SECRET` = una cadena aleatoria segura
   - `TOKEN_EXPIRES_IN` = `2h`
   - `PORT` = `10000` (Render la ignora y te inyecta PORT, pero la dejamos por claridad)
5. **Deploy**: Render hará el build, ejecutará las migraciones y el seed (crea el usuario `admin@siglad.test` / `Admin#2025`), y publicará tu URL.
6. **Probar**: abre tu URL de Render. Verás el *demo UI*. Haz login y prueba los flujos.
7. **Logs**: revisa *Logs* en Render si algo falla.

## Roles
- `ADMIN`: crea/gestiona usuarios.
- `AGENTE`: valida/rechaza declaraciones.
- `TRANSPORTISTA`: registra DUCA y consulta su estado.

## Notas
- El token expira en 2 horas.
- El correo es único y los usuarios inactivos no pueden ingresar.
- Cada DUCA (`numeroDocumento`) es único.
