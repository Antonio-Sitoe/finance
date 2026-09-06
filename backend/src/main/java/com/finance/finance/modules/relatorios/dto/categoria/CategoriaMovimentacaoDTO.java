package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record CategoriaMovimentacaoDTO(
    Long idCategoria,
    String nomeCategoria,
    Long totalMovimentacoes,
    BigDecimal somaValores,
    String tipo) {
}
