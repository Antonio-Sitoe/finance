package com.finance.finance.modules.relatorios.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.finance.finance.modules.relatorios.dto.categoria.CategoriaFilhaDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaHierarquiaDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaHierarquiaProjection;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaMediaDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaMovimentacaoDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaPaiDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaPagoPendenteDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaResumoFinanceiroDTO;
import com.finance.finance.modules.relatorios.dto.categoria.CategoriaValorTotalDTO;
import com.finance.finance.modules.relatorios.dto.categoria.SemCategoriaDTO;
import com.finance.finance.modules.relatorios.dto.categoria.SemCategoriaLancamentoDTO;
import com.finance.finance.modules.relatorios.dto.categoria.SemCategoriaPorContaDTO;
import com.finance.finance.modules.relatorios.repository.CategoriaReportRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaReportService {
  private final CategoriaReportRepository repository;

  public List<CategoriaValorTotalDTO> totalDespesasPagasPorCategoria() {
    return repository.totalDespesasPagasPorCategoria().stream()
        .map(row -> CategoriaValorTotalDTO.builder()
            .idCategoria(row.getIdCategoria())
            .nomeCategoria(row.getNomeCategoria())
            .valorTotal(valueOrZero(row.getValorTotal()))
            .build())
        .toList();
  }

  public List<CategoriaResumoFinanceiroDTO> resumoFinanceiroPorCategoria() {
    return repository.resumoFinanceiroPorCategoria().stream()
        .map(row -> CategoriaResumoFinanceiroDTO.builder()
            .idCategoria(row.getIdCategoria())
            .nomeCategoria(row.getNomeCategoria())
            .totalDebito(valueOrZero(row.getTotalDebito()))
            .totalCredito(valueOrZero(row.getTotalCredito()))
            .saldo(valueOrZero(row.getSaldo()))
            .pctDebito(valueOrZero(row.getPctDebito()))
            .pctCredito(valueOrZero(row.getPctCredito()))
            .build())
        .toList();
  }

  public List<CategoriaMediaDTO> mediaPorCategoria() {
    return repository.mediaPorCategoria().stream()
        .map(row -> CategoriaMediaDTO.builder()
            .idCategoria(row.getIdCategoria())
            .nomeCategoria(row.getNomeCategoria())
            .quantidade(row.getQuantidade() != null ? row.getQuantidade() : 0L)
            .soma(valueOrZero(row.getSoma()))
            .media(valueOrZero(row.getMedia()).setScale(2, RoundingMode.HALF_UP))
            .build())
        .toList();
  }

  public List<CategoriaMovimentacaoDTO> movimentacaoPorCategoria() {
    return repository.movimentacaoPorCategoria().stream()
        .map(row -> CategoriaMovimentacaoDTO.builder()
            .idCategoria(row.getIdCategoria())
            .nomeCategoria(row.getNomeCategoria())
            .totalMovimentacoes(row.getTotalMovimentacoes() != null ? row.getTotalMovimentacoes() : 0L)
            .somaValores(valueOrZero(row.getSomaValores()))
            .tipo(row.getTipo())
            .build())
        .toList();
  }

  public CategoriaHierarquiaDTO hierarquiaPorCategoria() {
    List<CategoriaHierarquiaProjection> rows = repository.hierarquiaPorCategoria();
    Map<Long, List<CategoriaFilhaDTO>> filhasPorPai = new LinkedHashMap<>();
    Map<Long, BigDecimal> valorPaiMap = new LinkedHashMap<>();
    Map<Long, Long> qtdPaiMap = new LinkedHashMap<>();
    Map<Long, String> nomePaiMap = new LinkedHashMap<>();

    for (CategoriaHierarquiaProjection row : rows) {
      Long idPai = row.getIdPai();
      nomePaiMap.putIfAbsent(idPai, row.getNomePai());
      valorPaiMap.putIfAbsent(idPai, valueOrZero(row.getValorPai()));
      qtdPaiMap.putIfAbsent(idPai, row.getQtdPai() != null ? row.getQtdPai() : 0L);

      BigDecimal valorPai = valorPaiMap.get(idPai);
      BigDecimal valorFilha = valueOrZero(row.getValorFilha());
      BigDecimal pct = BigDecimal.ZERO;
      if (valorPai.signum() > 0) {
        pct = valorFilha.multiply(BigDecimal.valueOf(100))
            .divide(valorPai, 2, RoundingMode.HALF_UP);
      }

      filhasPorPai.computeIfAbsent(idPai, key -> new ArrayList<>())
          .add(CategoriaFilhaDTO.builder()
              .idCategoria(row.getIdFilha())
              .nomeCategoria(row.getNomeFilha())
              .valor(valorFilha)
              .quantidade(row.getQtdFilha() != null ? row.getQtdFilha() : 0L)
              .pctDoPai(pct)
              .build());
    }

    List<CategoriaPaiDTO> pais = new ArrayList<>();
    for (Long idPai : nomePaiMap.keySet()) {
      pais.add(CategoriaPaiDTO.builder()
          .idCategoria(idPai)
          .nomeCategoria(nomePaiMap.get(idPai))
          .valor(valorPaiMap.get(idPai))
          .quantidade(qtdPaiMap.get(idPai))
          .filhas(filhasPorPai.getOrDefault(idPai, List.of()))
          .build());
    }

    List<CategoriaFilhaDTO> top5 = filhasPorPai.values().stream()
        .flatMap(List::stream)
        .sorted(Comparator.comparing(CategoriaFilhaDTO::valor).reversed())
        .limit(5)
        .toList();

    return CategoriaHierarquiaDTO.builder()
        .pais(pais)
        .top5Filhas(top5)
        .build();
  }

  public List<CategoriaPagoPendenteDTO> pagoVsPendenteUltimoTrimestre() {
    return repository.pagoVsPendenteUltimoTrimestre().stream()
        .map(row -> CategoriaPagoPendenteDTO.builder()
            .idCategoria(row.getIdCategoria())
            .nomeCategoria(row.getNomeCategoria())
            .qtdPago(row.getQtdPago() != null ? row.getQtdPago() : 0L)
            .qtdPendente(row.getQtdPendente() != null ? row.getQtdPendente() : 0L)
            .valorPago(valueOrZero(row.getValorPago()))
            .valorPendente(valueOrZero(row.getValorPendente()))
            .pctPago(valueOrZero(row.getPctPago()))
            .pctPendente(valueOrZero(row.getPctPendente()))
            .build())
        .toList();
  }

  public SemCategoriaDTO semCategoria() {
    List<SemCategoriaPorContaDTO> porConta = repository.semCategoriaPorConta().stream()
        .map(row -> SemCategoriaPorContaDTO.builder()
            .idConta(row.getIdConta())
            .nomeConta(row.getNomeConta())
            .quantidade(row.getQuantidade() != null ? row.getQuantidade() : 0L)
            .valorTotal(valueOrZero(row.getValorTotal()))
            .primeiroVencimento(row.getPrimeiroVencimento())
            .primeiraDescricao(row.getPrimeiraDescricao())
            .build())
        .toList();

    List<SemCategoriaLancamentoDTO> lancamentos = repository.semCategoriaLancamentos().stream()
        .map(row -> SemCategoriaLancamentoDTO.builder()
            .id(row.getId())
            .descricao(row.getDescricao())
            .valor(valueOrZero(row.getValor()))
            .dataVencimento(row.getDataVencimento())
            .idConta(row.getIdConta())
            .nomeConta(row.getNomeConta())
            .tipo(row.getTipo())
            .situacao(row.getSituacao())
            .build())
        .toList();

    long total = lancamentos.size();
    BigDecimal valorTotal = lancamentos.stream()
        .map(SemCategoriaLancamentoDTO::valor)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    return SemCategoriaDTO.builder()
        .totalLancamentos(total)
        .valorTotal(valorTotal)
        .porConta(porConta)
        .lancamentos(lancamentos)
        .build();
  }

  private BigDecimal valueOrZero(BigDecimal value) {
    return value != null ? value : BigDecimal.ZERO;
  }
}
