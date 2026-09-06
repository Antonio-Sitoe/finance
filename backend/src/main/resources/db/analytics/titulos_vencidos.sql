-- Títulos vencidos (UI: linhas + TOTAL; spec: id cliente, parcela, vencimento, soma por cliente)
-- Regra do domínio: PENDENTE + RECEITA + vencimento < hoje + tem cliente
SELECT
    l.id_cliente,
    cl.nome_empresarial,
    COUNT(*) AS qtd_parcelas_vencidas,
    MIN(l.data_vencimento::date) AS primeiro_vencimento,
    SUM(l.valor) AS total_por_cliente
FROM lancamentos l
INNER JOIN clientes cl ON cl.id = l.id_cliente
WHERE l.situacao = 'PENDENTE'
  AND l.tipo = 'RECEITA'
  AND l.data_vencimento::date < CURRENT_DATE
GROUP BY l.id_cliente, cl.nome_empresarial
ORDER BY total_por_cliente DESC;
