package com.finance.finance.modules.roles.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.finance.finance.modules.roles.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    @Query("""
            SELECT r FROM Role r
            LEFT JOIN FETCH r.permissoes
            WHERE r.id = :id
            """)
    Optional<Role> findByIdWithPermissoes(Long id);

    @Query("SELECT r FROM Role r ORDER BY r.nome ASC")
    List<Role> findAllOrdered();
}
