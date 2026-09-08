-- Ex. 2 — Inserção de cliente com ROLLBACK
-- Objetivo: inserir por engano e desfazer tudo com ROLLBACK.
-- Tabela: clientes
--
-- Diferença face ao Ex. 1:
--   COMMIT  → publica as mudanças (ficam permanentes)
--   ROLLBACK → deita fora o "rascunho" (nada fica gravado)

-- Contagem antes (opcional)
SELECT COUNT(*) AS total_antes FROM clientes;

BEGIN;

INSERT INTO clientes (
  nome_empresarial,
  email,
  telefone,
  endereco,
  numero,
  complemento,
  cidade,
  estado,
  nota,
  situacao,
  created_at,
  updated_at
) VALUES (
  'Cliente Errado ME',
  'tutorial.ex2.rollback@finance.local',
  '8400000002',
  'Rua Fictícia',
  '999',
  'N/A',
  'Maputo',
  'Maputo',
  1,
  'ATIVO',
  NOW(),
  NOW()
)
RETURNING id, nome_empresarial, email;

-- Dentro DESTA sessão o cliente existe (ainda é rascunho).
SELECT id, nome_empresarial, email
FROM clientes
WHERE email = 'tutorial.ex2.rollback@finance.local';

-- Desfaz tudo o que aconteceu desde o BEGIN
ROLLBACK;

-- Depois do ROLLBACK o cliente NÃO existe (nesta nem noutra sessão).
SELECT id, nome_empresarial, email
FROM clientes
WHERE email = 'tutorial.ex2.rollback@finance.local';
-- esperado: 0 linhas

SELECT COUNT(*) AS total_depois FROM clientes;
-- esperado: igual a total_antes
