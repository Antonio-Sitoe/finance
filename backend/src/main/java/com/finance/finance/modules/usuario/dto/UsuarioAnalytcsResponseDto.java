package com.finance.finance.modules.usuario.dto;

import lombok.Builder;

@Builder
public record UsuarioAnalytcsResponseDto(
    Long totalUsuarios,
    Long totalAtivos,
    Long totalInativos,
    Long totalAdministradores) {
}
