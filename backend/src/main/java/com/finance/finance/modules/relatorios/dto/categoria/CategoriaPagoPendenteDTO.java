package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record CategoriaPagoPendenteDTO(
    Long idCategoria,
    String nomeCategoria,
    Long qtdPago,
    Long qtdPendente,
    BigDecimal valorPago,
    BigDecimal valorPendente,
    BigDecimal pctPago,
    BigDecimal pctPendente) {
}
