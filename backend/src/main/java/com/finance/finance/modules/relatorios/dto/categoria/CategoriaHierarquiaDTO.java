package com.finance.finance.modules.relatorios.dto.categoria;

import java.util.List;

import lombok.Builder;

@Builder
public record CategoriaHierarquiaDTO(
    List<CategoriaPaiDTO> pais,
    List<CategoriaFilhaDTO> top5Filhas) {
}
