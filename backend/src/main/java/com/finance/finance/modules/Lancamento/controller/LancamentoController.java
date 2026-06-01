package com.finance.finance.modules.Lancamento.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.finance.finance.exceptions.ApiErrorResponse;
import com.finance.finance.modules.Lancamento.dto.LancamentoParceladoRequestDto;
import com.finance.finance.modules.Lancamento.dto.LancamentoRequestDto;
import com.finance.finance.modules.Lancamento.dto.LancamentoResponseDTO;
import com.finance.finance.modules.Lancamento.dto.LancamentoStatusResponseDTO;
import com.finance.finance.modules.Lancamento.service.LancamentoService;
import com.finance.finance.modules.common.dto.BulkResponseDTO;
import com.finance.finance.modules.common.enums.PagamentoEnum;
import com.finance.finance.modules.common.enums.TipoLancamento;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/lancamentos")
@RequiredArgsConstructor
@Tag(name = "Lançamentos", description = "Endpoints para gestão de lançamentos financeiros")
public class LancamentoController {

        private final LancamentoService service;

        @PostMapping
        @Operation(summary = "Criar lançamento", description = "Cria um novo lançamento simples. Conta, categoria e tipo são obrigatórios.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Lançamento criado com sucesso", content = @Content(schema = @Schema(implementation = LancamentoResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Conta, categoria, cliente ou fornecedor não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoResponseDTO> criar(
                        @RequestBody @Validated(LancamentoRequestDto.Create.class) LancamentoRequestDto dto) {
                return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
        }

        @PostMapping("/bulk")
        @Operation(
                        summary = "Criar lançamentos em lote via CSV",
                        description = "Recebe um ficheiro CSV e cria múltiplos lançamentos. "
                                        + "Os itens válidos são gravados e os inválidos reportados em 'erros'. "
                                        + "Retorna 201 se todos criados, 207 se sucesso parcial, 422 se todos falharam.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Todos os lançamentos criados com sucesso", content = @Content(schema = @Schema(implementation = BulkResponseDTO.class))),
                        @ApiResponse(responseCode = "207", description = "Sucesso parcial — alguns itens falharam", content = @Content(schema = @Schema(implementation = BulkResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Ficheiro inválido ou em falta", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "422", description = "Todos os itens falharam", content = @Content(schema = @Schema(implementation = BulkResponseDTO.class)))
        })
        public ResponseEntity<BulkResponseDTO<LancamentoResponseDTO>> criarBulk(
                        @Parameter(description = "Ficheiro CSV com os lançamentos") @RequestParam MultipartFile file) {
                BulkResponseDTO<LancamentoResponseDTO> resultado = service.criarBulk(file);
                if (resultado.erros().isEmpty()) {
                        return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
                } else if (resultado.criados().isEmpty()) {
                        return ResponseEntity.status(422).body(resultado);
                } else {
                        return ResponseEntity.status(207).body(resultado);
                }
        }

        @PostMapping("/parcelado")
        @Operation(
                        summary = "Criar lançamento parcelado",
                        description = "Cria N lançamentos a partir de um valor total dividido em parcelas mensais. "
                                        + "A primeira parcela vence na data indicada; as seguintes avançam um mês cada.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Parcelas criadas com sucesso", content = @Content(schema = @Schema(implementation = LancamentoResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Conta, categoria, cliente ou fornecedor não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<List<LancamentoResponseDTO>> criarParcelado(
                        @RequestBody @Valid LancamentoParceladoRequestDto dto) {
                return ResponseEntity.status(HttpStatus.CREATED).body(service.criarParcelado(dto));
        }

        @PatchMapping("/{id}")
        @Operation(summary = "Atualizar lançamento", description = "Atualiza parcialmente um lançamento existente.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lançamento atualizado com sucesso", content = @Content(schema = @Schema(implementation = LancamentoResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Lançamento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoResponseDTO> atualizar(
                        @Parameter(description = "ID do lançamento", example = "1") @PathVariable Long id,
                        @RequestBody @Validated(LancamentoRequestDto.Update.class) LancamentoRequestDto dto) {
                return ResponseEntity.ok(service.atualizar(id, dto));
        }

        @PatchMapping("/{id}/situacao")
        @Operation(summary = "Alterar situação do lançamento", description = "Alterna a situação de pagamento do lançamento (ex.: PENDENTE → PAGO).")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Situação alterada com sucesso", content = @Content(schema = @Schema(implementation = LancamentoStatusResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Lançamento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoStatusResponseDTO> atualizarSituacao(
                        @Parameter(description = "ID do lançamento", example = "1") @PathVariable Long id) {
                return ResponseEntity.ok(service.atualizarSituacao(id));
        }

        @DeleteMapping("/{id}")
        @Operation(summary = "Eliminar lançamento", description = "Remove permanentemente um lançamento.")
        @ApiResponses({
                        @ApiResponse(responseCode = "204", description = "Lançamento eliminado com sucesso"),
                        @ApiResponse(responseCode = "404", description = "Lançamento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<Void> deletar(
                        @Parameter(description = "ID do lançamento", example = "1") @PathVariable Long id) {
                service.deletar(id);
                return ResponseEntity.noContent().build();
        }

        @GetMapping
        @Operation(summary = "Listar lançamentos", description = "Lista lançamentos com paginação e filtros opcionais por descrição, situação, tipo, conta, categoria, cliente, fornecedor e intervalo de datas.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso", content = @Content(schema = @Schema(implementation = PageResponse.class)))
        })
        public ResponseEntity<PageResponse<LancamentoResponseDTO>> listar(
                        @Parameter(description = "Filtro parcial por descrição", example = "Internet") @RequestParam(required = false) String descricao,
                        @Parameter(description = "Filtro por situação de pagamento", example = "PENDENTE") @RequestParam(required = false) PagamentoEnum situacao,
                        @Parameter(description = "Filtro por tipo", example = "DESPESA") @RequestParam(required = false) TipoLancamento tipo,
                        @Parameter(description = "Filtro por ID da conta", example = "1") @RequestParam(required = false) Long contaId,
                        @Parameter(description = "Filtro por ID da categoria", example = "3") @RequestParam(required = false) Long categoriaId,
                        @Parameter(description = "Filtro por ID do cliente", example = "5") @RequestParam(required = false) Long clienteId,
                        @Parameter(description = "Filtro por ID do fornecedor", example = "8") @RequestParam(required = false) Long fornecedorId,
                        @Parameter(description = "Data de lançamento inicial (ISO 8601)", example = "2026-01-01T00:00:00") @RequestParam(required = false) LocalDateTime dataLancamentoDe,
                        @Parameter(description = "Data de lançamento final (ISO 8601)", example = "2026-12-31T23:59:59") @RequestParam(required = false) LocalDateTime dataLancamentoAte,
                        @Parameter(description = "Data de vencimento inicial (ISO 8601)", example = "2026-01-01T00:00:00") @RequestParam(required = false) LocalDateTime dataVencimentoDe,
                        @Parameter(description = "Data de vencimento final (ISO 8601)", example = "2026-12-31T23:59:59") @RequestParam(required = false) LocalDateTime dataVencimentoAte,
                        @ModelAttribute PaginationRequest pagination) {
                return ResponseEntity.ok(service.listar(
                                descricao, situacao, tipo, contaId, categoriaId, clienteId, fornecedorId,
                                dataLancamentoDe, dataLancamentoAte, dataVencimentoDe, dataVencimentoAte,
                                pagination));
        }

        @GetMapping("/{id}")
        @Operation(summary = "Obter lançamento por ID", description = "Retorna um lançamento específico pelo identificador.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lançamento encontrado", content = @Content(schema = @Schema(implementation = LancamentoResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Lançamento não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoResponseDTO> obterPorId(
                        @Parameter(description = "ID do lançamento", example = "1") @PathVariable Long id) {
                return ResponseEntity.ok(service.obterPorId(id));
        }

        @GetMapping("/export/csv")
        @Operation(summary = "Exportar lançamentos para CSV", description = "Gera e descarrega todos os lançamentos em formato CSV (streaming).")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Ficheiro CSV gerado com sucesso")
        })
        public void exportarCsv(HttpServletResponse response) throws IOException {
                response.setContentType("text/csv; charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename=\"lancamentos.csv\"");
                service.exportarCsv(response.getWriter());
        }
}
