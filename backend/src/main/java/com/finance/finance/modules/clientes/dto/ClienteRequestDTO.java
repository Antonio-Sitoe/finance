package com.finance.finance.modules.clientes.dto;

import com.finance.finance.modules.common.enums.Situacao;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "ClienteRequest", description = "Payload para criação e atualização de clientes via grupos de validação")
public class ClienteRequestDTO {

    @NotNull(groups = Update.class, message = "ID é obrigatório para atualização")
    @Schema(description = "ID do cliente. Obrigatório apenas na atualização.", example = "25")
    private Long id;

    @NotBlank(groups = { Create.class, Update.class }, message = "O nome empresarial é obrigatório")
    @Schema(description = "Nome empresarial do cliente", example = "Roberto Mugaia")
    private String nomeEmpresarial;

    @NotBlank(groups = Create.class, message = "O email é obrigatório")
    @Email(groups = { Create.class, Update.class }, message = "Email inválido")
    @Schema(description = "Email do cliente", example = "roberto@gmail.com")
    private String email;

    @NotBlank(groups = { Create.class, Update.class }, message = "O telefone é obrigatório")
    @Schema(description = "Telefone do cliente", example = "+258841234567")
    private String telefone;

    @NotBlank(groups = { Create.class, Update.class }, message = "O endereço é obrigatório")
    @Schema(description = "Endereço do cliente", example = "Av. Julius Nyerere")
    private String endereco;

    @NotBlank(groups = { Create.class, Update.class }, message = "O número é obrigatório")
    @Schema(description = "Número da residência ou edifício", example = "10")
    private String numero;

    @NotBlank(groups = { Create.class, Update.class }, message = "O complemento é obrigatório")
    @Schema(description = "Complemento do endereço", example = "2º andar")
    private String complemento;

    @NotBlank(groups = { Create.class, Update.class }, message = "A cidade é obrigatória")
    @Schema(description = "Cidade do cliente", example = "Maputo Cidade")
    private String cidade;

    @NotBlank(groups = { Create.class, Update.class }, message = "O estado é obrigatório")
    @Size(max = 10, message = "O estado deve ter no máximo 10 caracteres")
    @Schema(description = "Estado ou província", example = "MPT")
    private String estado;

    @NotNull(groups = Create.class, message = "A nota é obrigatória")
    @Positive(groups = { Create.class, Update.class }, message = "A nota deve ser um número positivo")
    @Schema(description = "Nota de avaliação do cliente", example = "10")
    private Integer nota;

    @NotNull(groups = Create.class, message = "A situação é obrigatória")
    @Schema(description = "Situação atual do cliente", example = "ATIVO")
    private Situacao situacao;

    public interface Create {
    }

    public interface Update {
    }
}
