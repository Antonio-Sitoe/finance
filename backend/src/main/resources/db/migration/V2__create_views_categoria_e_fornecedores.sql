-- V2: Views de consolidação financeira e classificação de fornecedores

CREATE OR REPLACE VIEW vw_lancamentos_por_categoria AS
SELECT
    c.nome AS nome_categoria,
    COUNT(l.id) AS quantidade_lancamentos,
    COALESCE(SUM(l.valor), 0) AS soma_total
FROM categoria c
LEFT JOIN lancamentos l
    ON l.id_categoria = c.id
GROUP BY
    c.id,
    c.nome;

CREATE OR REPLACE VIEW vw_fornecedores_confiaveis AS
SELECT
    f.id,
    f.nome_empresarial AS nome,
    f.nota,
    CASE
        WHEN f.nota >= 4 THEN 'excelente'
        WHEN f.nota >= 3 THEN 'bom'
        ELSE 'ruim'
    END AS tipo
FROM fornecedor f;
