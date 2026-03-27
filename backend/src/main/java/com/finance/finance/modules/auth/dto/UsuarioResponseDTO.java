package com.finance.finance.modules.auth.dto;

import com.finance.finance.modules.common.enums.Perfil;
import com.finance.finance.modules.common.enums.Situacao;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private Perfil perfil;
    private Situacao situacao;
    private LocalDateTime createdAt;
}
