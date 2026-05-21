package com.finance.finance.modules.Lancamento.dto;

import com.finance.finance.modules.common.enums.PagamentoEnum;

public record LancamentoStatusResponseDTO(
        Long id,
        PagamentoEnum situacao,
        String mensagem) {
}
