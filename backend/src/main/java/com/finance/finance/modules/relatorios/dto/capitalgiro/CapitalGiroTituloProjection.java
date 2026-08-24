package com.finance.finance.modules.relatorios.dto.capitalgiro;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface CapitalGiroTituloProjection {
    Long getId();

    String getNome();

    LocalDate getVencimento();

    BigDecimal getValor();
}
