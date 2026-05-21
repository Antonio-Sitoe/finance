package com.finance.finance.modules.Lancamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.finance.modules.common.enums.TipoLancamento;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(name = "LancamentoRequest", description = "Payload para criação e atualização de um lançamento simples")
public class LancamentoRequestDto {

    @NotBlank(groups = Create.class, message = "Descrição é obrigatória")
    @Schema(description = "Descrição do lançamento", example = "Pagamento de internet")
    private String descricao;

    @NotNull(groups = Create.class, message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @Schema(description = "Valor do lançamento", example = "1500.00")
    private BigDecimal valor;

    @Schema(description = "Data de lançamento (padrão: agora)", example = "2026-06-01T10:00:00")
    private LocalDateTime dataLancamento;

    @NotNull(groups = Create.class, message = "Data de vencimento é obrigatória")
    @Schema(description = "Data de vencimento", example = "2026-07-01T23:59:59")
    private LocalDateTime dataVencimento;

    @NotNull(groups = Create.class, message = "Conta é obrigatória")
    @Schema(description = "ID da conta", example = "1")
    private Long contaId;

    @NotNull(groups = Create.class, message = "Categoria é obrigatória")
    @Schema(description = "ID da categoria", example = "3")
    private Long categoriaId;

    @Schema(description = "ID do cliente (opcional)", example = "5")
    private Long clienteId;

    @Schema(description = "ID do fornecedor (opcional)", example = "8")
    private Long fornecedorId;

    @NotNull(groups = Create.class, message = "Tipo é obrigatório")
    @Schema(description = "Tipo do lançamento: RECEITA ou DESPESA", example = "DESPESA")
    private TipoLancamento tipo;

    public interface Create {
    }

    public interface Update {
    }
}
