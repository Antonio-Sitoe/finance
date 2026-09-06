package com.finance.finance.modules.relatorios.dto.clientes;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record ClienteFaturamentoResumoDTO(
    BigDecimal totalFaturado,
    BigDecimal totalRecebido,
    BigDecimal totalEmAberto,
    long quantidadeFaturasPendentes) {
}
