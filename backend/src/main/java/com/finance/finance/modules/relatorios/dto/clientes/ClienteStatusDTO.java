package com.finance.finance.modules.relatorios.dto.clientes;

import lombok.Builder;

@Builder
public record ClienteStatusDTO(
                long total,
                long activos,
                long inativos,
                long semDadosContactos) {
}
