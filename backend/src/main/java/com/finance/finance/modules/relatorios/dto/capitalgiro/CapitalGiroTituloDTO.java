package com.finance.finance.modules.relatorios.dto.capitalgiro;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Builder;

@Builder
public record CapitalGiroTituloDTO(
        Long id,
        String nome,
        LocalDate vencimento,
        BigDecimal valor) {
}
