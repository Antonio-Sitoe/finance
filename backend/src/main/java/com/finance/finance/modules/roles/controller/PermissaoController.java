package com.finance.finance.modules.roles.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.finance.modules.roles.dto.PermissaoCatalogDTO;
import com.finance.finance.modules.roles.service.RoleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/permissoes")
@RequiredArgsConstructor
@Tag(name = "Permissões", description = "Catálogo de permissões (só ADMIN)")
public class PermissaoController {

    private final RoleService roleService;

    @GetMapping
    @Operation(summary = "Catálogo agrupado por módulo")
    public ResponseEntity<PermissaoCatalogDTO> catalogo() {
        return ResponseEntity.ok(roleService.catalogo());
    }
}
