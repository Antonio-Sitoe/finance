package com.finance.finance.modules.relatorios.dto;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record RelatorioCategoriaDto(
        Long id,
        String nome,
        BigDecimal total) {
}
