package com.finance.finance.modules.Lancamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.finance.modules.common.enums.TipoLancamento;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(name = "LancamentoParceladoRequest", description = "Payload para criação de lançamento parcelado. O sistema gera automaticamente N registos com valores distribuídos.")
public class LancamentoParceladoRequestDto {

    @NotBlank(message = "Descrição é obrigatória")
    @Schema(description = "Descrição base do lançamento", example = "Compra de equipamento")
    private String descricao;

    @NotNull(message = "Valor total é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor total deve ser maior que zero")
    @Schema(description = "Valor total a ser dividido em parcelas", example = "1000.00")
    private BigDecimal valorTotal;

    @NotNull(message = "Total de parcelas é obrigatório")
    @Min(value = 2, message = "Lançamento parcelado deve ter no mínimo 2 parcelas")
    @Schema(description = "Número de parcelas a gerar", example = "3")
    private Integer totalParcela;

    @Schema(description = "Data de lançamento (padrão: agora)", example = "2026-06-01T10:00:00")
    private LocalDateTime dataLancamento;

    @NotNull(message = "Data de vencimento da primeira parcela é obrigatória")
    @Schema(description = "Data de vencimento da primeira parcela. As seguintes avançam um mês cada.", example = "2026-06-01T23:59:59")
    private LocalDateTime dataVencimento;

    @NotNull(message = "Conta é obrigatória")
    @Schema(description = "ID da conta", example = "1")
    private Long contaId;

    @NotNull(message = "Categoria é obrigatória")
    @Schema(description = "ID da categoria", example = "3")
    private Long categoriaId;

    @Schema(description = "ID do cliente (opcional)", example = "5")
    private Long clienteId;

    @Schema(description = "ID do fornecedor (opcional)", example = "8")
    private Long fornecedorId;

    @NotNull(message = "Tipo é obrigatório")
    @Schema(description = "Tipo do lançamento: RECEITA ou DESPESA", example = "DESPESA")
    private TipoLancamento tipo;
}
