

SELECT
    c.id AS cliente_id,
    c.nome_empresarial AS cliente,
    COUNT(l.id) AS quantidade_lancamentos,
    SUM(l.valor) AS valor_pendente
FROM lancamentos l
INNER JOIN clientes c
    ON c.id = l.id_cliente
WHERE
    l.tipo = 'RECEITA'
    AND l.situacao = 'PENDENTE'
GROUP BY
    c.id,
    c.nome_empresarial
ORDER BY
    valor_pendente DESC;
