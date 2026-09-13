-- Seed admin inicial (idempotente).
-- Login: admin@finance.com / Admin@123

INSERT INTO usuario (nome, email, senha, perfil, situacao, created_at, updated_at)
SELECT
    'Administrador',
    'admin@finance.com',
    '$2b$10$BL7NVNIkgcLHSu/jG7AbRuGpLx7qQEL8pT1da84bPvAHRYrz6rYwS',
    'ADMIN',
    'ATIVO',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM usuario WHERE email = 'admin@finance.com'
);
