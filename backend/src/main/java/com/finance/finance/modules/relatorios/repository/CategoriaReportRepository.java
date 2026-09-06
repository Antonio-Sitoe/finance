package com.finance.finance.modules.relatorios.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.finance.finance.modules.categoria.model.Categoria;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaHierarquiaProjection;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaMediaProjection;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaMovimentacaoProjection;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaPagoPendenteProjection;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaResumoFinanceiroProjection;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaValorTotalProjection;
import com.finance.finance.modules.relatorios.dto.categoria.SemCategoriaLancamentoProjection;
import com.finance.finance.modules.relatorios.dto.categoria.SemCategoriaPorContaProjection;

public interface CategoriaReportRepository extends JpaRepository<Categoria, Long> {

  @Query(value = """
      SELECT
          l.id_categoria AS idCategoria,
          COALESCE(cat.nome, 'Sem Categoria') AS nomeCategoria,
          SUM(l.valor) AS valorTotal
      FROM lancamentos l
      LEFT JOIN categoria cat
          ON cat.id = l.id_categoria
      WHERE l.tipo = 'DESPESA'
        AND UPPER(l.situacao) = 'PAGO'
      GROUP BY l.id_categoria, cat.nome
      ORDER BY valorTotal DESC
      """, nativeQuery = true)
  List<CategoriaValorTotalProjection> totalDespesasPagasPorCategoria();

  @Query(value = """
      SELECT
          l.id_categoria AS idCategoria,
          COALESCE(cat.nome, 'Sem Categoria') AS nomeCategoria,
          COALESCE(SUM(CASE WHEN l.tipo = 'DESPESA' THEN l.valor ELSE 0 END), 0) AS totalDebito,
          COALESCE(SUM(CASE WHEN l.tipo = 'RECEITA' THEN l.valor ELSE 0 END), 0) AS totalCredito,
          COALESCE(SUM(CASE WHEN l.tipo = 'RECEITA' THEN l.valor ELSE 0 END), 0) -
          COALESCE(SUM(CASE WHEN l.tipo = 'DESPESA' THEN l.valor ELSE 0 END), 0) AS saldo,
          ROUND(
              (
                  COALESCE(SUM(CASE WHEN l.tipo = 'DESPESA' THEN l.valor ELSE 0 END), 0) /
                  NULLIF(SUM(l.valor), 0)
              ) * 100,
              2
          ) AS pctDebito,
          ROUND(
              (
                  COALESCE(SUM(CASE WHEN l.tipo = 'RECEITA' THEN l.valor ELSE 0 END), 0) /
                  NULLIF(SUM(l.valor), 0)
              ) * 100,
              2
          ) AS pctCredito
      FROM lancamentos l
      LEFT JOIN categoria cat
          ON cat.id = l.id_categoria
      WHERE UPPER(l.situacao) = 'PAGO'
      GROUP BY l.id_categoria, cat.nome
      ORDER BY totalDebito DESC
      """, nativeQuery = true)
  List<CategoriaResumoFinanceiroProjection> resumoFinanceiroPorCategoria();

  @Query(value = """
      SELECT
          l.id_categoria AS idCategoria,
          COALESCE(cat.nome, 'Sem Categoria') AS nomeCategoria,
          COUNT(*) AS quantidade,
          COALESCE(SUM(l.valor), 0) AS soma,
          COALESCE(AVG(l.valor), 0) AS media
      FROM lancamentos l
      LEFT JOIN categoria cat ON cat.id = l.id_categoria
      WHERE l.id_categoria IS NOT NULL
      GROUP BY l.id_categoria, cat.nome
      ORDER BY media DESC
      """, nativeQuery = true)
  List<CategoriaMediaProjection> mediaPorCategoria();

  @Query(value = """
      SELECT
          l.id_categoria AS idCategoria,
          COALESCE(cat.nome, 'Sem Categoria') AS nomeCategoria,
          COUNT(*) AS totalMovimentacoes,
          COALESCE(SUM(l.valor), 0) AS somaValores,
          CASE
            WHEN SUM(CASE WHEN l.tipo = 'RECEITA' THEN l.valor ELSE 0 END)
               >= SUM(CASE WHEN l.tipo = 'DESPESA' THEN l.valor ELSE 0 END)
            THEN 'CREDITO'
            ELSE 'DEBITO'
          END AS tipo
      FROM lancamentos l
      LEFT JOIN categoria cat ON cat.id = l.id_categoria
      WHERE l.id_categoria IS NOT NULL
      GROUP BY l.id_categoria, cat.nome
      ORDER BY somaValores DESC
      """, nativeQuery = true)
  List<CategoriaMovimentacaoProjection> movimentacaoPorCategoria();

  @Query(value = """
      WITH valores AS (
        SELECT
          COALESCE(cat.id_pai, cat.id) AS id_pai,
          COALESCE(pai.nome, cat.nome) AS nome_pai,
          cat.id AS id_filha,
          cat.nome AS nome_filha,
          COALESCE(SUM(l.valor), 0) AS valor_filha,
          COUNT(l.id) AS qtd_filha
        FROM lancamentos l
        INNER JOIN categoria cat ON cat.id = l.id_categoria
        LEFT JOIN categoria pai ON pai.id = cat.id_pai
        GROUP BY COALESCE(cat.id_pai, cat.id), COALESCE(pai.nome, cat.nome), cat.id, cat.nome
      )
      SELECT
        v.id_pai AS idPai,
        v.nome_pai AS nomePai,
        v.id_filha AS idFilha,
        v.nome_filha AS nomeFilha,
        v.valor_filha AS valorFilha,
        v.qtd_filha AS qtdFilha,
        SUM(v.valor_filha) OVER (PARTITION BY v.id_pai) AS valorPai,
        SUM(v.qtd_filha) OVER (PARTITION BY v.id_pai) AS qtdPai
      FROM valores v
      ORDER BY valorPai DESC, valorFilha DESC
      """, nativeQuery = true)
  List<CategoriaHierarquiaProjection> hierarquiaPorCategoria();

  @Query(value = """
      SELECT
          l.id_categoria AS idCategoria,
          COALESCE(cat.nome, 'Sem Categoria') AS nomeCategoria,
          COUNT(*) FILTER (WHERE UPPER(l.situacao) = 'PAGO') AS qtdPago,
          COUNT(*) FILTER (WHERE UPPER(l.situacao) = 'PENDENTE') AS qtdPendente,
          COALESCE(SUM(l.valor) FILTER (WHERE UPPER(l.situacao) = 'PAGO'), 0) AS valorPago,
          COALESCE(SUM(l.valor) FILTER (WHERE UPPER(l.situacao) = 'PENDENTE'), 0) AS valorPendente,
          ROUND(
            (COUNT(*) FILTER (WHERE UPPER(l.situacao) = 'PAGO')::numeric
              / NULLIF(COUNT(*), 0)) * 100,
            2
          ) AS pctPago,
          ROUND(
            (COUNT(*) FILTER (WHERE UPPER(l.situacao) = 'PENDENTE')::numeric
              / NULLIF(COUNT(*), 0)) * 100,
            2
          ) AS pctPendente
      FROM lancamentos l
      LEFT JOIN categoria cat ON cat.id = l.id_categoria
      WHERE l.data_vencimento >= date_trunc('quarter', CURRENT_DATE)
        AND l.data_vencimento < date_trunc('quarter', CURRENT_DATE) + INTERVAL '3 months'
        AND l.id_categoria IS NOT NULL
      GROUP BY l.id_categoria, cat.nome
      ORDER BY pctPendente DESC, nomeCategoria
      """, nativeQuery = true)
  List<CategoriaPagoPendenteProjection> pagoVsPendenteUltimoTrimestre();

  @Query(value = """
      SELECT
          l.id_conta AS idConta,
          COALESCE(c.nome, 'Sem conta') AS nomeConta,
          COUNT(*) AS quantidade,
          COALESCE(SUM(l.valor), 0) AS valorTotal,
          MIN(l.data_vencimento) AS primeiroVencimento,
          (
            SELECT l2.descricao
            FROM lancamentos l2
            WHERE l2.id_categoria IS NULL
              AND l2.id_conta IS NOT DISTINCT FROM l.id_conta
            ORDER BY l2.data_vencimento ASC, l2.id ASC
            LIMIT 1
          ) AS primeiraDescricao
      FROM lancamentos l
      LEFT JOIN contas c ON c.id = l.id_conta
      WHERE l.id_categoria IS NULL
      GROUP BY l.id_conta, c.nome
      ORDER BY valorTotal DESC
      """, nativeQuery = true)
  List<SemCategoriaPorContaProjection> semCategoriaPorConta();

  @Query(value = """
      SELECT
          l.id AS id,
          l.descricao AS descricao,
          l.valor AS valor,
          l.data_vencimento AS dataVencimento,
          l.id_conta AS idConta,
          COALESCE(c.nome, 'Sem conta') AS nomeConta,
          l.tipo AS tipo,
          l.situacao AS situacao
      FROM lancamentos l
      LEFT JOIN contas c ON c.id = l.id_conta
      WHERE l.id_categoria IS NULL
      ORDER BY l.data_vencimento DESC, l.id DESC
      """, nativeQuery = true)
  List<SemCategoriaLancamentoProjection> semCategoriaLancamentos();
}
