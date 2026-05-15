package com.finance.finance.modules.auth.dto;

import com.finance.finance.modules.common.enums.Perfil;
import com.finance.finance.modules.common.enums.Situacao;
import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Schema(name = "UsuarioResponse", description = "Representação de um usuário na API")
public class UsuarioResponseDTO {
    @Schema(description = "ID do usuário", example = "1")
    private Long id;
    @Schema(description = "Nome do usuário", example = "João Silva")
    private String nome;
    @Schema(description = "Email do usuário", example = "joao@email.com")
    private String email;
    @Schema(description = "Perfil do usuário", example = "ADMIN")
    private Perfil perfil;
    @Schema(description = "Situação do usuário", example = "ATIVO")
    private Situacao situacao;
    @Schema(description = "Data e hora de criação", example = "2026-05-15T10:00:00")
    private LocalDateTime createdAt;
}
