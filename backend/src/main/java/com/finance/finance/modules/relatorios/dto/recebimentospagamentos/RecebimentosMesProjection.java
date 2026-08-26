package com.finance.finance.modules.relatorios.dto.recebimentospagamentos;

import java.math.BigDecimal;

public interface RecebimentosMesProjection {
    String getMes();

    BigDecimal getPrevisto();

    BigDecimal getRealizado();
}
