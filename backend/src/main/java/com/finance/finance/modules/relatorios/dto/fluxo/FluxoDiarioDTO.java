package com.finance.finance.modules.relatorios.dto.fluxo;

import java.time.LocalDate;
import java.util.List;

import lombok.Builder;

@Builder
public record FluxoDiarioDTO(
        LocalDate de,
        LocalDate ate,
        FluxoDiarioResumoDTO resumo,
        List<FluxoDiarioDiaDTO> dias) {
}
