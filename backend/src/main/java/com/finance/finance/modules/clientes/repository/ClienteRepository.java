package com.finance.finance.modules.clientes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.finance.modules.clientes.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

}
