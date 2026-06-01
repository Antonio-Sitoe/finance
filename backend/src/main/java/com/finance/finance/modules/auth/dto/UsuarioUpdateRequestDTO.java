package com.finance.finance.modules.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioUpdateRequestDTO extends UsuarioRequestDTO {

    @Size(min = 6, max = 255, message = "A senha deve ter entre 6 e 255 caracteres")
    private String senha;
}
