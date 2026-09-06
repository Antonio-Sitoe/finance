package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record CategoriaMediaDTO(
    Long idCategoria,
    String nomeCategoria,
    Long quantidade,
    BigDecimal soma,
    BigDecimal media) {
}
