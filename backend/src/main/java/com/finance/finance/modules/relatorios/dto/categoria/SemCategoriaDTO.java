package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;

@Builder
public record SemCategoriaDTO(
    Long totalLancamentos,
    BigDecimal valorTotal,
    List<SemCategoriaPorContaDTO> porConta,
    List<SemCategoriaLancamentoDTO> lancamentos) {
}
