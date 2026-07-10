package com.finance.finance.modules.relatorios.dto.fluxo.dre;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DreResponseDTO {

    private LocalDate de;
    private LocalDate ate;

    private ResumoDTO resumo;

    private List<CategoriaDreDTO> receitas;

    private List<CategoriaDreDTO> despesas;
}