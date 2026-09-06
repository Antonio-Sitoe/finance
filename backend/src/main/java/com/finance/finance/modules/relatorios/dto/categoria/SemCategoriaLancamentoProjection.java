package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SemCategoriaLancamentoProjection {
  Long getId();

  String getDescricao();

  BigDecimal getValor();

  LocalDateTime getDataVencimento();

  Long getIdConta();

  String getNomeConta();

  String getTipo();

  String getSituacao();
}
