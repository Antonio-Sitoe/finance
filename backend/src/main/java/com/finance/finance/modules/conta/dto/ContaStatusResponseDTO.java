package com.finance.finance.modules.conta.dto;

import com.finance.finance.modules.common.enums.Situacao;

public record ContaStatusResponseDTO(
        Long id,
        Situacao situacao,
        String mensagem) {
}
