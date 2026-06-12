package com.finance.finance.modules.categoria.dto;

import lombok.Builder;

@Builder
public record CategoriaResumoDTO(
                Long total,
                Long totalDebito,
                Long totalCredito,
                Long totalInativos) {
}