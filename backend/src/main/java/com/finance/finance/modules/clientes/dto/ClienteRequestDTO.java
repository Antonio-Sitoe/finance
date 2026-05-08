package com.finance.finance.modules.clientes.dto;

import com.finance.finance.modules.common.enums.Situacao;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ClienteRequestDTO {

    @NotBlank(message = "O nome empresarial é obrigatório")
    private String nomeEmpresarial;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "O telefone é obrigatório")
    private String telefone;

    private String cep;

    private String endereco;

    private String numero;

    private String complemento;

    @NotBlank(message = "A cidade é obrigatória")
    private String cidade;

    @NotBlank(message = "O estado é obrigatório")
    @Size(max = 10, message = "O estado deve ter no máximo 10 caracteres")
    private String estado;

    @Positive(message = "A nota deve ser um número positivo")
    private Integer nota;

    @NotNull(message = "A situação é obrigatória")
    private Situacao situacao;
}