package com.finance.finance.modules.fornecedor.dto;

import com.finance.finance.modules.common.enums.Situacao;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FornecedorRequestDTO {

    @NotBlank(message = "Nome empresarial é obrigatório")
    private String nomeEmpresarial;

    @Email(message = "Email inválido")
    private String email;

    @Size(max = 15, message = "Telefone deve ter no máximo 15 caracteres")
    private String telefone;

    private String website;

    @NotBlank(message = "Endereço é obrigatório")
    private String endereco;

    @NotBlank(message = "Número é obrigatório")
    private String numero;

    private String complemento;

    @NotBlank(message = "Bairro é obrigatório")
    private String bairro;

    @NotBlank(message = "Cidade é obrigatória")
    private String cidade;

    @NotBlank(message = "Estado é obrigatório")
    @Size(min = 2, max = 2, message = "Estado deve conter 2 caracteres")
    private String estado;

    @Min(value = 0, message = "Nota mínima é 0")
    @Max(value = 10, message = "Nota máxima é 10")
    private Integer nota;

    @NotNull(message = "Situação é obrigatória")
    private Situacao situacao;
}