package com.finance.finance.modules.relatorios.dto.clientes;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record ClienteFaturamentoDTO(
    Long idCliente,
    String nomeEmpresarial,
    BigDecimal faturado,
    BigDecimal recebido,
    BigDecimal emAberto,
    BigDecimal percentagemRecebido,
    Integer prazoQueFaltaDias) {
}
