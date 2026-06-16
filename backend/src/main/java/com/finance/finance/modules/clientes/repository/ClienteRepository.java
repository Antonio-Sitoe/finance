package com.finance.finance.modules.clientes.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.clientes.dto.ClienteRankingResumoDTO;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.relatorios.dto.search.ClienteSearchItemDTO;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query("""
            SELECT new com.finance.finance.modules.relatorios.dto.search.ClienteSearchItemDTO(
                c.id, c.nomeEmpresarial, c.email, c.nota, c.situacao
            )
            FROM Cliente c
            WHERE lower(c.nomeEmpresarial) LIKE lower(concat('%', :q, '%'))
               OR lower(c.email) LIKE lower(concat('%', :q, '%'))
            ORDER BY c.nomeEmpresarial
            """)
    List<ClienteSearchItemDTO> searchGlobal(@Param("q") String q, Pageable pageable);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    Optional<Cliente> findByNomeEmpresarial(String nomeEmpresarial);

    Optional<Cliente> findByIdAndNomeEmpresarial(Long id, String nomeEmpresarial);

    Page<Cliente> findByNomeEmpresarialContainingIgnoreCase(String nomeEmpresarial, Pageable pageable);

    List<Cliente> findBySituacao(Situacao situacao);

    Page<Cliente> findBySituacao(Situacao situacao, Pageable pageable);

    Page<Cliente> findByNomeEmpresarialContainingIgnoreCaseAndSituacao(
            String nomeEmpresarial,
            Situacao situacao,
            Pageable pageable);

    @Query("""
            SELECT new com.finance.finance.modules.clientes.dto.ClienteRankingResumoDTO(
                COUNT(c.id),
                COUNT(CASE WHEN c.nota BETWEEN 0 AND 5 THEN 1 END),
                COUNT(CASE WHEN c.nota BETWEEN 6 AND 8 THEN 1 END),
                COUNT(CASE WHEN c.nota BETWEEN 9 AND 10 THEN 1 END)
            )
            FROM Cliente c
            """)
    ClienteRankingResumoDTO obterResumoRanking();

}