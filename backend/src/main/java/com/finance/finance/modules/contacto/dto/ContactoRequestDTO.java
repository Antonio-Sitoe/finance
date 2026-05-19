package com.finance.finance.modules.contacto.dto;

import com.finance.finance.modules.common.enums.Situacao;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(name = "ContactoRequest", description = "Payload para criação e atualização de contactos via grupos de validação")
public class ContactoRequestDTO {

    @NotBlank(groups = Create.class, message = "O nome é obrigatório")
    @Schema(description = "Nome do contacto", example = "João Silva")
    private String nome;

    @Schema(description = "Departamento do contacto", example = "TI")
    private String departamento;

    @NotBlank(groups = Create.class, message = "O email é obrigatório")
    @Email(groups = { Create.class, Update.class }, message = "O email deve ser válido")
    @Schema(description = "Email do contacto", example = "joao.silva@empresa.com")
    private String email;

    @NotBlank(groups = Create.class, message = "O telefone é obrigatório")
    @Schema(description = "Telefone do contacto", example = "+258841234567")
    private String telefone;

    @NotNull(groups = Create.class, message = "A situação é obrigatória")
    @Schema(description = "Situação do contacto", example = "ATIVO")
    private Situacao situacao;

    @NotNull(groups = Create.class, message = "O ID do cliente é obrigatório")
    @Schema(description = "ID do cliente ao qual o contacto pertence", example = "1")
    private Long clienteId;

    public interface Create {
    }

    public interface Update {
    }
}
