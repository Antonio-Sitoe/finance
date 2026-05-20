package com.finance.finance.modules.fornecedor.dto;

import com.finance.finance.modules.common.enums.Situacao;

public record FornecedorStatusResponseDTO(
        Long id,
        Situacao situacao,
        String mensagem) {
}
