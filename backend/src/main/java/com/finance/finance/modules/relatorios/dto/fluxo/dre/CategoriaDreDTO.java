package com.finance.finance.modules.relatorios.dto.fluxo.dre;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaDreDTO {

    private Long categoriaId;

    private String nome;

    private BigDecimal total;

    private BigDecimal percentual;

    private List<LancamentoDreDTO> lancamentos;
}
