package com.finance.finance.modules.categoria.dto;

import com.finance.finance.modules.common.enums.Situacao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoriaRequestDTO {

    @NotBlank(groups = Create.class, message = "Nome é obrigatório")
    private String nome;

    private Boolean debito;

    private Boolean credito;

    private Long categoriaPaiId;

    private String descricao;

    @NotNull(groups = Create.class, message = "Situação é obrigatória")
    private Situacao situacao;

    public interface Create {}

    public interface Update {}
}
