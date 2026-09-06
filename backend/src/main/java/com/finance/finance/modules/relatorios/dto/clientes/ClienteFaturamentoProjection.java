package com.finance.finance.modules.relatorios.dto.clientes;

import java.math.BigDecimal;

public interface ClienteFaturamentoProjection {
  Long getIdCliente();

  String getNomeEmpresarial();

  BigDecimal getFaturado();

  BigDecimal getRecebido();

  BigDecimal getEmAberto();

  BigDecimal getPercentagemRecebido();

  Integer getPrazoQueFaltaDias();
}
