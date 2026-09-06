package com.finance.finance.modules.relatorios.dto.clientes;

import lombok.Builder;

@Builder
public record ClienteSemDados(
    Long semContactos,
    Long semTelefone) {
}
