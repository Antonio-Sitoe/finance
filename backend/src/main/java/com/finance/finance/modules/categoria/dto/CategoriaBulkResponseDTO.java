package com.finance.finance.modules.categoria.dto;

import java.util.List;

public record CategoriaBulkResponseDTO(
        List<CategoriaResponseDTO> criados,
        List<CategoriaBulkErroDTO> erros) {
}
