package com.finance.finance.modules.auth.dto;

import lombok.Builder;

@Builder
public record UsuarioAnalytcsResponseDto(
    Long totalUsuarios,
    Long totalAtivos,
    Long totalInativos,
    Long totalAdministradores) {
}
