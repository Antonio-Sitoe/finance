package com.finance.finance.modules.relatorios.controller;

import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import com.finance.finance.modules.relatorios.dto.capitalgiro.CapitalGiroDTO;
import com.finance.finance.modules.relatorios.dto.dre.DreDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finance.finance.modules.relatorios.service.CashFlowService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Fluxo de caixa", description = "Endpoints para geração de relatórios e análises financeiras")
@RestController
@RequestMapping("/cash-flow")
@RequiredArgsConstructor
public class CashFlowController {

        private final CashFlowService service;

        @Operation(summary = "Fluxo de caixa diário", description = """
                        Retorna o fluxo de caixa diário para o período indicado.

                        Inclui saldo inicial, totais de entradas/saídas, saldo final e
                        detalhamento dia a dia com saldo acumulado. Apenas lançamentos
                        com situação PAGO e data de lançamento no período são considerados.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Fluxo diário obtido com sucesso"),
                        @ApiResponse(responseCode = "400", description = "Período inválido")
        })
        @GetMapping("/fluxo-diario")
        public ResponseEntity<FluxoDiarioDTO> obterFluxoDiario(
                        @Parameter(description = "Data inicial (inclusiva)", example = "2025-05-01") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate de,
                        @Parameter(description = "Data final (inclusiva)", example = "2025-05-31") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ate,
                        @Parameter(description = "Incluir lançamentos individuais por dia") @RequestParam(required = false, defaultValue = "true") boolean incluirDetalhes) {
                return ResponseEntity.ok(service.obterFluxoDiario(de, ate, incluirDetalhes));
        }

        @Operation(summary = "Mini DRE", description = """
                        Retorna a Demonstração de Resultado (receitas x despesas) do período indicado.

                        Inclui o resumo (totais de receitas, despesas, resultado líquido e margem)
                        e o detalhamento por categoria, com os lançamentos de cada categoria.
                        Apenas lançamentos com situação PAGO e data de lançamento no período são considerados.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "DRE obtido com sucesso"),
                        @ApiResponse(responseCode = "400", description = "Período inválido")
        })
        @GetMapping("/dre")
        public ResponseEntity<DreDTO> obterDre(
                        @Parameter(description = "Data inicial (inclusiva)", example = "2025-05-01") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate de,
                        @Parameter(description = "Data final (inclusiva)", example = "2025-05-31") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ate) {
                return ResponseEntity.ok(service.obterDre(de, ate));
        }

        @Operation(summary = "Capital de Giro", description = """
                        Retorna a posição de curto prazo com base em títulos PENDENTE não vencidos.

                        Activo circulante = RECEITA + PENDENTE + vencimento >= hoje.
                        Passivo circulante = DESPESA + PENDENTE + vencimento >= hoje.
                        Capital de giro = Activo − Passivo. Liquidez corrente = Activo ÷ Passivo.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Capital de giro obtido com sucesso")
        })
        @GetMapping("/capital-giro")
        public ResponseEntity<CapitalGiroDTO> obterCapitalGiro() {
                return ResponseEntity.ok(service.obterCapitalGiro());
        }

}
