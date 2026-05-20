package com.finance.finance.modules.conta.dto;

import java.time.LocalDateTime;

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
@Schema(name = "ContaResponse", description = "Dados retornados de uma conta")
public class ContaResponseDTO {

    @Schema(description = "ID da conta", example = "1")
    private Long id;

    @Schema(description = "Nome identificador da conta", example = "Conta Principal BCI")
    private String nome;

    @Schema(description = "Número da agência bancária", example = "0001")
    private String agencia;

    @Schema(description = "Número da conta corrente", example = "123456-7")
    private String contaCorrente;

    @Schema(description = "Observações sobre a conta", example = "Conta usada para pagamentos de fornecedores")
    private String observacao;

    @Schema(description = "Data de inclusão da conta")
    private LocalDateTime dataInclusao;

    @Schema(description = "Situação da conta", example = "ATIVO")
    private Situacao situacao;
}
