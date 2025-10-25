-- PostgreSQL schema for SIGLAD
CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN','AGENTE','TRANSPORTISTA')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS declarations(
  id SERIAL PRIMARY KEY,
  numero_documento VARCHAR(32) NOT NULL UNIQUE,
  duca_json JSONB NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('PENDIENTE','VALIDADA','RECHAZADA')),
  valor_aduana_total NUMERIC(12,2),
  moneda VARCHAR(8),
  created_by INTEGER REFERENCES users(id),
  validated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  validated_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS bitacora(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  ip_origen TEXT,
  operacion TEXT,
  resultado TEXT,
  numero_declaracion VARCHAR(32),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_declarations_numero ON declarations(numero_documento);
