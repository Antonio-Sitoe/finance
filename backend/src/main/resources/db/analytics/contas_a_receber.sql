SELECT
  c.id AS cliente_id,
  c.nome_empresarial AS cliente,
  l.descricao,
  l.valor AS valor_pendente,
  l.data_vencimento::date AS data_vencimento,
  (CURRENT_DATE - l.data_vencimento::date) AS dias_atraso
FROM lancamentos l
INNER JOIN clientes c ON c.id = l.id_cliente
WHERE l.tipo = 'RECEITA'
  AND l.situacao = 'PENDENTE'
ORDER BY l.data_vencimento ASC;