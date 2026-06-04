package com.finance.finance.modules.clientes.dto;

import com.finance.finance.modules.common.enums.Situacao;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ClienteRequestDTO {
    @NotBlank(groups = { Create.class, Update.class }, message = "O nome empresarial é obrigatório")
    private String nomeEmpresarial;

    @NotBlank(groups = Create.class, message = "O email é obrigatório")
    @Email(groups = { Create.class, Update.class }, message = "Email inválido")
    private String email;

    @NotBlank(groups = { Create.class, Update.class }, message = "O telefone é obrigatório")
    private String telefone;

    @NotBlank(groups = { Create.class, Update.class }, message = "O endereço é obrigatório")
    private String endereco;

    @NotBlank(groups = { Create.class, Update.class }, message = "O número é obrigatório")
    private String numero;

    @NotBlank(groups = { Create.class, Update.class }, message = "O complemento é obrigatório")
    private String complemento;

    @NotBlank(groups = { Create.class, Update.class }, message = "A cidade é obrigatória")
    private String cidade;

    @NotBlank(groups = { Create.class, Update.class }, message = "O estado é obrigatório")
    @Size(max = 10, message = "O estado deve ter no máximo 10 caracteres")
    private String estado;

    @NotNull(groups = Create.class, message = "A nota é obrigatória")
    @Positive(groups = { Create.class, Update.class }, message = "A nota deve ser um número positivo")
    private Integer nota;

    @NotNull(groups = Create.class, message = "A situação é obrigatória")
    private Situacao situacao;

    public interface Create {
    }

    public interface Update {
    }
}
