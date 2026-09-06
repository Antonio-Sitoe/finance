package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;

@Builder
public record CategoriaPaiDTO(
    Long idCategoria,
    String nomeCategoria,
    BigDecimal valor,
    Long quantidade,
    List<CategoriaFilhaDTO> filhas) {
}
