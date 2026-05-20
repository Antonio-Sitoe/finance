package com.finance.finance.modules.categoria.mapper;

import java.util.Optional;

import com.finance.finance.modules.categoria.dto.CategoriaRequestDTO;
import com.finance.finance.modules.categoria.dto.CategoriaResponseDTO;
import com.finance.finance.modules.categoria.model.Categoria;
import com.finance.finance.modules.common.enums.Situacao;

public class CategoriaMapper {

    private CategoriaMapper() {
    }

    public static Categoria toEntity(CategoriaRequestDTO dto, Categoria categoriaPai) {
        if (dto == null) {
            return null;
        }

        Categoria categoria = new Categoria();
        categoria.setNome(dto.getNome());
        categoria.setDebito(dto.getDebito());
        categoria.setCredito(dto.getCredito());
        categoria.setDescricao(dto.getDescricao());
        categoria.setCategoriaPai(categoriaPai);
        categoria.setSituacao(dto.getSituacao() != null ? dto.getSituacao() : Situacao.ATIVO);

        return categoria;
    }

    public static CategoriaResponseDTO toResponse(Categoria categoria) {
        if (categoria == null) {
            return null;
        }

        return CategoriaResponseDTO.builder()
                .id(categoria.getId())
                .nome(categoria.getNome())
                .debito(categoria.getDebito())
                .credito(categoria.getCredito())
                .categoriaPaiId(categoria.getCategoriaPai() != null ? categoria.getCategoriaPai().getId() : null)
                .categoriaPaiNome(categoria.getCategoriaPai() != null ? categoria.getCategoriaPai().getNome() : null)
                .descricao(categoria.getDescricao())
                .situacao(categoria.getSituacao())
                .build();
    }

    public static void updateEntity(Categoria categoria, CategoriaRequestDTO dto, Categoria categoriaPai) {
        Optional.ofNullable(dto.getNome()).ifPresent(categoria::setNome);
        Optional.ofNullable(dto.getDebito()).ifPresent(categoria::setDebito);
        Optional.ofNullable(dto.getCredito()).ifPresent(categoria::setCredito);
        Optional.ofNullable(dto.getDescricao()).ifPresent(categoria::setDescricao);
        Optional.ofNullable(dto.getSituacao()).ifPresent(categoria::setSituacao);
        if (dto.getCategoriaPaiId() != null) {
            categoria.setCategoriaPai(categoriaPai);
        }
    }
}
