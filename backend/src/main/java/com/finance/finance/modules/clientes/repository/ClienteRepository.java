package com.finance.finance.modules.clientes.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.relatorios.dto.GlobalSearchResponseDTO;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query("""
            SELECT new com.finance.finance.modules.relatorios.dto.GlobalSearchResponseDTO(
                c.id, 'CLIENTE', c.nomeEmpresarial, c.email, concat('/clientes/', cast(c.id as String))
            )
            FROM Cliente c
            WHERE lower(c.nomeEmpresarial) LIKE lower(concat('%', :q, '%'))
            ORDER BY c.nomeEmpresarial
            LIMIT 5
            """)
    List<GlobalSearchResponseDTO> findByIdAndNomeEmpresarial(@Param("q") String q);

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