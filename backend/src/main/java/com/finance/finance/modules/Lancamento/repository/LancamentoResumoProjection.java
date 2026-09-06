package com.finance.finance.modules.Lancamento.repository;

import java.math.BigDecimal;

public interface LancamentoResumoProjection {
    Long getTotal();

    BigDecimal getReceita();

    BigDecimal getDespesa();
}
