package com.finance.finance.modules.relatorios.dto.recebimentospagamentos;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record RecebimentosBlocoDTO(
    BigDecimal previsto,
    BigDecimal realizado,
    BigDecimal taxaPercentual,
    BigDecimal emAtraso) {
}
