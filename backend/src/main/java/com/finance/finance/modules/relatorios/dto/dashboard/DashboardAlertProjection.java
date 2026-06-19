package com.finance.finance.modules.relatorios.dto.dashboard;

import java.math.BigDecimal;

public interface DashboardAlertProjection {

    BigDecimal getReceitasVencidas();

    BigDecimal getDespesasVencidas();

    Long getQtdLancamentosVencemHoje();

}