package com.finance.finance.modules.categoria.utils;

import java.util.List;

import com.finance.finance.modules.categoria.model.Categoria;
import com.finance.finance.modules.common.dto.BulkErroDTO;

public record CategoriaBulkProcessResult(
        List<Categoria> paraGravar,
        List<BulkErroDTO> erros) {
}
