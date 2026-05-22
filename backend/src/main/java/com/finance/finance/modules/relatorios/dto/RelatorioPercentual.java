package com.finance.finance.modules.relatorios.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record RelatorioPercentual(
        Long totalLancamentos,
        List<RelatorioSituacaoDTO> situacao) {
}
