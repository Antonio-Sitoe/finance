package com.finance.finance.modules.relatorios.dto.fluxo;

import java.math.BigDecimal;

import com.finance.finance.modules.common.enums.PagamentoEnum;
import com.finance.finance.modules.common.enums.TipoLancamento;

import lombok.Builder;

@Builder
public record FluxoDiarioLancamentoDTO(
        Long id,
        String descricao,
        String conta,
        String categoria,
        BigDecimal valor,
        TipoLancamento tipo,
        PagamentoEnum situacao) {
}
