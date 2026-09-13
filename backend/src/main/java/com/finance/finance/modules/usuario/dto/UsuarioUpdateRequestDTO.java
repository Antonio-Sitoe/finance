package com.finance.finance.modules.usuario.dto;

import com.finance.finance.modules.common.enums.Situacao;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioUpdateRequestDTO {
    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres")
    private String nome;
    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
    @Size(min = 6, max = 255, message = "A senha deve ter entre 6 e 255 caracteres")
    private String senha;
    @NotNull(message = "A role é obrigatória")
    private Long roleId;
    @NotNull(message = "A situação é obrigatória")
    private Situacao situacao;
}
