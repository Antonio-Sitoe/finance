package com.finance.finance.modules.contacto.controller;

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
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;
import com.finance.finance.modules.contacto.dto.ContactoPorClienteResponseDTO;
import com.finance.finance.modules.contacto.dto.ContactoRequestDTO;
import com.finance.finance.modules.contacto.dto.ContactoResponseDTO;
import com.finance.finance.modules.contacto.dto.ContactoStatusResponseDTO;
import com.finance.finance.modules.contacto.service.ContactoService;

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
@RequestMapping("/contactos")
@RequiredArgsConstructor
@Tag(name = "Contactos", description = "Endpoints para gestão de contactos")
public class ContactoController {

        private final ContactoService service;

        @PostMapping
        @Operation(summary = "Criar contacto", description = "Cria um novo contacto vinculado a um cliente.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Contacto criado com sucesso", content = @Content(schema = @Schema(implementation = ContactoResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Cliente não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "422", description = "Email ou telefone já existe para este cliente", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<ContactoResponseDTO> criar(
                        @RequestBody @Validated(ContactoRequestDTO.Create.class) ContactoRequestDTO dto) {
                return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
        }

        @PatchMapping("/{id}")
        @Operation(summary = "Atualizar contacto", description = "Atualiza parcialmente um contacto. Apenas os campos enviados são alterados.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Contacto atualizado com sucesso", content = @Content(schema = @Schema(implementation = ContactoResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Contacto não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
                        @ApiResponse(responseCode = "422", description = "Email ou telefone já existe para este cliente", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<ContactoResponseDTO> atualizar(
                        @Parameter(description = "ID do contacto", example = "1") @PathVariable Long id,
                        @RequestBody @Validated(ContactoRequestDTO.Update.class) ContactoRequestDTO dto) {
                return ResponseEntity.ok(service.atualizar(id, dto));
        }

        @PatchMapping("/{id}/situacao")
        @Operation(summary = "Ativar ou desativar contacto", description = "Alterna a situação do contacto entre ATIVO e INATIVO.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Situação alterada com sucesso", content = @Content(schema = @Schema(implementation = ContactoStatusResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Contacto não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<ContactoStatusResponseDTO> activarOuDesativar(
                        @Parameter(description = "ID do contacto", example = "1") @PathVariable Long id) {
                return ResponseEntity.ok(service.activarOuDesativar(id));
        }

        @GetMapping
        @Operation(summary = "Listar contactos", description = "Lista contactos com paginação e filtros opcionais por cliente, nome, departamento e situação.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso", content = @Content(schema = @Schema(implementation = PageResponse.class)))
        })
        public ResponseEntity<PageResponse<ContactoResponseDTO>> listar(
                        @Parameter(description = "Filtrar por ID do cliente") @RequestParam(required = false) Long clienteId,
                        @Parameter(description = "Filtro parcial por nome", example = "João") @RequestParam(required = false) String nome,
                        @Parameter(description = "Filtro parcial por departamento", example = "TI") @RequestParam(required = false) String departamento,
                        @Parameter(description = "Filtro por situação", example = "ATIVO") @RequestParam(required = false) Situacao situacao,
                        @Valid @ModelAttribute PaginationRequest paginationRequest) {
                return ResponseEntity.ok(service.listar(clienteId, nome, departamento, situacao, paginationRequest));
        }

        @GetMapping("/{id}")
        @Operation(summary = "Obter contacto por ID", description = "Retorna um contacto específico pelo identificador.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Contacto encontrado", content = @Content(schema = @Schema(implementation = ContactoResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Contacto não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<ContactoResponseDTO> obterPorId(
                        @Parameter(description = "ID do contacto", example = "1") @PathVariable Long id) {
                return ResponseEntity.ok(service.obterPorId(id));
        }

        @GetMapping("/cliente/{clienteId}")
        @Operation(summary = "Listar contactos por cliente", description = "Lista contactos associados a um cliente específico.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso", content = @Content(schema = @Schema(implementation = PageResponse.class)))
        })
        public ResponseEntity<List<ContactoResponseDTO>> listarPorCliente(
                        @Parameter(description = "ID do cliente", example = "1") @PathVariable Long clienteId) {
                return ResponseEntity.ok(service.listarPorCliente(clienteId));
        }

        @GetMapping("/por-cliente")
        @Operation(summary = "Contar contactos por cliente", description = "Retorna a contagem de contactos agrupada por cliente.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Contagem retornada com sucesso", content = @Content(schema = @Schema(implementation = ContactoPorClienteResponseDTO.class)))
        })
        public ResponseEntity<List<ContactoPorClienteResponseDTO>> contactosPorClientesEstaticticas() {
                return ResponseEntity.ok(service.contactosPorClientesEstaticticas());
        }
}
