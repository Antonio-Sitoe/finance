package com.finance.finance.modules.relatorios.dto.dashboard;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record DashboardAlertDTO(
        BigDecimal receitasVencidas,
        BigDecimal despesasVencidas,
        Long qtdLancamentosVencemHoje) {
}