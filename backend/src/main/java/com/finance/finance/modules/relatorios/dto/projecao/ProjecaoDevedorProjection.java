package com.finance.finance.modules.relatorios.dto.projecao;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface ProjecaoDevedorProjection {
    Long getId();
    String getNome();
    BigDecimal getValor();
    LocalDate getVencimento();
}
