package com.finance.finance.modules.clientes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.finance.modules.clientes.dto.ClienteRequestDTO;
import com.finance.finance.modules.clientes.dto.ClienteResponseDTO;
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
    public ResponseEntity<ClienteResponseDTO> criar(@RequestBody @Valid ClienteRequestDTO dto) {
        System.out.println("Recebido ClienteRequestDTO: " + dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.criar(dto));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ClienteResponseDTO>> listar(
            @Valid @ModelAttribute PaginationRequest paginationRequest) {
        return ResponseEntity.ok(clienteService.listar(paginationRequest));
    }

}
