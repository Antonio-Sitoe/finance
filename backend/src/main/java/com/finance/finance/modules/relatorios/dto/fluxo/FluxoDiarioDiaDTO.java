package com.finance.finance.modules.relatorios.dto.fluxo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.Builder;

@Builder
public record FluxoDiarioDiaDTO(
        LocalDate data,
        BigDecimal entradas,
        BigDecimal saidas,
        BigDecimal saldoDia,
        BigDecimal saldoAcumulado,
        List<FluxoDiarioLancamentoDTO> lancamentos) {
}
