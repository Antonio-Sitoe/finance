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
import org.springframework.web.bind.annotation.RestController;

import com.finance.finance.modules.clientes.dto.ClienteRequestDTO;
import com.finance.finance.modules.clientes.dto.ClienteResponseDTO;
import com.finance.finance.modules.clientes.dto.ClienteStatusResponseDTO;
import com.finance.finance.modules.clientes.service.ClienteService;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class clienteController {
    private final ClienteService clienteService;

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> criar(
            @RequestBody @Validated(ClienteRequestDTO.Create.class) ClienteRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.criar(dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Validated(ClienteRequestDTO.Update.class) ClienteRequestDTO dto) {
        return ResponseEntity.ok(clienteService.atualizar(id, dto));
    }

    @PatchMapping("/{id}/situacao")
    public ResponseEntity<ClienteStatusResponseDTO> activarOuDesativar(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.activarOuDesativar(id));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ClienteResponseDTO>> listar(
            @Valid @ModelAttribute PaginationRequest paginationRequest) {
        return ResponseEntity.ok(clienteService.listar(paginationRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.obterPorId(id));
    }
}
