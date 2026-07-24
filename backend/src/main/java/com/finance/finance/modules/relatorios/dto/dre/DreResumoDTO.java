package com.finance.finance.modules.relatorios.dto.dre;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record DreResumoDTO(
        BigDecimal totalReceitas,
        BigDecimal totalDespesas,
        BigDecimal resultado,
        BigDecimal margemPercentual) {
}
