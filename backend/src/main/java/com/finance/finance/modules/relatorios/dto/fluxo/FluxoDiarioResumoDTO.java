package com.finance.finance.modules.relatorios.dto.fluxo;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record FluxoDiarioResumoDTO(
        BigDecimal saldoInicial,
        BigDecimal totalEntradas,
        BigDecimal totalSaidas,
        BigDecimal saldoFinal) {
}
