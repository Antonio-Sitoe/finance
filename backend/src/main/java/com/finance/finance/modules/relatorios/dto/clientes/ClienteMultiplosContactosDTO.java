package com.finance.finance.modules.relatorios.dto.clientes;

import lombok.Builder;

@Builder
public record ClienteMultiplosContactosDTO(
    long quantidadeClientes) {
}
