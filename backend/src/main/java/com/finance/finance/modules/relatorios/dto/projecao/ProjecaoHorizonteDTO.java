package com.finance.finance.modules.relatorios.dto.projecao;

import java.math.BigDecimal;
import lombok.Builder;

@Builder
public record ProjecaoHorizonteDTO(
        Integer dias,
        BigDecimal entradas,
        BigDecimal saidas,
        BigDecimal saldoProjetado,
        String risco,
        BigDecimal riscoPercentual) {
}
