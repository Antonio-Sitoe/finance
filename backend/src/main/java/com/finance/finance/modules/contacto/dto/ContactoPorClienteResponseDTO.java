package com.finance.finance.modules.contacto.dto;

public record ContactoPorClienteResponseDTO(
        Long clienteId,
        String nome,
        Long total) {
}
