package com.finance.finance.modules.relatorios.dto.capitalgiro;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;

@Builder
public record CapitalGiroDTO(
        BigDecimal activoCirculante,
        BigDecimal passivoCirculante,
        BigDecimal capitalGiro,
        BigDecimal liquidezCorrente,
        List<CapitalGiroTituloDTO> aReceber,
        List<CapitalGiroTituloDTO> aPagar) {
}
