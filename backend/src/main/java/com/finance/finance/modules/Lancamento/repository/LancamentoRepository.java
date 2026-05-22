package com.finance.finance.modules.Lancamento.repository;

import java.util.stream.Stream;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import com.finance.finance.modules.Lancamento.model.Lancamento;

import jakarta.persistence.QueryHint;

@Repository
public interface LancamentoRepository extends JpaRepository<Lancamento, Long>, JpaSpecificationExecutor<Lancamento> {

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
}