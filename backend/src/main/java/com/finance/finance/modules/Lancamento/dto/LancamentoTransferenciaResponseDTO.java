package com.finance.finance.modules.Lancamento.dto;

import lombok.Builder;

@Builder
public record LancamentoTransferenciaResponseDTO(
        LancamentoResponseDTO saida,
        LancamentoResponseDTO entrada) {
}
