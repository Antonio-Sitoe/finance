package com.finance.finance.modules.contacto.dto;

import com.finance.finance.modules.common.enums.Situacao;

public record ContactoStatusResponseDTO(
        Long id,
        Situacao situacao,
        String mensagem) {
}
