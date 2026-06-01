package com.finance.finance.modules.relatorios.dto;

import java.math.BigDecimal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelatorioPorCategoria {
    private Long categoriaId;
    private String nome;
    private Long totalLancamento;
    private BigDecimal valor;
}
