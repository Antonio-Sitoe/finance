package com.finance.finance.modules.Lancamento.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.finance.finance.modules.Lancamento.model.Lancamento;

@Repository
public interface LancamentoRepository extends JpaRepository<Lancamento, Long>, JpaSpecificationExecutor<Lancamento> {
}
