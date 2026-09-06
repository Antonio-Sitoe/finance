package com.finance.finance.modules.relatorios.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteClassificacaoNotaDTO;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteFaturamentoDTO;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteFaturamentoResumoDTO;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteMultiplosContactosDTO;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteSemDados;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteStatusDTO;
import com.finance.finance.modules.relatorios.repository.ClienteReportRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientesRepostService {
  private final ClienteReportRepository repository;

  public ClienteStatusDTO situacaoPorEstado() {
    long total = this.repository.count();
    long activos = this.repository.countBySituacao(Situacao.ATIVO);
    long inativos = this.repository.countBySituacao(Situacao.INATIVO);

    return ClienteStatusDTO.builder()
        .total(total)
        .activos(activos)
        .inativos(inativos)
        .semDadosContactos(this.repository.countClientesComDadosIncompletos())
        .build();
  }

  public List<ClienteClassificacaoNotaDTO> classificarPorNota() {
    return this.repository.classificarPorNota().stream()
        .map(row -> ClienteClassificacaoNotaDTO.builder()
            .classification(row.getClassification())
            .quantidadeClientes(row.getQuantidadeClientes() != null ? row.getQuantidadeClientes() : 0L)
            .recebiveisPendentes(
                row.getRecebiveisPendentes() != null ? row.getRecebiveisPendentes() : BigDecimal.ZERO)
            .build())
        .toList();
  }

  public ClienteSemDados getClienteSemDados() {
    return ClienteSemDados.builder()
        .semContactos(this.repository.countByEmailIsNull())
        .semTelefone(this.repository.countByTelefoneIsNull())
        .build();
  }

  public ClienteMultiplosContactosDTO clientesComMultiplosContactos() {
    Long quantidade = this.repository.countClientesComMultiplosContactos();
    return ClienteMultiplosContactosDTO.builder()
        .quantidadeClientes(quantidade != null ? quantidade : 0L)
        .build();
  }

  public List<ClienteFaturamentoDTO> faturamentoPorCliente(LocalDate de, LocalDate ate) {
    validarPeriodo(de, ate);
    return this.repository.faturamentoPorCliente(de, ate).stream()
        .map(row -> ClienteFaturamentoDTO.builder()
            .idCliente(row.getIdCliente())
            .nomeEmpresarial(row.getNomeEmpresarial())
            .faturado(row.getFaturado() != null ? row.getFaturado() : BigDecimal.ZERO)
            .recebido(row.getRecebido() != null ? row.getRecebido() : BigDecimal.ZERO)
            .emAberto(row.getEmAberto() != null ? row.getEmAberto() : BigDecimal.ZERO)
            .percentagemRecebido(
                row.getPercentagemRecebido() != null ? row.getPercentagemRecebido() : BigDecimal.ZERO)
            .prazoQueFaltaDias(row.getPrazoQueFaltaDias())
            .build())
        .toList();
  }

  public ClienteFaturamentoResumoDTO faturamentoResumo(LocalDate de, LocalDate ate) {
    validarPeriodo(de, ate);
    var row = this.repository.faturamentoResumo(de, ate);
    if (row == null) {
      return ClienteFaturamentoResumoDTO.builder()
          .totalFaturado(BigDecimal.ZERO)
          .totalRecebido(BigDecimal.ZERO)
          .totalEmAberto(BigDecimal.ZERO)
          .quantidadeFaturasPendentes(0L)
          .build();
    }
    return ClienteFaturamentoResumoDTO.builder()
        .totalFaturado(row.getTotalFaturado() != null ? row.getTotalFaturado() : BigDecimal.ZERO)
        .totalRecebido(row.getTotalRecebido() != null ? row.getTotalRecebido() : BigDecimal.ZERO)
        .totalEmAberto(row.getTotalEmAberto() != null ? row.getTotalEmAberto() : BigDecimal.ZERO)
        .quantidadeFaturasPendentes(
            row.getQuantidadeFaturasPendentes() != null ? row.getQuantidadeFaturasPendentes() : 0L)
        .build();
  }

  private void validarPeriodo(LocalDate de, LocalDate ate) {
    if (de != null && ate != null && de.isAfter(ate)) {
      throw new IllegalArgumentException("A data inicial não pode ser posterior à data final.");
    }
  }
}
