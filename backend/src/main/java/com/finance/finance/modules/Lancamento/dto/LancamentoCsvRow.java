package com.finance.finance.modules.Lancamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.finance.modules.common.enums.TipoLancamento;

public record LancamentoCsvRow(
        String descricao,
        BigDecimal valor,
        Integer totalParcelas,
        LocalDateTime dataLancamento,
        LocalDateTime dataVencimento,
        Long contaId,
        Long categoriaId,
        Long clienteId,
        Long fornecedorId,
        TipoLancamento tipo) {
}
