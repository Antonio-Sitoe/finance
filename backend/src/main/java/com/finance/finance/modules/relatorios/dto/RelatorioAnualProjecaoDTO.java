package com.finance.finance.modules.relatorios.dto;

import java.math.BigDecimal;

public interface RelatorioAnualProjecaoDTO {
    Integer getAno();
    Long getTotalAnual();
    BigDecimal getSaldoTotalAnual();
}
