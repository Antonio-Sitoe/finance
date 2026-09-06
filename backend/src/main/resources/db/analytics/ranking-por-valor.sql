
SELECT
    f.id AS fornecedor_id,
    f.nome_empresarial AS fornecedor,
    SUM(l.valor) AS total_pendente,
    COUNT(l.id) AS quantidade_lancamentos
FROM lancamentos l
INNER JOIN fornecedor f
    ON f.id = l.id_fornecedor
WHERE l.tipo = 'DESPESA'
  AND l.situacao = 'PENDENTE'
GROUP BY
    f.id,
    f.nome_empresarial
ORDER BY
    total_pendente DESC;
