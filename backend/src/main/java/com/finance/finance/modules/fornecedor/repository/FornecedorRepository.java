package com.finance.finance.modules.fornecedor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.finance.modules.fornecedor.dto.FornecedorResumoProjection;
import com.finance.finance.modules.fornecedor.model.Fornecedor;
import com.finance.finance.modules.relatorios.dto.GlobalSearchResponseDTO;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long>, JpaSpecificationExecutor<Fornecedor> {

    @Query("""
            SELECT new com.finance.finance.modules.relatorios.dto.GlobalSearchResponseDTO(
                f.id, 'FORNECEDOR', f.nomeEmpresarial, f.email, concat('/fornecedores/', cast(f.id as String))
            )
            FROM Fornecedor f
            WHERE lower(f.nomeEmpresarial) LIKE lower(concat('%', :q, '%'))
            ORDER BY f.nomeEmpresarial
            LIMIT 5
            """)
    List<GlobalSearchResponseDTO> findByIdAndNomeEmpresarial(@Param("q") String q);

    @Query(value = """
                SELECT
                    COUNT(*) AS total,
                    SUM(CASE WHEN situacao = 'ATIVO' THEN 1 ELSE 0 END) AS totalAtivos,
                    SUM(CASE WHEN situacao = 'INATIVO' THEN 1 ELSE 0 END) AS totalInativos,
                    SUM(CASE WHEN nota >= 8 THEN 1 ELSE 0 END) AS altaConformidade
                FROM fornecedor
            """, nativeQuery = true)
    FornecedorResumoProjection getResumoFornecedor();

    Optional<Fornecedor> findByEmail(String email);

    Optional<Fornecedor> findByTelefone(String telefone);

    boolean existsByEmail(String email);

    boolean existsByTelefone(String telefone);
}