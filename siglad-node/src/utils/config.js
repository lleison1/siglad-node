import dotenv from 'dotenv';
dotenv.config();

export function loadConfig() {
  return {
    PORT: process.env.PORT || 8080,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'changeme',
    TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN || '2h',
    NODE_ENV: process.env.NODE_ENV || 'production'
  };
}
