package com.finance.finance.modules.usuario.dto;

import com.finance.finance.modules.common.enums.Situacao;

public record UsuarioStatusResponseDTO(
        Long id,
        Situacao situacao,
        String mensagem) {
}
