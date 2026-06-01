package com.finance.finance.modules.Lancamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.finance.modules.common.enums.TipoLancamento;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LancamentoParceladoRequestDto {

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    @NotNull(message = "Valor total é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor total deve ser maior que zero")
    private BigDecimal valorTotal;

    @NotNull(message = "Total de parcelas é obrigatório")
    @Min(value = 2, message = "Lançamento parcelado deve ter no mínimo 2 parcelas")
    private Integer totalParcela;

    private LocalDateTime dataLancamento;

    @NotNull(message = "Data de vencimento da primeira parcela é obrigatória")
    private LocalDateTime dataVencimento;

    @NotNull(message = "Conta é obrigatória")
    private Long contaId;

    @NotNull(message = "Categoria é obrigatória")
    private Long categoriaId;

    private Long clienteId;

    private Long fornecedorId;

    @NotNull(message = "Tipo é obrigatório")
    private TipoLancamento tipo;
}
