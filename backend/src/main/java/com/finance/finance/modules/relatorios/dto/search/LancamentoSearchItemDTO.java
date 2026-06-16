package com.finance.finance.modules.relatorios.dto.search;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.finance.modules.common.enums.PagamentoEnum;
import com.finance.finance.modules.common.enums.TipoLancamento;

public record LancamentoSearchItemDTO(
        Long id,
        String descricao,
        String referencia,
        BigDecimal valor,
        LocalDateTime dataLancamento,
        LocalDateTime dataVencimento,
        PagamentoEnum situacao,
        TipoLancamento tipo) {
}
