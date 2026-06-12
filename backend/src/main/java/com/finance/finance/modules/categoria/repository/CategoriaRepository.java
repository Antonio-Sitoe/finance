package com.finance.finance.modules.categoria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.finance.finance.modules.categoria.dto.CategoriaResumoDTO;
import com.finance.finance.modules.categoria.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long>, JpaSpecificationExecutor<Categoria> {

    boolean existsByNomeAndCategoriaPaiIsNull(String nome);

    boolean existsByNomeAndCategoriaPaiId(String nome, Long categoriaPaiId);

    boolean existsByNomeAndCategoriaPaiIsNullAndIdNot(String nome, Long id);

    boolean existsByNomeAndCategoriaPaiIdAndIdNot(String nome, Long categoriaPaiId, Long id);

    @Query("""
                SELECT new com.finance.finance.modules.categoria.dto.CategoriaResumoDTO(
                    COUNT(ct),
                    COALESCE(SUM(CASE WHEN ct.debito = true THEN 1 ELSE 0 END), 0),
                    COALESCE(SUM(CASE WHEN ct.credito = true THEN 1 ELSE 0 END), 0),
                    COALESCE(SUM(CASE WHEN ct.situacao = com.finance.finance.modules.common.enums.Situacao.INATIVO THEN 1 ELSE 0 END), 0)
                )
                FROM Categoria ct
            """)
    CategoriaResumoDTO getResumo();

}
