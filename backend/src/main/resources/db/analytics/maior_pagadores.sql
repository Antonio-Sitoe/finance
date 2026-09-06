SELECT
    c.id AS cliente_id,
    c.nome_empresarial AS cliente,
    COUNT(l.id) AS parcelas_liquidadas,
    SUM(l.valor) AS valor_total_pago
FROM lancamentos l
INNER JOIN clientes c
    ON c.id = l.id_cliente
WHERE
    l.tipo = 'RECEITA'
    AND l.situacao = 'PAGO'
GROUP BY
    c.id,
    c.nome_empresarial
ORDER BY
    valor_total_pago DESC;