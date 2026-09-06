package com.finance.finance.modules.relatorios.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteClassificacaoNotaProjection;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteFaturamentoProjection;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteFaturamentoResumoProjection;

public interface ClienteReportRepository extends JpaRepository<Cliente, Long> {
  long countBySituacao(Situacao situacao);

  Long countByNota(Integer nota);

  Long countByEmailIsNull();

  Long countByTelefoneIsNull();

  @Query(value = """
      SELECT COUNT(*)
      FROM clientes c
      WHERE c.email IS NULL OR c.telefone IS NULL
      """, nativeQuery = true)
  Long countClientesComDadosIncompletos();

  @Query(value = """
      WITH clientes_classificados AS (
          SELECT
              c.id,
              CASE
                  WHEN c.nota BETWEEN 0 AND 3 THEN 'NORMAL'
                  WHEN c.nota BETWEEN 4 AND 5 THEN 'MASTER'
                  WHEN c.nota BETWEEN 6 AND 10 THEN 'VIP'
              END AS classification
          FROM clientes c
      )
      SELECT
          cc.classification AS classification,
          COUNT(DISTINCT cc.id) AS quantidadeClientes,
          COALESCE(SUM(l.valor), 0) AS recebiveisPendentes
      FROM clientes_classificados cc
      LEFT JOIN lancamentos l
          ON l.id_cliente = cc.id
          AND l.tipo = 'RECEITA'
          AND l.situacao = 'PENDENTE'
      WHERE cc.classification IS NOT NULL
      GROUP BY cc.classification
      ORDER BY
          CASE cc.classification
              WHEN 'NORMAL' THEN 1
              WHEN 'MASTER' THEN 2
              WHEN 'VIP' THEN 3
          END
      """, nativeQuery = true)
  List<ClienteClassificacaoNotaProjection> classificarPorNota();

  @Query(value = """
      SELECT COUNT(*) AS quantidade_clientes
      FROM (
          SELECT
              c.cliente_id
          FROM contactos c
          GROUP BY c.cliente_id
          HAVING COUNT(c.id) > 1
      ) clientes_com_multiplos_contactos
      """, nativeQuery = true)
  Long countClientesComMultiplosContactos();

  @Query(value = """
      SELECT
          l.id_cliente AS idCliente,
          cl.nome_empresarial AS nomeEmpresarial,
          COALESCE(SUM(l.valor) FILTER (WHERE l.tipo = 'RECEITA'), 0) AS faturado,
          COALESCE(SUM(l.valor) FILTER (
              WHERE l.tipo = 'RECEITA' AND l.situacao = 'PAGO'
          ), 0) AS recebido,
          COALESCE(SUM(l.valor) FILTER (
              WHERE l.tipo = 'RECEITA' AND l.situacao = 'PENDENTE'
          ), 0) AS emAberto,
          CASE
              WHEN COALESCE(SUM(l.valor) FILTER (WHERE l.tipo = 'RECEITA'), 0) = 0 THEN 0
              ELSE ROUND(
                  (
                      COALESCE(SUM(l.valor) FILTER (
                          WHERE l.tipo = 'RECEITA' AND l.situacao = 'PAGO'
                      ), 0)
                      / COALESCE(SUM(l.valor) FILTER (WHERE l.tipo = 'RECEITA'), 0)
                  ) * 100,
                  2
              )
          END AS percentagemRecebido,
          MIN(CAST(l.data_vencimento AS date) - CURRENT_DATE)
              FILTER (WHERE l.tipo = 'RECEITA' AND l.situacao = 'PENDENTE') AS prazoQueFaltaDias
      FROM lancamentos l
      LEFT JOIN clientes cl
          ON cl.id = l.id_cliente
      WHERE l.id_cliente IS NOT NULL
        AND l.tipo = 'RECEITA'
        AND (CAST(:de AS date) IS NULL OR CAST(l.data_lancamento AS date) >= CAST(:de AS date))
        AND (CAST(:ate AS date) IS NULL OR CAST(l.data_lancamento AS date) <= CAST(:ate AS date))
      GROUP BY
          l.id_cliente,
          cl.nome_empresarial
      ORDER BY faturado DESC
      """, nativeQuery = true)
  List<ClienteFaturamentoProjection> faturamentoPorCliente(
      @Param("de") LocalDate de,
      @Param("ate") LocalDate ate);

  @Query(value = """
      SELECT
          COALESCE(SUM(l.valor) FILTER (
              WHERE l.tipo = 'RECEITA'
          ), 0) AS totalFaturado,
          COALESCE(SUM(l.valor) FILTER (
              WHERE l.tipo = 'RECEITA'
              AND l.situacao = 'PAGO'
          ), 0) AS totalRecebido,
          COALESCE(SUM(l.valor) FILTER (
              WHERE l.tipo = 'RECEITA'
              AND l.situacao = 'PENDENTE'
          ), 0) AS totalEmAberto,
          COUNT(*) FILTER (
              WHERE l.tipo = 'RECEITA'
              AND l.situacao = 'PENDENTE'
          ) AS quantidadeFaturasPendentes
      FROM lancamentos l
      WHERE l.id_cliente IS NOT NULL
        AND (CAST(:de AS date) IS NULL OR CAST(l.data_lancamento AS date) >= CAST(:de AS date))
        AND (CAST(:ate AS date) IS NULL OR CAST(l.data_lancamento AS date) <= CAST(:ate AS date))
      """, nativeQuery = true)
  ClienteFaturamentoResumoProjection faturamentoResumo(
      @Param("de") LocalDate de,
      @Param("ate") LocalDate ate);
}
