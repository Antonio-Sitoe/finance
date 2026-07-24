package com.finance.finance.modules.relatorios.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.finance.finance.modules.Lancamento.model.Lancamento;
import com.finance.finance.modules.relatorios.dto.dre.DreCategoriaProjection;
import com.finance.finance.modules.relatorios.dto.dre.DreLancamentoProjection;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDiaProjection;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioLancamentoProjection;

public interface CashFlowRepository extends JpaRepository<Lancamento, Long>, JpaSpecificationExecutor<Lancamento> {
    @Query(value = """
            WITH dias AS (
              SELECT generate_series(
                CAST(:de AS date),
                CAST(:ate AS date),
                INTERVAL '1 day'
              )::date AS dia
            ),
            movimentos AS (
              SELECT
                CAST(l.data_lancamento AS date) AS dia,
                COALESCE(SUM(l.valor) FILTER (WHERE l.tipo = 'RECEITA'), 0) AS entradas,
                COALESCE(SUM(l.valor) FILTER (WHERE l.tipo = 'DESPESA'), 0) AS saidas
              FROM lancamentos l
              WHERE l.situacao = 'PAGO'
                AND CAST(l.data_lancamento AS date) >= CAST(:de AS date)
                AND CAST(l.data_lancamento AS date) <= CAST(:ate AS date)
              GROUP BY CAST(l.data_lancamento AS date)
            ),
            saldo_inicial AS (
              SELECT COALESCE(SUM(
                CASE WHEN l.tipo = 'RECEITA' THEN l.valor ELSE -l.valor END
              ), 0) AS valor
              FROM lancamentos l
              WHERE l.situacao = 'PAGO'
                AND l.data_lancamento < CAST(:de AS timestamp)
            ),
            diario AS (
              SELECT
                d.dia,
                COALESCE(m.entradas, 0) AS entradas,
                COALESCE(m.saidas, 0) AS saidas,
                COALESCE(m.entradas, 0) - COALESCE(m.saidas, 0) AS saldo_dia
              FROM dias d
              LEFT JOIN movimentos m ON m.dia = d.dia
            )
            SELECT
              diario.dia AS dia,
              diario.entradas AS entradas,
              diario.saidas AS saidas,
              diario.saldo_dia AS saldoDia,
              (SELECT valor FROM saldo_inicial)
                + SUM(diario.saldo_dia) OVER (ORDER BY diario.dia) AS saldoAcumulado
            FROM diario
            ORDER BY diario.dia
            """, nativeQuery = true)
    List<FluxoDiarioDiaProjection> obterFluxoDiario(
            @Param("de") LocalDate de,
            @Param("ate") LocalDate ate);

    @Query(value = """
            SELECT
              l.id AS id,
              l.descricao AS descricao,
              COALESCE(co.nome, '—') AS conta,
              COALESCE(ca.nome, '—') AS categoria,
              l.valor AS valor,
              l.tipo AS tipo,
              l.situacao AS situacao,
              CAST(l.data_lancamento AS date) AS dia
            FROM lancamentos l
            LEFT JOIN contas co ON co.id = l.id_conta
            LEFT JOIN categoria ca ON ca.id = l.id_categoria
            WHERE l.situacao = 'PAGO'
              AND CAST(l.data_lancamento AS date) >= CAST(:de AS date)
              AND CAST(l.data_lancamento AS date) <= CAST(:ate AS date)
            ORDER BY l.data_lancamento ASC
            """, nativeQuery = true)
    List<FluxoDiarioLancamentoProjection> obterLancamentosFluxoDiario(
            @Param("de") LocalDate de,
            @Param("ate") LocalDate ate);

    @Query(value = """
            SELECT COALESCE(SUM(
              CASE WHEN l.tipo = 'RECEITA' THEN l.valor ELSE -l.valor END
            ), 0)
            FROM lancamentos l
            WHERE l.situacao = 'PAGO'
              AND l.data_lancamento < CAST(:de AS timestamp)
            """, nativeQuery = true)
    BigDecimal obterSaldoInicialFluxo(@Param("de") LocalDate de);

    @Query(value = """
            SELECT
              cat.id AS categoriaId,
              COALESCE(cat.nome, 'Sem categoria') AS nome,
              l.tipo AS tipo,
              SUM(l.valor) AS total
            FROM lancamentos l
            LEFT JOIN categoria cat ON cat.id = l.id_categoria
            WHERE l.situacao = 'PAGO'
              AND CAST(l.data_lancamento AS date) >= CAST(:de AS date)
              AND CAST(l.data_lancamento AS date) <= CAST(:ate AS date)
            GROUP BY cat.id, cat.nome, l.tipo
            ORDER BY total DESC
            """, nativeQuery = true)
    List<DreCategoriaProjection> obterDreCategorias(
            @Param("de") LocalDate de,
            @Param("ate") LocalDate ate);

    @Query(value = """
            SELECT
              l.id AS id,
              l.descricao AS descricao,
              COALESCE(co.nome, '—') AS conta,
              l.id_categoria AS categoriaId,
              l.valor AS valor,
              l.tipo AS tipo,
              CAST(l.data_lancamento AS date) AS data
            FROM lancamentos l
            LEFT JOIN contas co ON co.id = l.id_conta
            WHERE l.situacao = 'PAGO'
              AND CAST(l.data_lancamento AS date) >= CAST(:de AS date)
              AND CAST(l.data_lancamento AS date) <= CAST(:ate AS date)
            ORDER BY l.data_lancamento ASC
            """, nativeQuery = true)
    List<DreLancamentoProjection> obterDreLancamentos(
            @Param("de") LocalDate de,
            @Param("ate") LocalDate ate);
}
