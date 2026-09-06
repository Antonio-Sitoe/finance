SELECT
    l.id,
    l.id_fornecedor AS fornecedor_id,
    f.nome_empresarial AS fornecedor,
    l.descricao,
    l.valor AS valor_a_pagar,
    l.data_vencimento,
    CASE
        WHEN l.data_vencimento < CURRENT_DATE THEN 'DANGER'
        WHEN l.data_vencimento = CURRENT_DATE THEN 'WARNING'
        ELSE 'NORMAL'
    END AS classification
FROM lancamentos l
INNER JOIN fornecedor f
    ON f.id = l.id_fornecedor
WHERE 
    l.situacao = 'PENDENTE'
    AND l.tipo = 'DESPESA'
ORDER BY l.data_vencimento ASC;