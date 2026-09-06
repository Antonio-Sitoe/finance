package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

public interface CategoriaHierarquiaProjection {
  Long getIdPai();

  String getNomePai();

  Long getIdFilha();

  String getNomeFilha();

  BigDecimal getValorFilha();

  Long getQtdFilha();

  BigDecimal getValorPai();

  Long getQtdPai();
}
