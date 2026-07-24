package com.finance.finance.modules.relatorios.dto.dre;

import java.time.LocalDate;
import java.util.List;

import lombok.Builder;

@Builder
public record DreDTO(
        LocalDate de,
        LocalDate ate,
        DreResumoDTO resumo,
        List<DreCategoriaDTO> receitas,
        List<DreCategoriaDTO> despesas) {
}
