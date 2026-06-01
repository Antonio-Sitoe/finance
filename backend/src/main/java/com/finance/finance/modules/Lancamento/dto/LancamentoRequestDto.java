package com.finance.finance.modules.Lancamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.finance.modules.common.enums.TipoLancamento;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LancamentoRequestDto {

    @NotBlank(groups = Create.class, message = "Descrição é obrigatória")
    private String descricao;

    @NotNull(groups = Create.class, message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    private LocalDateTime dataLancamento;

    @NotNull(groups = Create.class, message = "Data de vencimento é obrigatória")
    private LocalDateTime dataVencimento;

    @NotNull(groups = Create.class, message = "Conta é obrigatória")
    private Long contaId;

    @NotNull(groups = Create.class, message = "Categoria é obrigatória")
    private Long categoriaId;

    private Long clienteId;

    private Long fornecedorId;

    @NotNull(groups = Create.class, message = "Tipo é obrigatório")
    private TipoLancamento tipo;

    public interface Create {}

    public interface Update {}
}
