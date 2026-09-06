SELECT
    c.id AS cliente_id,
    c.nome_empresarial AS cliente,
    COUNT(l.id) AS parcelas_vencidas,
    SUM(l.valor) AS valor_total_vencido,
    MIN(l.data_vencimento) AS vencimento_mais_antigo
FROM lancamentos l
INNER JOIN clientes c
    ON c.id = l.id_cliente
WHERE
    l.tipo = 'RECEITA'
    AND l.situacao = 'PENDENTE'
    AND l.data_vencimento < CURRENT_DATE
GROUP BY
    c.id,
    c.nome_empresarial
HAVING COUNT(l.id) > 1
ORDER BY
    valor_total_vencido DESC;







