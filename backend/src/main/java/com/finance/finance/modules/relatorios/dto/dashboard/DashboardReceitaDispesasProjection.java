package com.finance.finance.modules.relatorios.dto.dashboard;

import java.math.BigDecimal;

public interface DashboardReceitaDispesasProjection {
    String getMes();

    BigDecimal getReceitas();

    BigDecimal getDespesas();
}