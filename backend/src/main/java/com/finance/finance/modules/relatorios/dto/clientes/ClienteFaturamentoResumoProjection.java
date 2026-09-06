package com.finance.finance.modules.relatorios.dto.clientes;

import java.math.BigDecimal;

public interface ClienteFaturamentoResumoProjection {
  BigDecimal getTotalFaturado();

  BigDecimal getTotalRecebido();

  BigDecimal getTotalEmAberto();

  Long getQuantidadeFaturasPendentes();
}
