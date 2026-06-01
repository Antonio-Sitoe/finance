package com.finance.finance.modules.categoria.dto;

import com.finance.finance.modules.common.enums.Situacao;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaResponseDTO {

    private Long id;
    private String nome;
    private Boolean debito;
    private Boolean credito;
    private Long categoriaPaiId;
    private String categoriaPaiNome;
    private String descricao;
    private Situacao situacao;
}
