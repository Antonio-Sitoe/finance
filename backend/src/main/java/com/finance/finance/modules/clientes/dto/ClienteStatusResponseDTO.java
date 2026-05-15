package com.finance.finance.modules.clientes.dto;

import com.finance.finance.modules.common.enums.Situacao;

public record ClienteStatusResponseDTO(
        Long id,
        Situacao situacao,
        String mensagem) {
}
