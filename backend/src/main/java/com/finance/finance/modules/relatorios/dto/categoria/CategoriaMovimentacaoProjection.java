package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;

public interface CategoriaMovimentacaoProjection {
  Long getIdCategoria();

  String getNomeCategoria();

  Long getTotalMovimentacoes();

  BigDecimal getSomaValores();

  String getTipo();
}
