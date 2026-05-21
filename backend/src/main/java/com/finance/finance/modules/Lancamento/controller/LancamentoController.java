package com.finance.finance.modules.Lancamento.controller;

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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/lancamentos")
@RequiredArgsConstructor
@Tag(name = "Lancamentos", description = "Endpoints para gestao de lancamentos financeiros")
public class LancamentoController {

        private final LancamentoService service;

        @PostMapping
        @Operation(summary = "Criar lancamento", description = "Cria um lancamento simples com parcela unica.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Lancamento criado com sucesso", content = @Content(schema = @Schema(implementation = LancamentoResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Dados invalidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Conta, categoria, cliente ou fornecedor nao encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoResponseDTO> criar(
                        @RequestBody @Validated(LancamentoRequestDto.Create.class) LancamentoRequestDto dto) {
                return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
        }

        @PostMapping("/bulk")
        @Operation(summary = "Criar lancamentos em lote via CSV", description = "Processa um ficheiro CSV com lancamentos simples e parcelados. "
                        + "Itens validos sao gravados; invalidos reportados em 'erros' sem bloquear os restantes. "
                        + "Retorna 201 se todos criados, 207 se parcial, 422 se todos falharam.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Todos os lancamentos criados com sucesso", content = @Content(schema = @Schema(implementation = BulkResponseDTO.class))),
                        @ApiResponse(responseCode = "207", description = "Sucesso parcial", content = @Content(schema = @Schema(implementation = BulkResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Ficheiro invalido", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "422", description = "Todos os itens falharam", content = @Content(schema = @Schema(implementation = BulkResponseDTO.class)))
        })
        public ResponseEntity<BulkResponseDTO<LancamentoResponseDTO>> criarBulk(
                        @RequestParam("file") MultipartFile file) {
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
        @Operation(summary = "Criar lancamento parcelado", description = "Gera N registos de parcelas a partir de um valor total. O vencimento avanca um mes por parcela.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Parcelas criadas com sucesso"),
                        @ApiResponse(responseCode = "400", description = "Dados invalidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Conta, categoria, cliente ou fornecedor nao encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<List<LancamentoResponseDTO>> criarParcelado(
                        @RequestBody @Valid LancamentoParceladoRequestDto dto) {
                return ResponseEntity.status(HttpStatus.CREATED).body(service.criarParcelado(dto));
        }

        @PatchMapping("/{id}")
        @Operation(summary = "Atualizar lancamento", description = "Atualiza parcialmente um lancamento existente.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lancamento atualizado com sucesso", content = @Content(schema = @Schema(implementation = LancamentoResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Dados invalidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Lancamento nao encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoResponseDTO> atualizar(
                        @Parameter(description = "ID do lancamento", example = "1") @PathVariable Long id,
                        @RequestBody @Validated(LancamentoRequestDto.Update.class) LancamentoRequestDto dto) {
                return ResponseEntity.ok(service.atualizar(id, dto));
        }

        @PatchMapping("/{id}/situacao")
        @Operation(summary = "Alterar situacao do lancamento", description = "Alterna a situacao do lancamento entre PENDENTE e PAGO.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Situacao alterada com sucesso", content = @Content(schema = @Schema(implementation = LancamentoStatusResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Lancamento nao encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoStatusResponseDTO> atualizarSituacao(
                        @Parameter(description = "ID do lancamento", example = "1") @PathVariable Long id) {
                return ResponseEntity.ok(service.atualizarSituacao(id));
        }

        @DeleteMapping("/{id}")
        @Operation(summary = "Eliminar lancamento", description = "Remove permanentemente um lancamento pelo ID.")
        @ApiResponses({
                        @ApiResponse(responseCode = "204", description = "Lancamento eliminado com sucesso"),
                        @ApiResponse(responseCode = "404", description = "Lancamento nao encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<Void> deletar(
                        @Parameter(description = "ID do lancamento", example = "1") @PathVariable Long id) {
                service.deletar(id);
                return ResponseEntity.noContent().build();
        }

        @GetMapping
        @Operation(summary = "Listar lancamentos", description = "Lista lancamentos com filtros e paginacao.")
        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
        public ResponseEntity<PageResponse<LancamentoResponseDTO>> listar(
                        @Parameter(description = "Filtrar por descricao (parcial)") @RequestParam(required = false) String descricao,
                        @Parameter(description = "Filtrar por situacao: PENDENTE ou PAGO") @RequestParam(required = false) PagamentoEnum situacao,
                        @Parameter(description = "Filtrar por tipo: RECEITA ou DESPESA") @RequestParam(required = false) TipoLancamento tipo,
                        @Parameter(description = "Filtrar por ID da conta") @RequestParam(required = false) Long contaId,
                        @Parameter(description = "Filtrar por ID da categoria") @RequestParam(required = false) Long categoriaId,
                        @Parameter(description = "Filtrar por ID do cliente") @RequestParam(required = false) Long clienteId,
                        @Parameter(description = "Filtrar por ID do fornecedor") @RequestParam(required = false) Long fornecedorId,
                        @Parameter(description = "Data de lancamento a partir de (ISO 8601)") @RequestParam(required = false) LocalDateTime dataLancamentoDe,
                        @Parameter(description = "Data de lancamento ate (ISO 8601)") @RequestParam(required = false) LocalDateTime dataLancamentoAte,
                        @Parameter(description = "Data de vencimento a partir de (ISO 8601)") @RequestParam(required = false) LocalDateTime dataVencimentoDe,
                        @Parameter(description = "Data de vencimento ate (ISO 8601)") @RequestParam(required = false) LocalDateTime dataVencimentoAte,
                        @ModelAttribute PaginationRequest pagination) {
                return ResponseEntity.ok(service.listar(
                                descricao, situacao, tipo, contaId, categoriaId, clienteId, fornecedorId,
                                dataLancamentoDe, dataLancamentoAte, dataVencimentoDe, dataVencimentoAte,
                                pagination));
        }

        @GetMapping("/{id}")
        @Operation(summary = "Obter lancamento por ID", description = "Retorna os detalhes de um lancamento especifico.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lancamento encontrado", content = @Content(schema = @Schema(implementation = LancamentoResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Lancamento nao encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoResponseDTO> obterPorId(
                        @Parameter(description = "ID do lancamento", example = "1") @PathVariable Long id) {
                return ResponseEntity.ok(service.obterPorId(id));
        }
}