package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record CategoriaResumoFinanceiroDTO(
    Long idCategoria,
    String nomeCategoria,
    BigDecimal totalDebito,
    BigDecimal totalCredito,
    BigDecimal saldo,
    BigDecimal pctDebito,
    BigDecimal pctCredito) {
}
