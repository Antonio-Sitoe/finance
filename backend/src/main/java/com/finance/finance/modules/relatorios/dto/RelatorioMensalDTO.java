package com.finance.finance.modules.relatorios.dto;

import java.math.BigDecimal;

public interface RelatorioMensalDTO {
    Integer getAno();
    Integer getMes();
    Long getTotalLancamentos();
    BigDecimal getSomaReceitas();
    BigDecimal getSomaDespesas();
    BigDecimal getSaldoMes();
}
