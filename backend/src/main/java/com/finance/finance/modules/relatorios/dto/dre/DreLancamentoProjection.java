package com.finance.finance.modules.relatorios.dto.dre;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface DreLancamentoProjection {
    Long getId();

    String getDescricao();

    String getConta();

    Long getCategoriaId();

    BigDecimal getValor();

    String getTipo();

    LocalDate getData();
}
