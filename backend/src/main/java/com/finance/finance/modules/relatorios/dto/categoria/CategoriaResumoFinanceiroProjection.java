package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

public interface CategoriaResumoFinanceiroProjection {
  Long getIdCategoria();

  String getNomeCategoria();

  BigDecimal getTotalDebito();

  BigDecimal getTotalCredito();

  BigDecimal getSaldo();

  BigDecimal getPctDebito();

  BigDecimal getPctCredito();
}
