package com.finance.finance.modules.relatorios.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.finance.modules.Lancamento.model.Lancamento;
import com.finance.finance.modules.common.dto.BasicLabelValueDTO;
import com.finance.finance.modules.relatorios.dto.search.LancamentoSearchItemDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioAnualProjecaoDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioCategoriaDto;
import com.finance.finance.modules.relatorios.dto.RelatorioMensalDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioPorCategoria;
import com.finance.finance.modules.relatorios.dto.RelatorioSituacaoDTO;
import com.finance.finance.modules.relatorios.dto.dashboard.DashboardAlertProjection;
import com.finance.finance.modules.relatorios.dto.dashboard.DashboardDTOProjection;
import com.finance.finance.modules.relatorios.dto.dashboard.DashboardReceitaDispesasProjection;

public interface RelatoriosRepository extends JpaRepository<Lancamento, Long>, JpaSpecificationExecutor<Lancamento> {
  @Query(value = """
          SELECT
              CAST(EXTRACT(YEAR FROM l.data_lancamento) AS INTEGER) AS ano,
              CAST(EXTRACT(MONTH FROM l.data_lancamento) AS INTEGER) AS mes,
              COUNT(l.id) AS totalLancamentos,
              SUM(CASE WHEN l.tipo = 'RECEITA' THEN l.valor ELSE 0 END) AS somaReceitas,
              SUM(CASE WHEN l.tipo = 'DESPESA' THEN l.valor ELSE 0 END) AS somaDespesas,
              SUM(CASE WHEN l.tipo = 'RECEITA' THEN l.valor ELSE -l.valor END) AS saldoMes
          FROM lancamentos l
          GROUP BY EXTRACT(YEAR FROM l.data_lancamento), EXTRACT(MONTH FROM l.data_lancamento)
          ORDER BY ano, mes
      """, nativeQuery = true)
  List<RelatorioMensalDTO> realizarRelatorioMensal();

  @Query(value = """
          SELECT
              CAST(EXTRACT(YEAR FROM l.data_lancamento) AS INTEGER) AS ano,
              COUNT(l.id) AS totalAnual,
              SUM(CASE
                      WHEN l.tipo = 'RECEITA' THEN l.valor
                      ELSE -l.valor
                  END) AS saldoTotalAnual
          FROM lancamentos l
          WHERE EXTRACT(YEAR FROM l.data_lancamento) = EXTRACT(YEAR FROM CURRENT_DATE)
          GROUP BY EXTRACT(YEAR FROM l.data_lancamento)
      """, nativeQuery = true)
  RelatorioAnualProjecaoDTO realizarRelatorioAnual();

  @Query(value = """
              SELECT
                  l.situacao AS status,
                  COUNT(l.id) AS quantidade,
                  SUM(l.valor) AS somaValor,
                  ROUND(
                      (
                          SUM(l.valor) * 100.0
                      ) / SUM(SUM(l.valor)) OVER (),
                      2
                  ) AS percentual
              FROM lancamentos l
              GROUP BY l.situacao
      """, nativeQuery = true)
  List<RelatorioSituacaoDTO> realizarRelatorioPercentual();

  @Query(value = """
      SELECT
          l.id_categoria as categoriaId,
          cat.nome,
          COUNT(l.id) as totalLancamento,
          SUM(l.valor) as valor
      FROM lancamentos l
        LEFT JOIN categoria cat on cat.id = l.id_categoria
      GROUP BY l.id_categoria, cat.nome
                  """, nativeQuery = true)
  List<RelatorioPorCategoria> realizarRelatorioCategoria();

  @Query("""
      SELECT COALESCE(SUM(l.valor), 0)
      FROM Lancamento l
      WHERE l.tipo = com.finance.finance.modules.common.enums.TipoLancamento.RECEITA
        AND year(l.dataLancamento) = year(local date)
        AND month(l.dataLancamento) = month(local date)
      """)
  BigDecimal totalReceitasMes();

  @Query("""
      SELECT COALESCE(SUM(l.valor), 0)
      FROM Lancamento l
      WHERE l.tipo = com.finance.finance.modules.common.enums.TipoLancamento.DESPESA
        AND year(l.dataLancamento) = year(local date)
        AND month(l.dataLancamento) = month(local date)
      """)
  BigDecimal totalDespesasMes();

  @Query("""
      SELECT COALESCE(SUM(
          CASE WHEN l.tipo = com.finance.finance.modules.common.enums.TipoLancamento.RECEITA
               THEN l.valor ELSE -l.valor END
      ), 0)
      FROM Lancamento l
      WHERE l.situacao = com.finance.finance.modules.common.enums.PagamentoEnum.PAGO
      """)
  BigDecimal saldoAtual();

  @Query("""
      SELECT COALESCE(SUM(l.valor), 0)
      FROM Lancamento l
      WHERE l.tipo = com.finance.finance.modules.common.enums.TipoLancamento.DESPESA
        AND l.situacao = com.finance.finance.modules.common.enums.PagamentoEnum.PENDENTE
      """)
  BigDecimal contasAPagar();

  @Query("""
      SELECT COALESCE(SUM(l.valor), 0)
      FROM Lancamento l
      WHERE l.tipo = com.finance.finance.modules.common.enums.TipoLancamento.RECEITA
        AND l.situacao = com.finance.finance.modules.common.enums.PagamentoEnum.PENDENTE
      """)
  BigDecimal contasAReceber();

  @Query("""
      SELECT new com.finance.finance.modules.relatorios.dto.search.LancamentoSearchItemDTO(
          l.id,
          l.descricao,
          coalesce(c.nomeEmpresarial, f.nomeEmpresarial),
          l.valor,
          l.dataLancamento,
          l.dataVencimento,
          l.situacao,
          l.tipo
      )
      FROM Lancamento l
      LEFT JOIN l.cliente c
      LEFT JOIN l.fornecedor f
      WHERE lower(l.descricao) LIKE lower(concat('%', :q, '%'))
         OR lower(coalesce(c.nomeEmpresarial, '')) LIKE lower(concat('%', :q, '%'))
         OR lower(coalesce(f.nomeEmpresarial, '')) LIKE lower(concat('%', :q, '%'))
      ORDER BY l.dataLancamento DESC
      """)
  List<LancamentoSearchItemDTO> searchGlobal(@Param("q") String q, Pageable pageable);

  @Query(value = """
      SELECT
        COALESCE(SUM(valor) FILTER (
          WHERE tipo = 'RECEITA'
            AND situacao = 'PAGO'
            AND data_lancamento >= date_trunc('month', CURRENT_DATE)
            AND data_lancamento < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
        ), 0) AS total_receitas_mes,

        COALESCE(SUM(valor) FILTER (
          WHERE tipo = 'DESPESA'
            AND situacao = 'PAGO'
            AND data_lancamento >= date_trunc('month', CURRENT_DATE)
            AND data_lancamento < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
        ), 0) AS total_despesas_mes,

        COALESCE(
          SUM(CASE WHEN tipo = 'RECEITA' THEN valor ELSE -valor END)
          FILTER (WHERE situacao = 'PAGO'),
          0
        ) AS saldo_atual,

        COALESCE(
          SUM(CASE WHEN tipo = 'RECEITA' THEN valor ELSE -valor END)
          FILTER (
            WHERE situacao = 'PAGO'
              AND data_lancamento >= date_trunc('month', CURRENT_DATE)
              AND data_lancamento < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
          ),
          0
        ) AS resultado_mes,

        COALESCE(SUM(valor) FILTER (
          WHERE tipo = 'DESPESA'
            AND situacao = 'PENDENTE'
        ), 0) AS contas_a_pagar,

        COALESCE(SUM(valor) FILTER (
          WHERE tipo = 'RECEITA'
            AND situacao = 'PENDENTE'
        ), 0) AS contas_a_receber

      FROM lancamentos
      """, nativeQuery = true)
  DashboardDTOProjection resumo();

  @Query(value = """
      WITH meses AS (
         SELECT generate_series(
           DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months',
           DATE_TRUNC('month', CURRENT_DATE),
           INTERVAL '1 month'
         ) AS mes
       )
       SELECT
         TO_CHAR(m.mes, 'YYYY-MM') AS mes,
         COALESCE(
           SUM(
             CASE
               WHEN l.tipo = 'RECEITA' THEN l.valor
             END
           ),
           0
         ) AS receitas,
         COALESCE(
           SUM(
             CASE
               WHEN l.tipo = 'DESPESA' THEN l.valor
             END
           ),
           0
         ) AS despesas
       FROM meses m
       LEFT JOIN lancamentos l
       ON DATE_TRUNC('month', l.data_lancamento) = m.mes
       GROUP BY m.mes
       ORDER BY m.mes;
       """, nativeQuery = true)
  List<DashboardReceitaDispesasProjection> obterReceitaVsDespesas();

  @Query(value = """
          SELECT

            COALESCE(
              SUM(l.valor) FILTER (
                WHERE l.situacao = 'PENDENTE'
                  AND l.tipo = 'RECEITA'
                  AND l.data_vencimento < CURRENT_DATE
              ), 0
            ) AS receitasVencidas,

            COALESCE(
              SUM(l.valor) FILTER (
                WHERE l.situacao = 'PENDENTE'
                  AND l.tipo = 'DESPESA'
                  AND l.data_vencimento < CURRENT_DATE
              ), 0
            ) AS despesasVencidas,

            COALESCE(
              COUNT(*) FILTER (
                WHERE l.situacao = 'PENDENTE'
                  AND l.data_vencimento = CURRENT_DATE
              ), 0
            ) AS qtdLancamentosVencemHoje

          FROM lancamentos l
      """, nativeQuery = true)
  DashboardAlertProjection obterAlertas();

  @Query(value = """
      SELECT c.
          nome as label,
          COALESCE(sum(l.valor),0) as Value FROM lancamentos l
      LEFT JOIN contas c ON c.id = l.id_conta
      GROUP BY c.nome
      ORDER BY Value
      LIMIT 3
      """, nativeQuery = true)
  List<BasicLabelValueDTO<BigDecimal>> obterEstatisticasPorContas();

  @Query("""
      SELECT new com.finance.finance.modules.relatorios.dto.RelatorioCategoriaDto(
          c.id,
          c.nome,
          SUM(l.valor)
      )
      FROM Lancamento l
      JOIN l.categoria c
      WHERE c.debito = true
      GROUP BY c.id, c.nome
      ORDER BY SUM(l.valor) DESC
      """)
  List<RelatorioCategoriaDto> buscarTop3();

}
