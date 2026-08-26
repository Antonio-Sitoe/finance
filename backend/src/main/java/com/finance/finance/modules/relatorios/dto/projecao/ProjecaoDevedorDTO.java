package com.finance.finance.modules.relatorios.dto.projecao;

import java.math.BigDecimal;
import lombok.Builder;

@Builder
public record ProjecaoDevedorDTO(
        Long id,
        String nome,
        BigDecimal valor,
        Integer venceEmDias,
        String risco) {
}
