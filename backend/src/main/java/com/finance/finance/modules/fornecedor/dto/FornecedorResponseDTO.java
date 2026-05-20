package com.finance.finance.modules.fornecedor.dto;

import com.finance.finance.modules.common.enums.Situacao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "FornecedorResponse", description = "Dados retornados de um fornecedor")
public class FornecedorResponseDTO {

    @Schema(description = "ID do fornecedor", example = "1")
    private Long id;

    @Schema(description = "Nome empresarial", example = "Tech Supplies Lda")
    private String nomeEmpresarial;

    @Schema(description = "Email", example = "contacto@techsupplies.co.mz")
    private String email;

    @Schema(description = "Telefone", example = "+258841234567")
    private String telefone;

    @Schema(description = "Website", example = "https://techsupplies.co.mz")
    private String website;

    @Schema(description = "Endereço", example = "Av. Julius Nyerere")
    private String endereco;

    @Schema(description = "Número da porta", example = "123")
    private String numero;

    @Schema(description = "Complemento", example = "Sala 4")
    private String complemento;

    @Schema(description = "Bairro", example = "Sommerschield")
    private String bairro;

    @Schema(description = "Cidade", example = "Maputo")
    private String cidade;

    @Schema(description = "Estado/Provincia", example = "MZ")
    private String estado;

    @Schema(description = "Nota de avaliação (0-10)", example = "8")
    private Integer nota;

    @Schema(description = "Situação do fornecedor", example = "ATIVO")
    private Situacao situacao;
}
