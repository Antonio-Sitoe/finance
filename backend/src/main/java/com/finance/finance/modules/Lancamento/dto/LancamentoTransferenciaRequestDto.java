package com.finance.finance.modules.Lancamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LancamentoTransferenciaRequestDto {

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    private LocalDateTime dataLancamento;

    private LocalDateTime dataVencimento;

    @NotNull(message = "Conta de origem é obrigatória")
    private Long contaOrigemId;

    @NotNull(message = "Conta de destino é obrigatória")
    private Long contaDestinoId;

    @NotNull(message = "Categoria é obrigatória")
    private Long categoriaId;
}
