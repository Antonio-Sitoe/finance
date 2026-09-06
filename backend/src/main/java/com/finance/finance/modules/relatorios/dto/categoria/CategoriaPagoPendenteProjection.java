package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

public interface CategoriaPagoPendenteProjection {
  Long getIdCategoria();

  String getNomeCategoria();

  Long getQtdPago();

  Long getQtdPendente();

  BigDecimal getValorPago();

  BigDecimal getValorPendente();

  BigDecimal getPctPago();

  BigDecimal getPctPendente();
}
