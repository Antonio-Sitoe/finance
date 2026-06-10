package com.finance.finance.modules.fornecedor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FornecedorResumoDTO {
    private Long total;
    private Long totalAtivos;
    private Long totalInativos;
    private Long altaConformidade;
}