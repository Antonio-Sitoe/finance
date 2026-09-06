WITH meses AS (
    SELECT generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
    )::date AS mes
),
pagamentos_categoria AS (
    SELECT
        date_trunc('month', l.data_lancamento)::date AS mes,
        COALESCE(c.nome, 'Sem categoria') AS categoria,
        SUM(l.valor) AS valor
    FROM lancamentos l
    LEFT JOIN categoria c
        ON c.id = l.id_categoria
    WHERE l.tipo = 'DESPESA'
      AND l.situacao = 'PAGO'
      AND l.id_fornecedor IS NOT NULL
      AND l.data_lancamento >= date_trunc('month', CURRENT_DATE)
                                - INTERVAL '11 months'
      AND l.data_lancamento < date_trunc('month', CURRENT_DATE)
                               + INTERVAL '1 month'
    GROUP BY
        date_trunc('month', l.data_lancamento),
        c.id,
        c.nome
),
categorias_rankeadas AS (
    SELECT
        mes,
        categoria,
        valor,
        ROW_NUMBER() OVER (
            PARTITION BY mes
            ORDER BY valor DESC
        ) AS posicao
    FROM pagamentos_categoria
),
totais_mensais AS (
    SELECT
        mes,
        SUM(valor) AS total_pago
    FROM pagamentos_categoria
    GROUP BY mes
),
top_categorias AS (
    SELECT
        mes,
        jsonb_agg(
            jsonb_build_object(
                'categoria', categoria,
                'valor', valor
            )
            ORDER BY posicao
        ) AS top_3_categorias
    FROM categorias_rankeadas
    WHERE posicao <= 3
    GROUP BY mes
)
SELECT
    to_char(m.mes, 'YYYY-MM') AS mes,
    COALESCE(tm.total_pago, 0) AS total_pago,
    COALESCE(tc.top_3_categorias, '[]'::jsonb) AS top_3_categorias
FROM meses m
LEFT JOIN totais_mensais tm ON tm.mes = m.mes
LEFT JOIN top_categorias tc ON tc.mes = m.mes
ORDER BY m.mes;









