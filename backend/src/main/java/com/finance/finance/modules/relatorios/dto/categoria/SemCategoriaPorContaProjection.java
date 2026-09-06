package com.finance.finance.modules.relatorios.dto.categoria;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SemCategoriaPorContaProjection {
  Long getIdConta();

  String getNomeConta();

  Long getQuantidade();

  BigDecimal getValorTotal();

  LocalDateTime getPrimeiroVencimento();

  String getPrimeiraDescricao();
}
