package com.finance.finance.modules.contacto.dto;

import lombok.Builder;

@Builder
public record ContactoEstatisticasResponseDTO(
                long totalEmpresas,
                long totalContactos,
                double mediaContactosPorEmpresa,
                long empresasComContactos,
                long empresasSemContactos) {
}
