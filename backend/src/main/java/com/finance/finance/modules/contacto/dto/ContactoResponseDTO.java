package com.finance.finance.modules.contacto.dto;

import java.time.LocalDateTime;

import com.finance.finance.modules.common.enums.Situacao;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(name = "ContactoResponse", description = "Representação de um contacto na API")
public record ContactoResponseDTO(
        Long id,
        String nome,
        String departamento,
        String email,
        String telefone,
        Situacao situacao,
        Long clienteId,
        String clienteNome,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
