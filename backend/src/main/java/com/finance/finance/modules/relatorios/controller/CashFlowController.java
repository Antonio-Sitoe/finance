package com.finance.finance.modules.relatorios.controller;

import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import com.finance.finance.modules.relatorios.dto.capitalgiro.CapitalGiroDTO;
import com.finance.finance.modules.relatorios.dto.dre.DreDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDTO;
import com.finance.finance.modules.relatorios.dto.projecao.ProjecaoCaixaDTO;
import com.finance.finance.modules.relatorios.dto.recebimentospagamentos.InnerRecebimentosPagamentosDTO;

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

        @Operation(summary = "Recebimentos vs Pagamentos", description = """
                        Eficiência do período: previsto vs realizado para receitas e despesas.

                        Previsto = PENDENTE com vencimento no período.
                        Realizado = PAGO com data de lançamento no período.
                        Em atraso = PENDENTE com vencimento < hoje (posição actual).
                        Evolução mensal mostra receitas previstas vs realizadas por mês.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Relatório obtido com sucesso"),
                        @ApiResponse(responseCode = "400", description = "Período inválido")
        })
        @GetMapping("/recebimentos-pagamentos")
        public ResponseEntity<InnerRecebimentosPagamentosDTO> obterRecebimentosPagamentos(
                        @Parameter(description = "Data inicial (inclusiva)", example = "2025-05-01") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate de,
                        @Parameter(description = "Data final (inclusiva)", example = "2025-05-31") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ate) {
                return ResponseEntity.ok(service.obterRecebimentosPagamentos(de, ate));
        }

        @Operation(summary = "Projeção de Caixa", description = """
                        Projecta o saldo para os próximos 30, 60 e 90 dias com base em títulos PENDENTE.

                        Saldo actual = soma de todos os lançamentos PAGO (RECEITA − DESPESA).
                        Entradas/saídas previstas = PENDENTE com vencimento nos próximos N dias.
                        Risco de inadimplência = títulos RECEITA + PENDENTE + vencidos / saldo actual.
                        Inclui os principais devedores e insights automáticos.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Projeção obtida com sucesso")
        })
        @GetMapping("/projecao-caixa")
        public ResponseEntity<ProjecaoCaixaDTO> obterProjecaoCaixa() {
                return ResponseEntity.ok(service.obterProjecaoCaixa());
        }

}
