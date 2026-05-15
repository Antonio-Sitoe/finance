package com.finance.finance.modules.clientes.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.common.enums.Situacao;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    Optional<Cliente> findByNomeEmpresarial(String nomeEmpresarial);

    Optional<Cliente> findByIdAndNomeEmpresarial(Long id, String nomeEmpresarial);

    Page<Cliente> findByNomeEmpresarialContainingIgnoreCase(String nomeEmpresarial, Pageable pageable);

    Page<Cliente> findBySituacao(Situacao situacao, Pageable pageable);

    Page<Cliente> findByNomeEmpresarialContainingIgnoreCaseAndSituacao(
            String nomeEmpresarial,
            Situacao situacao,
            Pageable pageable);

}