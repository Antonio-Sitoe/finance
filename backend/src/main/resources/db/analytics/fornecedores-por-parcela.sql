SELECT
    ROUND(AVG(l.total_parcela), 2) AS media_parcelas,
    COUNT(DISTINCT l.id_fornecedor) FILTER (
        WHERE l.total_parcela > 3
    ) AS fornecedores_mais_de_3_parcelas
FROM lancamentos l
WHERE l.id_fornecedor IS NOT NULL;