
SELECT
   COUNT(l.parcela) AS parcelas,
   l.id_cliente,
   SUM(l.valor) as valor
FROM lancamentos l
WHERE l.tipo = 'RECEITA' and l.situacao ='PENDENTE' AND l.data_vencimento > CURRENT_DATE and l.id_cliente is not null
GROUP BY l.id_cliente




SELECT
    l.id,
    l.id_cliente AS cliente_id,
    c.nome_empresarial AS cliente,
    l.descricao,
    l.valor AS valor_parcela,
    l.data_vencimento,
    CURRENT_DATE - l.data_vencimento AS dias,
    l.situacao,
    l.tipo
FROM lancamentos l
INNER JOIN clientes c
    ON c.id = l.id_cliente
WHERE
    l.tipo = 'RECEITA'
    AND l.situacao = 'PENDENTE'
    AND l.data_vencimento > CURRENT_DATE
ORDER BY l.data_vencimento ASC;




