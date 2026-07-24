package com.finance.finance.modules.relatorios.dto.dre;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Builder;

@Builder
public record DreLancamentoDTO(
        Long id,
        String descricao,
        String conta,
        BigDecimal valor,
        LocalDate data) {
}
