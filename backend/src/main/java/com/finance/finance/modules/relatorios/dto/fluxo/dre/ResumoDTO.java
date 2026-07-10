package com.finance.finance.modules.relatorios.dto.fluxo.dre;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumoDTO {

    private BigDecimal totalReceitas;

    private BigDecimal totalDespesas;

    private BigDecimal resultado;

    private BigDecimal margemPercentual;
}