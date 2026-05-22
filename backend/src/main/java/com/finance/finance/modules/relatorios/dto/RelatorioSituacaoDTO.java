package com.finance.finance.modules.relatorios.dto;

import java.math.BigDecimal;

public interface RelatorioSituacaoDTO {
    String getStatus();
    Long getQuantidade();
    BigDecimal getSomaValor();
    BigDecimal getPercentual();
}
