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

    @Query(value = """
                SELECT
                    COUNT(ct.id) as total,
                    SUM(CASE WHEN ct.debito = true THEN 1 ELSE 0 END) as totalDebito,
                    SUM(CASE WHEN ct.credito = true THEN 1 ELSE 0 END) as totalCredito,
                    SUM(CASE WHEN ct.situacao = 'INATIVO' THEN 1 ELSE 0 END) as totalInativos
                FROM categoria ct
            """, nativeQuery = true)
    CategoriaResumoDTO getResumo();

}
