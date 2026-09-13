package com.finance.finance.modules.roles.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.finance.finance.exceptions.ApiErrorResponse;
import com.finance.finance.modules.roles.dto.RoleCreateRequestDTO;
import com.finance.finance.modules.roles.dto.RoleDetailDTO;
import com.finance.finance.modules.roles.dto.RoleListItemDTO;
import com.finance.finance.modules.roles.dto.RoleUpdateRequestDTO;
import com.finance.finance.modules.roles.service.RoleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@Tag(name = "Roles", description = "Gestão de roles e matriz de permissões (só ADMIN)")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @Operation(summary = "Listar roles")
    public ResponseEntity<List<RoleListItemDTO>> listar() {
        return ResponseEntity.ok(roleService.listar());
    }

    @PostMapping
    @Operation(summary = "Criar role")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Role criada", content = @Content(schema = @Schema(implementation = RoleListItemDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<RoleListItemDTO> criar(@Valid @RequestBody RoleCreateRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roleService.criar(dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalhe da role com matriz")
    public ResponseEntity<RoleDetailDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar role e permissões")
    public ResponseEntity<RoleDetailDTO> atualizar(@PathVariable Long id,
            @Valid @RequestBody RoleUpdateRequestDTO dto) {
        return ResponseEntity.ok(roleService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Apagar role")
    public void apagar(@PathVariable Long id) {
        roleService.apagar(id);
    }
}
