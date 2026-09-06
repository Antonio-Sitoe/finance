SELECT
    f.nome_empresarial AS fornecedor,
    SUM(l.valor) AS total
FROM
    lancamentos l
    LEFT JOIN fornecedor f ON f.id = l.id_fornecedor
WHERE
    f.nome_empresarial IS NOT NULL
GROUP BY
    f.nome_empresarial
ORDER BY
    total DESC;
