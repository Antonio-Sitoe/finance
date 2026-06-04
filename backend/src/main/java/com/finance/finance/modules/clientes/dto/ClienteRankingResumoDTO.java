package com.finance.finance.modules.clientes.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resumo de classificação dos clientes por faixa de nota")
public record ClienteRankingResumoDTO(
    Long totalClientes,
    Long clientesNormais,
    Long clientesEmCrescimento,
    Long clientesVip) {
}