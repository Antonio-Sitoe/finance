package com.finance.finance.modules.fornecedor.dto;

import com.finance.finance.modules.common.enums.Situacao;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Schema(name = "FornecedorRequest", description = "Payload para criação e atualização de fornecedores via grupos de validação")
public class FornecedorRequestDTO {

    @NotBlank(groups = Create.class, message = "Nome empresarial é obrigatório")
    @Schema(description = "Nome empresarial do fornecedor", example = "Tech Supplies Lda")
    private String nomeEmpresarial;

    @Email(groups = { Create.class, Update.class }, message = "Email inválido")
    @Schema(description = "Email do fornecedor", example = "contacto@techsupplies.co.mz")
    private String email;

    @Size(max = 15, message = "Telefone deve ter no máximo 15 caracteres")
    @Schema(description = "Telefone do fornecedor", example = "+258841234567")
    private String telefone;

    @Schema(description = "Website do fornecedor", example = "https://techsupplies.co.mz")
    private String website;

    @NotBlank(groups = Create.class, message = "Endereço é obrigatório")
    @Schema(description = "Endereço do fornecedor", example = "Av. Julius Nyerere")
    private String endereco;

    @NotBlank(groups = Create.class, message = "Número é obrigatório")
    @Schema(description = "Número da porta", example = "123")
    private String numero;

    @Schema(description = "Complemento do endereço", example = "Sala 4")
    private String complemento;

    @NotBlank(groups = Create.class, message = "Bairro é obrigatório")
    @Schema(description = "Bairro do fornecedor", example = "Sommerschield")
    private String bairro;

    @NotBlank(groups = Create.class, message = "Cidade é obrigatória")
    @Schema(description = "Cidade do fornecedor", example = "Maputo")
    private String cidade;

    @NotBlank(groups = Create.class, message = "Estado é obrigatório")
    @Size(min = 2, max = 2, groups = { Create.class, Update.class }, message = "Estado deve conter 2 caracteres")
    @Schema(description = "Estado/Provincia (2 caracteres)", example = "MZ")
    private String estado;

    @Min(value = 0, message = "Nota mínima é 0")
    @Max(value = 10, message = "Nota máxima é 10")
    @Schema(description = "Nota de avaliação do fornecedor (0-10)", example = "8")
    private Integer nota;

    @NotNull(groups = Create.class, message = "Situação é obrigatória")
    @Schema(description = "Situação do fornecedor", example = "ATIVO")
    private Situacao situacao;

    public interface Create {
    }

    public interface Update {
    }
}
