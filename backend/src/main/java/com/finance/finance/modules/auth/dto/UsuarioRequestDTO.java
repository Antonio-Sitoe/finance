package com.finance.finance.modules.auth.dto;

import com.finance.finance.modules.common.enums.Perfil;
import com.finance.finance.modules.common.enums.Situacao;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(name = "UsuarioRequest", description = "Payload para criação e atualização de usuários")
public class UsuarioRequestDTO {
    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres")
    @Schema(description = "Nome completo do usuário", example = "João Silva")
    private String nome;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    @Schema(description = "Email do usuário", example = "joao@email.com")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, max = 255, message = "A senha deve ter entre 6 e 255 caracteres")
    @Schema(description = "Senha do usuário", example = "123456")
    private String senha;

    @NotNull(message = "O perfil é obrigatório")
    @Schema(description = "Perfil do usuário", example = "ADMIN")
    private Perfil perfil;

    @NotNull(message = "A situação é obrigatória")
    @Schema(description = "Situação do usuário", example = "ATIVO")
    private Situacao situacao;
}
