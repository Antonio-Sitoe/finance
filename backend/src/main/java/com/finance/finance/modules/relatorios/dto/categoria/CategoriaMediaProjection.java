package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

public interface CategoriaMediaProjection {
  Long getIdCategoria();

  String getNomeCategoria();

  Long getQuantidade();

  BigDecimal getSoma();

  BigDecimal getMedia();
}
