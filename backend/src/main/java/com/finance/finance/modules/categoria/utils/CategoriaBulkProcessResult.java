package com.finance.finance.modules.categoria.utils;

import java.util.List;

import com.finance.finance.modules.categoria.dto.CategoriaBulkErroDTO;
import com.finance.finance.modules.categoria.model.Categoria;

public record CategoriaBulkProcessResult(
        List<Categoria> paraGravar,
        List<CategoriaBulkErroDTO> erros) {
}
