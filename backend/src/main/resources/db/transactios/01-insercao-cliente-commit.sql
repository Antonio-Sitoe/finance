-- Ex. 1 — Inserção de cliente com COMMIT
-- Objetivo: gravar um cliente de forma permanente dentro de uma transação.
-- Tabela: clientes

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
  'Tutorial Transações LTDA',
  'tutorial.ex1@finance.local',
  '8400000001',
  'Av. Julius Nyerere',
  '100',
  'Sala 1',
  'Maputo',
  'Maputo',
  3,
  'ATIVO',
  NOW(),
  NOW()
)
RETURNING id, nome_empresarial, email, situacao;

-- Nesta sessão o cliente já aparece.
-- Noutra sessão (isolamento READ COMMITTED) ainda NÃO aparece.

COMMIT;

-- Depois do COMMIT qualquer sessão vê o registo.
SELECT id, nome_empresarial, email
FROM clientes
WHERE email = 'tutorial.ex1@finance.local';
