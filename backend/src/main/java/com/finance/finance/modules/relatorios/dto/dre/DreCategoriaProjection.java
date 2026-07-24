package com.finance.finance.modules.relatorios.dto.dre;

import java.math.BigDecimal;

public interface DreCategoriaProjection {
    Long getCategoriaId();

    String getNome();

    String getTipo();

    BigDecimal getTotal();
}
