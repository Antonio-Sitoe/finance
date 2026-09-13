package com.finance.finance.modules.roles.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.finance.finance.modules.roles.model.Permissao;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {

    Optional<Permissao> findByCodigo(String codigo);

    List<Permissao> findAllByOrderByModuloAscAcaoAsc();

    @Query("""
            SELECT p.codigo FROM Role r
            JOIN r.permissoes p
            WHERE r.id = :roleId
            """)
    List<String> findCodigosByRoleId(Long roleId);
}