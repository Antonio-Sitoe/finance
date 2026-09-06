package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

public interface CategoriaValorTotalProjection {
  Long getIdCategoria();

  String getNomeCategoria();

  BigDecimal getValorTotal();
}
