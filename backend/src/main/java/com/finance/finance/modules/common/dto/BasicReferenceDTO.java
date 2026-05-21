package com.finance.finance.modules.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(name = "IdNameDTO", description = "DTO genérico para representar entidades com id e nome")
@Builder
public record BasicReferenceDTO(
        @Schema(description = "ID da entidade", example = "1") Long id,
        @Schema(description = "Nome da entidade", example = "Conta Principal BCI") String name) {
}