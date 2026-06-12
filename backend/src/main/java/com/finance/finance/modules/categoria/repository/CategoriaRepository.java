package com.finance.finance.modules.categoria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.finance.finance.modules.categoria.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long>, JpaSpecificationExecutor<Categoria> {

    boolean existsByNomeAndCategoriaPaiIsNull(String nome);

    boolean existsByNomeAndCategoriaPaiId(String nome, Long categoriaPaiId);

    boolean existsByNomeAndCategoriaPaiIsNullAndIdNot(String nome, Long id);

    boolean existsByNomeAndCategoriaPaiIdAndIdNot(String nome, Long categoriaPaiId, Long id);
}
