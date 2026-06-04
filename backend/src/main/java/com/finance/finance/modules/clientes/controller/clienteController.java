package com.finance.finance.modules.clientes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finance.finance.exceptions.ApiErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.finance.finance.modules.clientes.dto.ClienteRankingResumoDTO;
import com.finance.finance.modules.clientes.dto.ClienteRequestDTO;
import com.finance.finance.modules.clientes.dto.ClienteResponseDTO;
import com.finance.finance.modules.clientes.dto.ClienteStatusResponseDTO;
import com.finance.finance.modules.clientes.service.ClienteService;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
@Tag(name = "Clientes", description = "Endpoints para gestão de clientes")
public class clienteController {
        private final ClienteService clienteService;

        @PostMapping
        @Operation(summary = "Criar cliente", description = "Cria um novo cliente usando o grupo de validação Create.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Cliente criado com sucesso", content = @Content(schema = @Schema(implementation = ClienteResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<ClienteResponseDTO> criar(
                        @RequestBody @Validated(ClienteRequestDTO.Create.class) ClienteRequestDTO dto) {
                return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.criar(dto));
        }

        @PatchMapping("/{id}")
        @Operation(summary = "Atualizar cliente", description = "Atualiza parcialmente um cliente usando o grupo de validação Update.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Cliente atualizado com sucesso", content = @Content(schema = @Schema(implementation = ClienteResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Cliente não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<ClienteResponseDTO> atualizar(
                        @Parameter(description = "ID do cliente", example = "25") @PathVariable Long id,
                        @RequestBody @Validated(ClienteRequestDTO.Update.class) ClienteRequestDTO dto) {
                return ResponseEntity.ok(clienteService.atualizar(id, dto));
        }

        @PatchMapping("/{id}/situacao")
        @Operation(summary = "Ativar ou desativar cliente", description = "Alterna a situação do cliente entre ATIVO e INATIVO.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Situação alterada com sucesso", content = @Content(schema = @Schema(implementation = ClienteStatusResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Cliente não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<ClienteStatusResponseDTO> activarOuDesativar(@PathVariable Long id) {
                return ResponseEntity.ok(clienteService.activarOuDesativar(id));
        }

        @GetMapping
        @Operation(summary = "Listar clientes", description = "Lista clientes com paginação, ordenação e filtros opcionais por nome e situação.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso", content = @Content(schema = @Schema(implementation = PageResponse.class)))
        })
        public ResponseEntity<PageResponse<ClienteResponseDTO>> listar(
                        @Parameter(description = "Filtro parcial por nome empresarial", example = "Roberto") @RequestParam(required = false) String search,
                        @Parameter(description = "Filtro por situação do cliente", example = "ATIVO") @RequestParam(required = false) Situacao situacao,
                        @Valid @ModelAttribute PaginationRequest paginationRequest) {
                return ResponseEntity.ok(clienteService.listar(search, situacao, paginationRequest));
        }

        @GetMapping("/{id}")
        @Operation(summary = "Obter cliente por ID", description = "Retorna um cliente específico pelo identificador.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Cliente encontrado", content = @Content(schema = @Schema(implementation = ClienteResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Cliente não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<ClienteResponseDTO> obterPorId(
                        @Parameter(description = "ID do cliente", example = "25") @PathVariable Long id) {
                return ResponseEntity.ok(clienteService.obterPorId(id));
        }

        @GetMapping("/ranking")
        @Operation(summary = "Obter resumo do ranking de clientes")
        public ResponseEntity<ClienteRankingResumoDTO> obterResumoRanking() {
                return ResponseEntity.ok(clienteService.obterResumoRanking());
        }
}
