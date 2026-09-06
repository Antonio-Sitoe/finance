package com.finance.finance.modules.relatorios.dto.clientes;

import java.math.BigDecimal;

public interface ClienteClassificacaoNotaProjection {
  String getClassification();

  Long getQuantidadeClientes();

  BigDecimal getRecebiveisPendentes();
}
