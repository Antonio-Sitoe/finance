package com.finance.finance.modules.relatorios.dto.fluxo;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface FluxoDiarioLancamentoProjection {
    Long getId();

    String getDescricao();

    String getConta();

    String getCategoria();

    BigDecimal getValor();

    String getTipo();

    String getSituacao();

    LocalDate getDia();
}
