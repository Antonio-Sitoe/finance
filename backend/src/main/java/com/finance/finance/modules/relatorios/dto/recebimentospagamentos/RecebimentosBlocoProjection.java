package com.finance.finance.modules.relatorios.dto.recebimentospagamentos;

import java.math.BigDecimal;

public interface RecebimentosBlocoProjection {
    String getTipo();

    BigDecimal getPrevisto();

    BigDecimal getRealizado();

    BigDecimal getEmAtraso();
}
