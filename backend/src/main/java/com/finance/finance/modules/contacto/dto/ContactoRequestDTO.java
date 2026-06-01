package com.finance.finance.modules.contacto.dto;

import com.finance.finance.modules.common.enums.Situacao;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ContactoRequestDTO {

    @NotBlank(groups = Create.class, message = "O nome é obrigatório")
    private String nome;

    private String departamento;

    @NotBlank(groups = Create.class, message = "O email é obrigatório")
    @Email(groups = { Create.class, Update.class }, message = "O email deve ser válido")
    private String email;

    @NotBlank(groups = Create.class, message = "O telefone é obrigatório")
    private String telefone;

    @NotNull(groups = Create.class, message = "A situação é obrigatória")
    private Situacao situacao;

    @NotNull(groups = Create.class, message = "O ID do cliente é obrigatório")
    private Long clienteId;

    public interface Create {}

    public interface Update {}
}
