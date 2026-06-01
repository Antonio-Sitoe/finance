package com.finance.finance.modules.conta.dto;

import com.finance.finance.modules.common.enums.Situacao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ContaRequestDTO {

    @NotBlank(groups = Create.class, message = "Nome é obrigatório")
    private String nome;

    @NotBlank(groups = Create.class, message = "Agência é obrigatória")
    private String agencia;

    @NotBlank(groups = Create.class, message = "Conta corrente é obrigatória")
    private String contaCorrente;

    @NotBlank(groups = Create.class, message = "Observação é obrigatória")
    private String observacao;

    @NotNull(groups = Create.class, message = "Situação é obrigatória")
    private Situacao situacao;

    public interface Create {}

    public interface Update {}
}
