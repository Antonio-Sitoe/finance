package com.finance.finance.modules.relatorios.dto.dashboard;

import java.math.BigDecimal;

public interface DashboardDTOProjection {

    BigDecimal getTotalReceitasMes();

    BigDecimal getTotalDespesasMes();

    BigDecimal getSaldoAtual();

    BigDecimal getResultadoMes();

    BigDecimal getContasAPagar();

    BigDecimal getContasAReceber();
}
