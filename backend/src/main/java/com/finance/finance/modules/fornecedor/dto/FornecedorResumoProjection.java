package com.finance.finance.modules.fornecedor.dto;

public interface FornecedorResumoProjection {
    Long getTotal();

    Long getTotalAtivos();

    Long getTotalInativos();

    Long getAltaConformidade();
}