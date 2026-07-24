package com.finance.finance.modules.relatorios.dto.dre;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;

@Builder
public record DreCategoriaDTO(
        Long categoriaId,
        String nome,
        BigDecimal total,
        BigDecimal percentual,
        List<DreLancamentoDTO> lancamentos) {
}
