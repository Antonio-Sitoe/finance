package com.finance.finance.modules.auth.dto;

public record UsuarioAnalytcsResponseDto(
    Long totalUsuarios,
    Long totalAtivos,
    Long totalInativos,
    Long totalAdministradores) {
}
