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
@Tag(name = "Lancamentos", description = "Endpoints para gestao de lancamentos financeiros")
public class LancamentoController {

        private final LancamentoService service;

        @PostMapping
        @Operation(summary = "Criar lancamento")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", content = @Content(schema = @Schema(implementation = LancamentoResponseDTO.class))),
                        @ApiResponse(responseCode = "400", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoResponseDTO> criar(
                        @RequestBody @Validated(LancamentoRequestDto.Create.class) LancamentoRequestDto dto) {
                return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
        }

        @PostMapping("/bulk")
        @Operation(summary = "Criar lancamentos em lote via CSV")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", content = @Content(schema = @Schema(implementation = BulkResponseDTO.class))),
                        @ApiResponse(responseCode = "207", content = @Content(schema = @Schema(implementation = BulkResponseDTO.class))),
                        @ApiResponse(responseCode = "400", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "422", content = @Content(schema = @Schema(implementation = BulkResponseDTO.class)))
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
        @Operation(summary = "Criar lancamento parcelado")
        @ApiResponses({
                        @ApiResponse(responseCode = "201"),
                        @ApiResponse(responseCode = "400", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<List<LancamentoResponseDTO>> criarParcelado(
                        @RequestBody @Valid LancamentoParceladoRequestDto dto) {
                return ResponseEntity.status(HttpStatus.CREATED).body(service.criarParcelado(dto));
        }

        @PatchMapping("/{id}")
        @Operation(summary = "Atualizar lancamento")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = LancamentoResponseDTO.class))),
                        @ApiResponse(responseCode = "400", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoResponseDTO> atualizar(
                        @PathVariable Long id,
                        @RequestBody @Validated(LancamentoRequestDto.Update.class) LancamentoRequestDto dto) {
                return ResponseEntity.ok(service.atualizar(id, dto));
        }

        @PatchMapping("/{id}/situacao")
        @Operation(summary = "Alterar situacao do lancamento")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = LancamentoStatusResponseDTO.class))),
                        @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoStatusResponseDTO> atualizarSituacao(@PathVariable Long id) {
                return ResponseEntity.ok(service.atualizarSituacao(id));
        }

        @DeleteMapping("/{id}")
        @Operation(summary = "Eliminar lancamento")
        @ApiResponses({
                        @ApiResponse(responseCode = "204"),
                        @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<Void> deletar(@PathVariable Long id) {
                service.deletar(id);
                return ResponseEntity.noContent().build();
        }

        @GetMapping
        @Operation(summary = "Listar lancamentos com filtros e paginacao")
        @ApiResponse(responseCode = "200")
        public ResponseEntity<PageResponse<LancamentoResponseDTO>> listar(
                        @RequestParam(required = false) String descricao,
                        @RequestParam(required = false) PagamentoEnum situacao,
                        @RequestParam(required = false) TipoLancamento tipo,
                        @RequestParam(required = false) Long contaId,
                        @RequestParam(required = false) Long categoriaId,
                        @RequestParam(required = false) Long clienteId,
                        @RequestParam(required = false) Long fornecedorId,
                        @RequestParam(required = false) LocalDateTime dataLancamentoDe,
                        @RequestParam(required = false) LocalDateTime dataLancamentoAte,
                        @RequestParam(required = false) LocalDateTime dataVencimentoDe,
                        @RequestParam(required = false) LocalDateTime dataVencimentoAte,
                        @ModelAttribute PaginationRequest pagination) {
                return ResponseEntity.ok(service.listar(
                                descricao, situacao, tipo, contaId, categoriaId, clienteId, fornecedorId,
                                dataLancamentoDe, dataLancamentoAte, dataVencimentoDe, dataVencimentoAte,
                                pagination));
        }

        @GetMapping("/{id}")
        @Operation(summary = "Obter lancamento por ID")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = LancamentoResponseDTO.class))),
                        @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<LancamentoResponseDTO> obterPorId(@PathVariable Long id) {
                return ResponseEntity.ok(service.obterPorId(id));
        }

        @GetMapping("/export/csv")
        @Operation(summary = "Exportar lancamentos para CSV em streaming")
        @ApiResponse(responseCode = "200")
        public void exportarCsv(HttpServletResponse response) throws IOException {
                response.setContentType("text/csv; charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename=\"lancamentos.csv\"");
                service.exportarCsv(response.getWriter());
        }
}