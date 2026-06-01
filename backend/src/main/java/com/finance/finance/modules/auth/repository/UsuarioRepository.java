package com.finance.finance.modules.auth.repository;

import com.finance.finance.modules.auth.dto.UsuarioAnalytcsResponseDto;
import com.finance.finance.modules.auth.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>, JpaSpecificationExecutor<Usuario> {
    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    @Query(value = """
            SELECT
                COUNT(*) AS totalUsuarios,
                COUNT(CASE WHEN situacao = 'ATIVO' THEN 1 END) AS totalAtivos,
                COUNT(CASE WHEN situacao = 'INATIVO' THEN 1 END) AS totalInativos,
                COUNT(CASE WHEN perfil = 'ADMIN' THEN 1 END) AS totalAdministradores
            FROM usuario;
            """, nativeQuery = true)
    UsuarioAnalytcsResponseDto fetchUsuarioAnalytics();
}
