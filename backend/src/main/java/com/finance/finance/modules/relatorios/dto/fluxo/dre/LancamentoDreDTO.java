package com.finance.finance.modules.relatorios.dto.fluxo.dre;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LancamentoDreDTO {

    private Long id;

    private String descricao;

    private String conta;

    private BigDecimal valor;

    private LocalDate data;
}
