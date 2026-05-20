package com.finance.finance.modules.categoria.dto;

import com.finance.finance.modules.common.enums.Situacao;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(name = "CategoriaRequest", description = "Payload para criação e atualização de categorias via grupos de validação")
public class CategoriaRequestDTO {

    @NotBlank(groups = Create.class, message = "Nome é obrigatório")
    @Schema(description = "Nome da categoria", example = "Receitas Operacionais")
    private String nome;

    @Schema(description = "Indica se a categoria é de débito (saída)", example = "false")
    private Boolean debito;

    @Schema(description = "Indica se a categoria é de crédito (entrada)", example = "true")
    private Boolean credito;

    @Schema(description = "ID da categoria pai (para subcategorias)", example = "1")
    private Long categoriaPaiId;

    @Schema(description = "Descrição detalhada da categoria", example = "Receitas provenientes da actividade principal")
    private String descricao;

    @NotNull(groups = Create.class, message = "Situação é obrigatória")
    @Schema(description = "Situação da categoria", example = "ATIVO")
    private Situacao situacao;

    public interface Create {
    }

    public interface Update {
    }
}
