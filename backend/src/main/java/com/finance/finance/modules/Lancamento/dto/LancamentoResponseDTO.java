package com.finance.finance.modules.Lancamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.finance.finance.modules.common.dto.BasicReferenceDTO;
import com.finance.finance.modules.common.enums.PagamentoEnum;
import com.finance.finance.modules.common.enums.TipoLancamento;

import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "LancamentoResponse", description = "Resposta de lançamentos financeiros")
public class LancamentoResponseDTO {

    @Schema(description = "ID do lançamento", example = "1")
    private Long id;

    @Schema(description = "Descrição do lançamento", example = "Pagamento de fornecedor de internet")
    private String descricao;

    @Schema(description = "Número da parcela atual", example = "1")
    private Integer parcela;

    @Schema(description = "Total de parcelas", example = "12")
    private Integer totalParcela;

    @Schema(description = "Valor do lançamento", example = "1500.00")
    private BigDecimal valor;

    @Schema(description = "Data de lançamento", example = "2026-08-15T10:30:00")
    private LocalDateTime dataLancamento;

    @Schema(description = "Data de vencimento", example = "2026-09-15T23:59:59")
    private LocalDateTime dataVencimento;

    @Schema(description = "Situação do pagamento", example = "PENDENTE")
    private PagamentoEnum situacao;

    @Schema(description = "Tipo do lançamento", example = "DESPESA")
    private TipoLancamento tipo;

    @Schema(description = "Conta associada")
    private BasicReferenceDTO conta;

    @Schema(description = "Categoria associada")
    private BasicReferenceDTO categoria;

    @Schema(description = "Cliente associado (opcional)")
    private BasicReferenceDTO cliente;

    @Schema(description = "Fornecedor associado (opcional)")
    private BasicReferenceDTO fornecedor;
}