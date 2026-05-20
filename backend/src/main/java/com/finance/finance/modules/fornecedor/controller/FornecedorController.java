package com.finance.finance.modules.fornecedor.controller;

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
import com.finance.finance.modules.fornecedor.dto.FornecedorRequestDTO;
import com.finance.finance.modules.fornecedor.dto.FornecedorResponseDTO;
import com.finance.finance.modules.fornecedor.dto.FornecedorStatusResponseDTO;
import com.finance.finance.modules.fornecedor.service.FornecedorService;

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
@RequestMapping("/fornecedores")
@RequiredArgsConstructor
@Tag(name = "Fornecedores", description = "Endpoints para gestão de fornecedores")
public class FornecedorController {

    private final FornecedorService service;

    @PostMapping
    @Operation(summary = "Criar fornecedor", description = "Cria um novo fornecedor.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Fornecedor criado com sucesso", content = @Content(schema = @Schema(implementation = FornecedorResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "422", description = "Email já cadastrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<FornecedorResponseDTO> criar(
            @RequestBody @Validated(FornecedorRequestDTO.Create.class) FornecedorRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar fornecedor", description = "Atualiza parcialmente um fornecedor. Apenas os campos enviados são alterados.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fornecedor atualizado com sucesso", content = @Content(schema = @Schema(implementation = FornecedorResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Fornecedor não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "422", description = "Email já cadastrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<FornecedorResponseDTO> atualizar(
            @Parameter(description = "ID do fornecedor", example = "1") @PathVariable Long id,
            @RequestBody @Validated(FornecedorRequestDTO.Update.class) FornecedorRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @PatchMapping("/{id}/situacao")
    @Operation(summary = "Ativar ou desativar fornecedor", description = "Alterna a situação do fornecedor entre ATIVO e INATIVO.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Situação alterada com sucesso", content = @Content(schema = @Schema(implementation = FornecedorStatusResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Fornecedor não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<FornecedorStatusResponseDTO> activarOuDesativar(
            @Parameter(description = "ID do fornecedor", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(service.activarOuDesativar(id));
    }

    @GetMapping
    @Operation(summary = "Listar fornecedores", description = "Lista fornecedores com paginação e filtros opcionais por nome e situação.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso", content = @Content(schema = @Schema(implementation = PageResponse.class)))
    })
    public ResponseEntity<PageResponse<FornecedorResponseDTO>> listar(
            @Parameter(description = "Filtro parcial por nome empresarial", example = "Tech") @RequestParam(required = false) String nome,
            @Parameter(description = "Filtro por situação", example = "ATIVO") @RequestParam(required = false) Situacao situacao,
            @Valid @ModelAttribute PaginationRequest paginationRequest) {
        return ResponseEntity.ok(service.listar(nome, situacao, paginationRequest));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter fornecedor por ID", description = "Retorna um fornecedor específico pelo identificador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fornecedor encontrado", content = @Content(schema = @Schema(implementation = FornecedorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Fornecedor não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<FornecedorResponseDTO> obterPorId(
            @Parameter(description = "ID do fornecedor", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(service.obterPorId(id));
    }
}
