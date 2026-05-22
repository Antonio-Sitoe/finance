package com.finance.finance.modules.relatorios.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Schema(name = "LancamentoCategoriaResumoResponse", description = "Resumo de lançamentos agrupados por categoria")
public class RelatorioPorCategoria {
    private Long categoriaId;
    private String nome;
    private Long totalLancamento;
    private BigDecimal valor;
}