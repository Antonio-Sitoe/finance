package com.finance.finance.modules.relatorios.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finance.finance.modules.relatorios.dto.clientes.ClienteClassificacaoNotaDTO;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteFaturamentoDTO;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteFaturamentoResumoDTO;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteMultiplosContactosDTO;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteSemDados;
import com.finance.finance.modules.relatorios.dto.clientes.ClienteStatusDTO;
import com.finance.finance.modules.relatorios.service.ClientesRepostService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Relatórios de clientes", description = "Análises e classificações de clientes")
@RestController
@RequestMapping("/clientes-report")
@RequiredArgsConstructor
public class ClientesReportController {
  private final ClientesRepostService service;

  @Operation(summary = "Clientes ATIVO vs INATIVO", description = "Contagem de clientes por situação")
  @GetMapping("/situacao-por-estado")
  public ResponseEntity<ClienteStatusDTO> situacaoPorEstado() {
    return ResponseEntity.ok(service.situacaoPorEstado());
  }

  @Operation(summary = "Classificação por nota", description = "NORMAL (0–3), MASTER (4–5) e VIP (6–10): contagem e recebíveis pendentes por grupo")
  @GetMapping("/classificacao-por-nota")
  public ResponseEntity<List<ClienteClassificacaoNotaDTO>> classificarPorNota() {
    return ResponseEntity.ok(service.classificarPorNota());
  }

  @Operation(summary = "Clientes sem contactos", description = "Contagem de clientes sem email ou telefone")
  @GetMapping("/sem-dados-contactos")
  public ResponseEntity<ClienteSemDados> semDadosContactos() {
    return ResponseEntity.ok(service.getClienteSemDados());
  }

  @Operation(
      summary = "Clientes com múltiplos contactos",
      description = "Contagem de clientes que têm mais de um contacto associado")
  @GetMapping("/multiplos-contactos")
  public ResponseEntity<ClienteMultiplosContactosDTO> clientesComMultiplosContactos() {
    return ResponseEntity.ok(service.clientesComMultiplosContactos());
  }

  @Operation(
      summary = "Faturamento por cliente",
      description = "Receitas por cliente: faturado, recebido, em aberto, % recebido e dias até o próximo vencimento pendente (negativo se em atraso)")
  @GetMapping("/faturamento-por-cliente")
  public ResponseEntity<List<ClienteFaturamentoDTO>> faturamentoPorCliente(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate de,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ate) {
    return ResponseEntity.ok(service.faturamentoPorCliente(de, ate));
  }

  @Operation(
      summary = "Resumo de faturamento",
      description = "Totais globais de receitas de clientes: faturado, recebido e em aberto")
  @GetMapping("/faturamento-resumo")
  public ResponseEntity<ClienteFaturamentoResumoDTO> faturamentoResumo(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate de,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ate) {
    return ResponseEntity.ok(service.faturamentoResumo(de, ate));
  }
}
