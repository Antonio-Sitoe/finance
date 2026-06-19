package com.finance.finance.modules.relatorios.dto.dashboard;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record DashboardDTO(
        BigDecimal totalReceitasMes,
        BigDecimal totalDespesasMes,
        BigDecimal saldoAtual,
        BigDecimal resultadoMes,
        BigDecimal contasAPagar,
        BigDecimal contasAReceber) {
}
