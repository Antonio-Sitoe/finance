package com.finance.finance.modules.categoria.dto;

import com.finance.finance.modules.common.enums.Situacao;

public record CategoriaStatusResponseDTO(
        Long id,
        Situacao situacao,
        String mensagem) {
}
