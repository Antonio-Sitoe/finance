package com.finance.finance.modules.conta.controller;

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
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;
import com.finance.finance.modules.conta.dto.ContaRequestDTO;
import com.finance.finance.modules.conta.dto.ContaResponseDTO;
import com.finance.finance.modules.conta.dto.ContaStatusResponseDTO;
import com.finance.finance.modules.conta.service.ContaService;

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
@RequestMapping("/contas")
@RequiredArgsConstructor
@Tag(name = "Contas", description = "Endpoints para gestão de contas bancárias")
public class ContaController {

    private final ContaService service;

    @PostMapping
    @Operation(summary = "Criar conta", description = "Cria uma nova conta bancária.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Conta criada com sucesso", content = @Content(schema = @Schema(implementation = ContaResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou número de conta corrente já cadastrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Conflito de integridade de dados (constraint única violada a nível de BD)", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ContaResponseDTO> criar(
            @RequestBody @Validated(ContaRequestDTO.Create.class) ContaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar conta", description = "Atualiza parcialmente uma conta. Apenas os campos enviados são alterados.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Conta atualizada com sucesso", content = @Content(schema = @Schema(implementation = ContaResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou número de conta corrente já cadastrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Conta não encontrada", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Conflito de integridade de dados (constraint única violada a nível de BD)", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ContaResponseDTO> atualizar(
            @Parameter(description = "ID da conta", example = "1") @PathVariable Long id,
            @RequestBody @Validated(ContaRequestDTO.Update.class) ContaRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @PatchMapping("/{id}/situacao")
    @Operation(summary = "Ativar ou desativar conta", description = "Alterna a situação da conta entre ATIVO e INATIVO.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Situação alterada com sucesso", content = @Content(schema = @Schema(implementation = ContaStatusResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Conta não encontrada", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ContaStatusResponseDTO> activarOuDesativar(
            @Parameter(description = "ID da conta", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(service.activarOuDesativar(id));
    }

    @GetMapping
    @Operation(summary = "Listar contas", description = "Lista contas com paginação e filtros opcionais por nome e situação.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso", content = @Content(schema = @Schema(implementation = PageResponse.class)))
    })
    public ResponseEntity<PageResponse<ContaResponseDTO>> listar(
            @Parameter(description = "Filtro parcial por nome", example = "BCI") @RequestParam(required = false) String nome,
            @Parameter(description = "Filtro por situação", example = "ATIVO") @RequestParam(required = false) Situacao situacao,
            @Valid @ModelAttribute PaginationRequest paginationRequest) {
        return ResponseEntity.ok(service.listar(nome, situacao, paginationRequest));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter conta por ID", description = "Retorna uma conta específica pelo identificador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Conta encontrada", content = @Content(schema = @Schema(implementation = ContaResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Conta não encontrada", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ContaResponseDTO> obterPorId(
            @Parameter(description = "ID da conta", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(service.obterPorId(id));
    }
}
