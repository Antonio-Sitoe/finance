package com.finance.finance.modules.relatorios.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.finance.modules.relatorios.dto.categoria.CategoriaHierarquiaDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaMediaDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaMovimentacaoDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaPagoPendenteDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaResumoFinanceiroDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaValorTotalDTO;
import com.finance.finance.modules.relatorios.dto.categoria.SemCategoriaDTO;
import com.finance.finance.modules.relatorios.service.CategoriaReportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Relatórios de categorias", description = "Análises financeiras agrupadas por categoria")
@RestController
@RequestMapping("/categorias-report")
@RequiredArgsConstructor
public class CategoriaReportController {
  private final CategoriaReportService service;

  @Operation(
      summary = "Total de despesas pagas por categoria",
      description = "Soma os lançamentos de despesa pagos e ordena as categorias pelo maior valor")
  @GetMapping("/despesas-pagas")
  public ResponseEntity<List<CategoriaValorTotalDTO>> totalDespesasPagasPorCategoria() {
    return ResponseEntity.ok(service.totalDespesasPagasPorCategoria());
  }

  @Operation(
      summary = "Resumo financeiro por categoria",
      description = "Totais pagos de débito e crédito, saldo e percentuais agrupados por categoria")
  @GetMapping("/resumo-financeiro")
  public ResponseEntity<List<CategoriaResumoFinanceiroDTO>> resumoFinanceiroPorCategoria() {
    return ResponseEntity.ok(service.resumoFinanceiroPorCategoria());
  }

  @Operation(
      summary = "Média de valor por lançamento",
      description = "Média, soma e quantidade de lançamentos agrupadas por categoria")
  @GetMapping("/media-por-categoria")
  public ResponseEntity<List<CategoriaMediaDTO>> mediaPorCategoria() {
    return ResponseEntity.ok(service.mediaPorCategoria());
  }

  @Operation(
      summary = "Movimentação por categoria",
      description = "Total de movimentações, soma dos valores e tipo dominante (débito/crédito) por categoria")
  @GetMapping("/movimentacao-por-categoria")
  public ResponseEntity<List<CategoriaMovimentacaoDTO>> movimentacaoPorCategoria() {
    return ResponseEntity.ok(service.movimentacaoPorCategoria());
  }

  @Operation(
      summary = "Análise pai/filho",
      description = "Soma por categoria pai, detalhe das filhas e top 5 filhas por volume")
  @GetMapping("/hierarquia")
  public ResponseEntity<CategoriaHierarquiaDTO> hierarquiaPorCategoria() {
    return ResponseEntity.ok(service.hierarquiaPorCategoria());
  }

  @Operation(
      summary = "PAGO vs PENDENTE por categoria",
      description = "Percentuais de situação por categoria no trimestre calendário actual")
  @GetMapping("/pago-vs-pendente")
  public ResponseEntity<List<CategoriaPagoPendenteDTO>> pagoVsPendenteUltimoTrimestre() {
    return ResponseEntity.ok(service.pagoVsPendenteUltimoTrimestre());
  }

  @Operation(
      summary = "Lançamentos sem categoria",
      description = "Resumo, agregação por conta e lista de lançamentos sem classificação")
  @GetMapping("/sem-categoria")
  public ResponseEntity<SemCategoriaDTO> semCategoria() {
    return ResponseEntity.ok(service.semCategoria());
  }
}
