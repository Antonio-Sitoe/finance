package com.finance.finance.modules.relatorios.dto.fluxo;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface FluxoDiarioDiaProjection {
    LocalDate getDia();

    BigDecimal getEntradas();

    BigDecimal getSaidas();

    BigDecimal getSaldoDia();

    BigDecimal getSaldoAcumulado();
}
