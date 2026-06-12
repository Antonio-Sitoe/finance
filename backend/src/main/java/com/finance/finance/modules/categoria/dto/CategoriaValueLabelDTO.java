package com.finance.finance.modules.categoria.dto;

import lombok.Builder;

@Builder
public record CategoriaValueLabelDTO(
        Long id,
        String nome) {
}
