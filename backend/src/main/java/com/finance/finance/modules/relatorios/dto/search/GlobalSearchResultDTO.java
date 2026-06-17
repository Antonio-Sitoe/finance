package com.finance.finance.modules.relatorios.dto.search;

import java.util.List;

public record GlobalSearchResultDTO(
        List<ClienteSearchItemDTO> clientes,
        List<FornecedorSearchItemDTO> fornecedores,
        List<LancamentoSearchItemDTO> lancamentos) {

    public static GlobalSearchResultDTO empty() {
        return new GlobalSearchResultDTO(List.of(), List.of(), List.of());
    }
}
