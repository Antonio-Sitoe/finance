package com.finance.finance.modules.categoria.controller;

import java.util.List;

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
import com.finance.finance.modules.categoria.dto.CategoriaRequestDTO;
import com.finance.finance.modules.categoria.dto.CategoriaResponseDTO;
import com.finance.finance.modules.categoria.dto.CategoriaResumoDTO;
import com.finance.finance.modules.categoria.dto.CategoriaStatusResponseDTO;
import com.finance.finance.modules.categoria.dto.CategoriaValueLabelDTO;
import com.finance.finance.modules.categoria.service.CategoriaService;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
@Tag(name = "Categorias", description = "Endpoints para gestão de categorias de lançamentos")
public class CategoriaController {

        private final CategoriaService service;

        @PostMapping
        @Operation(summary = "Criar categoria", description = "Cria uma nova categoria. Pode ser raiz ou subcategoria de outra existente.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Categoria criada com sucesso", content = @Content(schema = @Schema(implementation = CategoriaResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Categoria pai não encontrada", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "422", description = "Já existe uma categoria com este nome neste nível", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<CategoriaResponseDTO> criar(
                        @RequestBody @Validated(CategoriaRequestDTO.Create.class) CategoriaRequestDTO dto) {
                return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
        }

        @PatchMapping("/{id}")
        @Operation(summary = "Atualizar categoria", description = "Atualiza parcialmente uma categoria. Apenas os campos enviados são alterados.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Categoria atualizada com sucesso", content = @Content(schema = @Schema(implementation = CategoriaResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Categoria não encontrada", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "422", description = "Já existe uma categoria com este nome neste nível ou categoria pai inválida", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<CategoriaResponseDTO> atualizar(
                        @Parameter(description = "ID da categoria", example = "1") @PathVariable Long id,
                        @RequestBody @Validated(CategoriaRequestDTO.Update.class) CategoriaRequestDTO dto) {
                return ResponseEntity.ok(service.atualizar(id, dto));
        }

        @PatchMapping("/{id}/situacao")
        @Operation(summary = "Ativar ou desativar categoria", description = "Alterna a situação da categoria entre ATIVO e INATIVO.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Situação alterada com sucesso", content = @Content(schema = @Schema(implementation = CategoriaStatusResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Categoria não encontrada", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<CategoriaStatusResponseDTO> activarOuDesativar(
                        @Parameter(description = "ID da categoria", example = "1") @PathVariable Long id) {
                return ResponseEntity.ok(service.activarOuDesativar(id));
        }

        @GetMapping
        @Operation(summary = "Listar categorias", description = "Lista categorias com paginação e filtros opcionais por nome, débito, crédito e situação.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso", content = @Content(schema = @Schema(implementation = PageResponse.class)))
        })
        public ResponseEntity<PageResponse<CategoriaResponseDTO>> listar(
                        @Parameter(description = "Filtro parcial por nome", example = "Receitas") @RequestParam(required = false) String nome,
                        @Parameter(description = "Filtrar categorias de débito", example = "true") @RequestParam(required = false) Boolean debito,
                        @Parameter(description = "Filtrar categorias de crédito", example = "true") @RequestParam(required = false) Boolean credito,
                        @Parameter(description = "Filtro por situação", example = "ATIVO") @RequestParam(required = false) Situacao situacao,
                        @Valid @ModelAttribute PaginationRequest paginationRequest) {
                return ResponseEntity.ok(service.listar(nome, debito, credito, situacao, paginationRequest));
        }

        @GetMapping("/resumo")
        @Operation(summary = "Obter resumo de categorias", description = "Retorna estatísticas agregadas das categorias: "
                        + "total registado, total de débito, total de crédito e total de inativas.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Resumo retornado com sucesso", content = @Content(schema = @Schema(implementation = CategoriaResumoDTO.class)))
        })
        public ResponseEntity<CategoriaResumoDTO> resumo() {
                return ResponseEntity.ok(service.getResumo());
        }

        @GetMapping("/all")
        @Operation(summary = "Listar todas as categorias (id e nome)", description = "Retorna todas as categorias num formato resumido (id e nome), sem paginação. "
                        + "Destinado a alimentar selects/dropdowns, como a escolha de categoria pai.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso", content = @Content(array = @ArraySchema(schema = @Schema(implementation = CategoriaValueLabelDTO.class))))
        })
        public ResponseEntity<List<CategoriaValueLabelDTO>> todos() {
                return ResponseEntity.ok(service.todos());
        }

        @GetMapping("/{id}")
        @Operation(summary = "Obter categoria por ID", description = "Retorna uma categoria específica pelo identificador, incluindo informação da categoria pai.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Categoria encontrada", content = @Content(schema = @Schema(implementation = CategoriaResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Categoria não encontrada", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<CategoriaResponseDTO> obterPorId(
                        @Parameter(description = "ID da categoria", example = "1") @PathVariable Long id) {
                return ResponseEntity.ok(service.obterPorId(id));
        }
}
