package com.finance.finance.modules.categoria.dto;

import com.finance.finance.modules.common.enums.Situacao;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "CategoriaResponse", description = "Dados retornados de uma categoria")
public class CategoriaResponseDTO {

    @Schema(description = "ID da categoria", example = "1")
    private Long id;

    @Schema(description = "Nome da categoria", example = "Receitas Operacionais")
    private String nome;

    @Schema(description = "Indica se a categoria é de débito (saída)", example = "false")
    private Boolean debito;

    @Schema(description = "Indica se a categoria é de crédito (entrada)", example = "true")
    private Boolean credito;

    @Schema(description = "ID da categoria pai", example = "1")
    private Long categoriaPaiId;

    @Schema(description = "Nome da categoria pai", example = "Receitas")
    private String categoriaPaiNome;

    @Schema(description = "Descrição detalhada da categoria", example = "Receitas provenientes da actividade principal")
    private String descricao;

    @Schema(description = "Situação da categoria", example = "ATIVO")
    private Situacao situacao;
}
