package com.finance.finance.modules.Lancamento.repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import com.finance.finance.modules.Lancamento.model.Lancamento;

import jakarta.persistence.QueryHint;

public interface LancamentoRepository extends JpaRepository<Lancamento, Long>, JpaSpecificationExecutor<Lancamento> {

        @Override
        @EntityGraph(attributePaths = { "conta", "categoria", "cliente", "fornecedor" })
        Page<Lancamento> findAll(Specification<Lancamento> spec, Pageable pageable);

        @EntityGraph(attributePaths = { "conta", "categoria", "cliente", "fornecedor" })
        @Query("SELECT l FROM Lancamento l WHERE l.id = :id")
        Optional<Lancamento> findDetailedById(@Param("id") Long id);

        @QueryHints(value = {
                        @QueryHint(name = "org.hibernate.fetchSize", value = "500"),
                        @QueryHint(name = "org.hibernate.readOnly", value = "true")
        })
        @Query("SELECT l FROM Lancamento l "
                        + "LEFT JOIN FETCH l.conta "
                        + "LEFT JOIN FETCH l.categoria "
                        + "LEFT JOIN FETCH l.cliente "
                        + "LEFT JOIN FETCH l.fornecedor "
                        + "ORDER BY l.dataVencimento ASC")
        Stream<Lancamento> streamAll();

        @Query(value = """
                        SELECT
                          COUNT(*) AS total,
                          COALESCE(SUM(CASE WHEN tipo = 'RECEITA' THEN valor ELSE 0 END), 0) AS receita,
                          COALESCE(SUM(CASE WHEN tipo = 'DESPESA' THEN valor ELSE 0 END), 0) AS despesa
                        FROM lancamentos
                        """, nativeQuery = true)
        LancamentoResumoProjection resumir();

        @Query(value = """
                SELECT COALESCE(SUM(CASE WHEN tipo = 'RECEITA' THEN valor ELSE -valor END), 0)
                FROM lancamentos
                WHERE id_conta = :contaId AND situacao = 'PAGO'
                """, nativeQuery = true)
        BigDecimal calcularSaldoPorConta(@Param("contaId") Long contaId);
}
