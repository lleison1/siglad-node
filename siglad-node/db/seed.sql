-- Seed admin user (password: Admin#2025)
INSERT INTO users(name,email,password_hash,role,active)
VALUES ('Admin', 'admin@siglad.test', '$2a$10$B82Yxv9fYw3cTtqFfbk0UuY8b9m2z7mX8Yk9mM9gG8x9A0bQwWgKu', 'ADMIN', true)
ON CONFLICT (email) DO NOTHING;
