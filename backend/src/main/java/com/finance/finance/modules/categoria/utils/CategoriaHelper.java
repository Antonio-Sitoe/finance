package com.finance.finance.modules.categoria.utils;

import org.springframework.stereotype.Component;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import com.finance.finance.modules.categoria.model.Categoria;
import com.finance.finance.modules.categoria.repository.CategoriaRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CategoriaHelper {

    private final CategoriaRepository categoriaRepository;

    public Categoria resolverCategoriaPai(Long categoriaPaiId) {
        if (categoriaPaiId == null) {
            return null;
        }
        return categoriaRepository.findById(categoriaPaiId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria pai não encontrada com id: " + categoriaPaiId));
    }

    public void validarNomeUnico(String nome, Long categoriaPaiId, Long idExcluir) {
        boolean existe;
        if (idExcluir == null) {
            existe = categoriaPaiId == null
                    ? categoriaRepository.existsByNomeAndCategoriaPaiIsNull(nome)
                    : categoriaRepository.existsByNomeAndCategoriaPaiId(nome, categoriaPaiId);
        } else {
            existe = categoriaPaiId == null
                    ? categoriaRepository.existsByNomeAndCategoriaPaiIsNullAndIdNot(nome, idExcluir)
                    : categoriaRepository.existsByNomeAndCategoriaPaiIdAndIdNot(nome, categoriaPaiId, idExcluir);
        }
        if (existe) {
            throw new BusinessException("Já existe uma categoria com este nome neste nível");
        }
    }
}
