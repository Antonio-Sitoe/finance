package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record SemCategoriaLancamentoDTO(
    Long id,
    String descricao,
    BigDecimal valor,
    LocalDateTime dataVencimento,
    Long idConta,
    String nomeConta,
    String tipo,
    String situacao) {
}
