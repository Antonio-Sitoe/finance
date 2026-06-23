package com.finance.finance.modules.relatorios.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finance.finance.modules.relatorios.dto.search.GlobalSearchResultDTO;
import com.finance.finance.modules.common.dto.BasicLabelValueDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioAnualDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioCategoriaDto;
import com.finance.finance.modules.relatorios.dto.RelatorioPercentual;
import com.finance.finance.modules.relatorios.dto.RelatorioPorCategoria;
import com.finance.finance.modules.relatorios.dto.dashboard.DashboardAlertDTO;
import com.finance.finance.modules.relatorios.dto.dashboard.DashboardDTO;
import com.finance.finance.modules.relatorios.dto.dashboard.DashboardReceitaDispesas;
import com.finance.finance.modules.relatorios.service.RelatorioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Relatórios", description = "Endpoints para geração de relatórios e análises financeiras")
@RestController
@RequestMapping("/analitics")
@RequiredArgsConstructor
public class RelatorioController {

        private final RelatorioService service;

        @Operation(summary = "Pesquisa global", description = "Pesquisa em clientes, fornecedores e lançamentos pelo termo fornecido. "
                        + "Devolve os resultados agrupados por entidade, com dados ricos para apresentação. "
                        + "Use 'limit' para controlar o nº máximo de itens por grupo (0 = todos, para a página de pesquisa).")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Resultados encontrados com sucesso"),
                        @ApiResponse(responseCode = "400", description = "Parâmetro de pesquisa em falta")
        })
        @GetMapping("/search")
        public GlobalSearchResultDTO search(
                        @Parameter(description = "Termo de pesquisa (mínimo 1 caractere)", example = "João") @RequestParam String q,
                        @Parameter(description = "Máximo de resultados por grupo (0 = sem limite)", example = "5") @RequestParam(required = false, defaultValue = "5") Integer limit) {
                return service.globalSearch(q, limit);
        }

        @Operation(summary = "Relatório anual", description = "Retorna o resumo financeiro do ano corrente: total de lançamentos, saldo anual e detalhamento mensal.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Relatório gerado com sucesso"),
                        @ApiResponse(responseCode = "500", description = "Erro interno ao gerar o relatório")
        })
        @GetMapping("/relatorio-anual")
        public ResponseEntity<RelatorioAnualDTO> gerarRelatorioAnual() {
                return ResponseEntity.ok(service.gerarRelatorioAnual());
        }

        @Operation(summary = "Relatório percentual por situação", description = "Retorna a distribuição dos lançamentos agrupados por situação de pagamento (ex.: PAGO, PENDENTE), "
                        + "com quantidade, soma de valores e percentagem em relação ao total.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Relatório gerado com sucesso"),
                        @ApiResponse(responseCode = "500", description = "Erro interno ao gerar o relatório")
        })
        @GetMapping("/relatorio-percentual")
        public ResponseEntity<RelatorioPercentual> gerarRelatorioPercentual() {
                return ResponseEntity.ok(service.gerarRelatorioPercentual());
        }

        @Operation(summary = "Dashboard financeiro", description = "Retorna os indicadores do mês corrente: total de receitas, total de despesas, "
                        + "saldo actual (lançamentos pagos), contas a pagar e contas a receber.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Dashboard gerado com sucesso"),
                        @ApiResponse(responseCode = "500", description = "Erro interno ao gerar o dashboard")
        })
        @GetMapping("/dashboard")
        public ResponseEntity<DashboardDTO> gerarDashboard() {
                return ResponseEntity.ok(service.gerarDashboard());
        }

        @Operation(summary = "Relatório por categoria", description = "Retorna o total de lançamentos e o valor agregado agrupados por categoria.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Relatório gerado com sucesso"),
                        @ApiResponse(responseCode = "500", description = "Erro interno ao gerar o relatório")
        })
        @GetMapping("/relatorio-categoria")
        public ResponseEntity<List<RelatorioPorCategoria>> gerarRelatorioCategoria() {
                return ResponseEntity.ok(service.realizarRelatorioCategoria());
        }

        @GetMapping("/alertas")
        @Operation(summary = "Obter alertas financeiros", description = """
                        Retorna indicadores financeiros que exigem atenção imediata.

                        Inclui:
                        - Valor total de receitas vencidas;
                        - Valor total de despesas vencidas;
                        - Quantidade de lançamentos que vencem hoje.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Alertas financeiros obtidos com sucesso"),
                        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
        })
        public ResponseEntity<DashboardAlertDTO> obterAlertas() {

                return ResponseEntity.ok(
                                service.obterAlertas());
        }

        @Operation(summary = "Estatísticas por conta", description = "Retorna as estatísticas de lançamentos agrupados por conta, incluindo as três principais contas com maior movimentação.")
        @ApiResponses({
                @ApiResponse(responseCode = "200", description = "Estatísticas retornadas com sucesso"),
                @ApiResponse(responseCode = "500", description = "Erro interno ao gerar as estatísticas")
        })
        @GetMapping("/por-conta")
        public ResponseEntity<List<BasicLabelValueDTO<BigDecimal>>> obterEstatisticasPorContas() {
                return ResponseEntity.ok(
                                service.obterEstatisticasPorContas());
        }

        @Operation(summary = "Receita vs Despesas", description = "Retorna a comparação mensal entre receitas e despesas dos últimos 6 meses, permitindo analisar a evolução financeira ao longo do tempo.")
        @ApiResponses({
                @ApiResponse(responseCode = "200", description = "Comparativo retornado com sucesso"),
                @ApiResponse(responseCode = "500", description = "Erro interno ao gerar o comparativo")
        })
        @GetMapping("/receita-vs-despesas")
        public ResponseEntity<List<DashboardReceitaDispesas>> obterReceitaVsDespesas() {
                return ResponseEntity.ok(
                                service.obterReceitaVsDespesas());
        }

        @Operation(summary = "Top categorias (débito)", description = "Retorna as três principais categorias com maior valor total em lançamentos de débito, ordenadas por valor decrescente.")
        @ApiResponses({
                @ApiResponse(responseCode = "200", description = "Top categorias retornadas com sucesso"),
                @ApiResponse(responseCode = "500", description = "Erro interno ao gerar o relatório")
        })
        @GetMapping("/top-categoria")
        public ResponseEntity<List<RelatorioCategoriaDto>> relatorioCategoria() {
                return ResponseEntity.ok(service.obterRelatorioCategoria());
        }
}
