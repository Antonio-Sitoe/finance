package com.finance.finance.modules.usuario.dto;

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
    private Long roleId;
    private String roleCodigo;
    private String roleNome;
    private Situacao situacao;
    private LocalDateTime createdAt;
}
