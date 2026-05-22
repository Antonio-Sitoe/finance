package com.finance.finance.modules.relatorios.dto;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record DashboardDTO(
        BigDecimal totalReceitasMes,
        BigDecimal totalDespesasMes,
        BigDecimal saldoAtual,
        BigDecimal contasAPagar,
        BigDecimal contasAReceber) {
}
