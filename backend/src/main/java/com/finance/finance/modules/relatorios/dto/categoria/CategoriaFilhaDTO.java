package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record CategoriaFilhaDTO(
    Long idCategoria,
    String nomeCategoria,
    BigDecimal valor,
    Long quantidade,
    BigDecimal pctDoPai) {
}
