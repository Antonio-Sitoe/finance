package com.finance.finance.modules.Lancamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.finance.finance.modules.common.dto.BasicReferenceDTO;
import com.finance.finance.modules.common.enums.PagamentoEnum;
import com.finance.finance.modules.common.enums.TipoLancamento;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LancamentoResponseDTO {

    private Long id;
    private String descricao;
    private Integer parcela;
    private Integer totalParcela;
    private BigDecimal valor;
    private LocalDateTime dataLancamento;
    private LocalDateTime dataVencimento;
    private PagamentoEnum situacao;
    private TipoLancamento tipo;
    private BasicReferenceDTO conta;
    private BasicReferenceDTO categoria;
    private BasicReferenceDTO cliente;
    private BasicReferenceDTO fornecedor;
}
