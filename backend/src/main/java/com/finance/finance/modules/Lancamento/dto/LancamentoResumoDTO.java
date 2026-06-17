package com.finance.finance.modules.Lancamento.dto;

public record LancamentoResumoDTO(
        long total,
        double valorReceita,
        double valorDespesa,
        double saldo) {
}
