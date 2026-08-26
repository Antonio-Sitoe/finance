package com.finance.finance.modules.relatorios.dto.recebimentospagamentos;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record RecebimentosMesDTO(
    String mes,
    BigDecimal previsto,
    BigDecimal realizado) {

}
