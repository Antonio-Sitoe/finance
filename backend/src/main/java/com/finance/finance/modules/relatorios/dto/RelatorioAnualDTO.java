package com.finance.finance.modules.relatorios.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;

@Builder
public record RelatorioAnualDTO(
                Integer ano,
                List<RelatorioMensalDTO> meses,
                Long totalAnual,
                BigDecimal saldoTotalAnual) {
}