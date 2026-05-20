package com.finance.finance.modules.conta.dto;

import com.finance.finance.modules.common.enums.Situacao;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(name = "ContaRequest", description = "Payload para criação e atualização de contas via grupos de validação")
public class ContaRequestDTO {

    @NotBlank(groups = Create.class, message = "Nome é obrigatório")
    @Schema(description = "Nome identificador da conta", example = "Conta Principal BCI")
    private String nome;

    @NotBlank(groups = Create.class, message = "Agência é obrigatória")
    @Schema(description = "Número da agência bancária", example = "0001")
    private String agencia;

    @NotBlank(groups = Create.class, message = "Conta corrente é obrigatória")
    @Schema(description = "Número da conta corrente", example = "123456-7")
    private String contaCorrente;

    @NotBlank(groups = Create.class, message = "Observação é obrigatória")
    @Schema(description = "Observações sobre a conta", example = "Conta usada para pagamentos de fornecedores")
    private String observacao;

    @NotNull(groups = Create.class, message = "Situação é obrigatória")
    @Schema(description = "Situação da conta", example = "ATIVO")
    private Situacao situacao;

    public interface Create {
    }

    public interface Update {
    }
}
