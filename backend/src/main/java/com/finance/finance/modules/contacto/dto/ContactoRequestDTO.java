package com.finance.finance.modules.contacto.dto;

import com.finance.finance.modules.common.enums.Situacao;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactoRequestDTO {

    @Schema(description = "Nome do candidato", example = "John Doe")
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @Schema(description = "Departamento do candidato", example = "TI")
    @NotBlank(message = "O departamento é obrigatório")
    private String departamento;

    @Schema(description = "Email do candidato", example = "john.doe@example.com")
    @NotBlank(message = "O email é obrigatório")
    @Email(message = "O email deve ser válido")
    private String email;

    @Schema(description = "Telefone do candidato", example = "11999999999")
    @NotBlank(message = "O telefone é obrigatório")
    private String telefone;

    @Schema(description = "Situacao do contato", example = "ATIVO")
    @NotNull(message = "A situação é obrigatória")
    private Situacao situacao;

    @Schema(description = "ID do cliente", example = "12345")
    @NotNull(message = "O ID do cliente é obrigatório")
    private Long clienteId;
}
