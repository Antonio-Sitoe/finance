package com.finance.finance.modules.contacto.dto;

import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.common.enums.Situacao;
import lombok.Builder;

@Builder
public record ContactoResponseDTO(
        Long id,
        String nome,
        String departamento,
        String email,
        String telefone,
        Situacao situacao,
        Cliente cliente) {
}
