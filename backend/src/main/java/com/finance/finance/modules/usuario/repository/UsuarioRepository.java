package com.finance.finance.modules.usuario.repository;

import com.finance.finance.modules.usuario.dto.UsuarioAnalytcsResponseDto;
import com.finance.finance.modules.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>, JpaSpecificationExecutor<Usuario> {
    boolean existsByEmail(String email);

    Usuario findByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    long countByRoleId(Long roleId);

    @Query("""
            SELECT u FROM Usuario u
            JOIN FETCH u.role
            WHERE u.id = :id
            """)
    java.util.Optional<Usuario> findByIdWithRole(@Param("id") Long id);

    @Query("""
            SELECT COUNT(u) FROM Usuario u
            WHERE u.role.sistema = true AND u.situacao = com.finance.finance.modules.common.enums.Situacao.ATIVO
            """)
    long countActiveAdmins();

    @Query("""
            SELECT COUNT(u) FROM Usuario u
            WHERE u.role.sistema = true
              AND u.situacao = com.finance.finance.modules.common.enums.Situacao.ATIVO
              AND u.id <> :excludeId
            """)
    long countActiveAdminsExcluding(@Param("excludeId") Long excludeId);

    @Query(value = """
            SELECT
                COUNT(*) AS totalUsuarios,
                COUNT(CASE WHEN u.situacao = 'ATIVO' THEN 1 END) AS totalAtivos,
                COUNT(CASE WHEN u.situacao = 'INATIVO' THEN 1 END) AS totalInativos,
                COUNT(CASE WHEN r.sistema = TRUE THEN 1 END) AS totalAdministradores
            FROM usuario u
            LEFT JOIN role r ON r.id = u.role_id
            """, nativeQuery = true)
    UsuarioAnalytcsResponseDto fetchUsuarioAnalytics();
}
