package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record CategoriaValorTotalDTO(
    Long idCategoria,
    String nomeCategoria,
    BigDecimal valorTotal) {
}
