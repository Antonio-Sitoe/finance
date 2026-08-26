package com.finance.finance.modules.relatorios.dto.projecao;

import java.math.BigDecimal;

public interface ProjecaoHorizonteProjection {
    Integer getDias();
    BigDecimal getEntradas();
    BigDecimal getSaidas();
}
