package com.finance.finance.modules.common.dto;

import java.util.List;

public record BulkResponseDTO<T>(
        List<T> criados,
        List<BulkErroDTO> erros) {
}
