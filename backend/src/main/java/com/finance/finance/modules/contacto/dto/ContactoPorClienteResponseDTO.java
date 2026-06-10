package com.finance.finance.modules.contacto.dto;

import lombok.Builder;

@Builder
public record ContactoPorClienteResponseDTO(
                Long clienteId,
                String nome,
                Long total) {
}
