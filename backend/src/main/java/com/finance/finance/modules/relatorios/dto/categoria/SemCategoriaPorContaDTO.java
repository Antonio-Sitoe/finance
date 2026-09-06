package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record SemCategoriaPorContaDTO(
    Long idConta,
    String nomeConta,
    Long quantidade,
    BigDecimal valorTotal,
    LocalDateTime primeiroVencimento,
    String primeiraDescricao) {
}
