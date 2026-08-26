package com.finance.finance.modules.relatorios.dto.projecao;

import java.math.BigDecimal;
import java.util.List;
import lombok.Builder;

@Builder
public record ProjecaoCaixaDTO(
        Integer horizonteActivo,
        BigDecimal saldoAtual,
        BigDecimal entradasPrevistas,
        BigDecimal saidasPrevistas,
        BigDecimal saldoProjetado,
        BigDecimal variacaoPercentual,
        BigDecimal riscoInadimplenciaPercentual,
        BigDecimal impactoRisco,
        List<ProjecaoHorizonteDTO> horizontes,
        List<ProjecaoInsightDTO> insights,
        List<ProjecaoDevedorDTO> principaisDevedores) {
}
