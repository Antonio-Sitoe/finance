package com.finance.finance.modules.relatorios.dto.clientes;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record ClienteClassificacaoNotaDTO(
    String classification,
    long quantidadeClientes,
    BigDecimal recebiveisPendentes) {
}
