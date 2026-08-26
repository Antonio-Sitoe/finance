package com.finance.finance.modules.relatorios.dto.projecao;

import lombok.Builder;

@Builder
public record ProjecaoInsightDTO(
        String tipo,
        String titulo,
        String descricao) {
}
