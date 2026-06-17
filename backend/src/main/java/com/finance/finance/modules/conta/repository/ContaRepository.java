package com.finance.finance.modules.conta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.finance.finance.modules.conta.model.Conta;

public interface ContaRepository extends JpaRepository<Conta, Long>, JpaSpecificationExecutor<Conta> {
    boolean existsByContaCorrente(String contaCorrente);

    boolean existsByContaCorrenteAndIdNot(String contaCorrente, Long id);
}
