package com.finance.finance.modules.relatorios.dto.dashboard;

import lombok.Builder;
import java.math.BigDecimal;

@Builder
public record DashboardReceitaDispesas(String mes, BigDecimal receitas, BigDecimal despesas) {
}
