package com.finance.finance.modules.fornecedor.dto;

import com.finance.finance.modules.common.enums.Situacao;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FornecedorRequestDTO {

    @NotBlank(groups = Create.class, message = "Nome empresarial é obrigatório")
    private String nomeEmpresarial;

    @Email(groups = { Create.class, Update.class }, message = "Email inválido")
    private String email;

    @Size(max = 15, message = "Telefone deve ter no máximo 15 caracteres")
    private String telefone;

    private String website;

    @NotBlank(groups = Create.class, message = "Endereço é obrigatório")
    private String endereco;

    @NotBlank(groups = Create.class, message = "Número é obrigatório")
    private String numero;

    private String complemento;

    @NotBlank(groups = Create.class, message = "Bairro é obrigatório")
    private String bairro;

    @NotBlank(groups = Create.class, message = "Cidade é obrigatória")
    private String cidade;

    @NotBlank(groups = Create.class, message = "Estado é obrigatório")
    @Size(min = 2, max = 2, groups = { Create.class, Update.class }, message = "Estado deve conter 2 caracteres")
    private String estado;

    @Min(value = 0, message = "Nota mínima é 0")
    @Max(value = 10, message = "Nota máxima é 10")
    private Integer nota;

    @NotNull(groups = Create.class, message = "Situação é obrigatória")
    private Situacao situacao;

    public interface Create {}

    public interface Update {}
}
