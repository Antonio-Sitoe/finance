package com.finance.finance.modules.relatorios.dto.search;

import com.finance.finance.modules.common.enums.Situacao;

public record FornecedorSearchItemDTO(
        Long id,
        String nomeEmpresarial,
        String email,
        Integer nota,
        Situacao situacao) {
}
