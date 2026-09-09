-- Ex. 3 — Transferência entre contas (atómica)
-- Corre STATEMENT A STATEMENT (não o ficheiro inteiro).
--
-- Modelo finance: não há coluna saldo em contas.
-- Transferir 150.00 da conta 1 → conta 2 =
--   1 DESPESA (sai da origem) + 1 RECEITA (entra no destino)
--
-- Ajusta id_conta / id_categoria se precisares.

-- 0) Ver contas
SELECT id, nome, situacao FROM contas WHERE situacao = 'ATIVO' ORDER BY id;

-- 1) Abrir transação
BEGIN;

-- 2) Sai da origem (DESPESA)
INSERT INTO lancamentos (
  descricao, parcela, total_parcela, valor,
  data_lancamento, data_vencimento,
  situacao, tipo,
  id_conta, id_categoria, id_cliente, id_fornecedor,
  created_at, updated_at
) VALUES (
  '[TX] Transferência 1→2',
  1, 1, 150.00,
  NOW(), NOW(),
  'PAGO', 'DESPESA',
  1,   -- origem
  3,   -- categoria existente
  NULL, NULL,
  NOW(), NOW()
)
RETURNING id, tipo, valor, id_conta;

-- 3) Entra no destino (RECEITA) — mesmo valor / descrição base
INSERT INTO lancamentos (
  descricao, parcela, total_parcela, valor,
  data_lancamento, data_vencimento,
  situacao, tipo,
  id_conta, id_categoria, id_cliente, id_fornecedor,
  created_at, updated_at
) VALUES (
  '[TX] Transferência 1→2',
  1, 1, 150.00,
  NOW(), NOW(),
  'PAGO', 'RECEITA',
  2,   -- destino
  3,
  NULL, NULL,
  NOW(), NOW()
)
RETURNING id, tipo, valor, id_conta;

-- 4a) Sucesso → confirma os dois
COMMIT;

-- 4b) Se o 2.º INSERT falhasse, em vez de COMMIT farías:
-- ROLLBACK;
-- (a DESPESA da origem também desaparecia)

-- 5) Verificar o par
SELECT id, tipo, valor, id_conta, situacao, descricao
FROM lancamentos
WHERE descricao = '[TX] Transferência 1→2'
ORDER BY id;
-- esperado após COMMIT: 2 linhas (DESPESA conta 1 + RECEITA conta 2)
