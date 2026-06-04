package com.finance.finance.modules.clientes.mapper;

import com.finance.finance.modules.clientes.dto.ClienteRequestDTO;
import com.finance.finance.modules.clientes.dto.ClienteResponseDTO;
import com.finance.finance.modules.clientes.model.Cliente;
import java.util.Optional;

public final class ClienteMapper {
    private ClienteMapper() {
    }

    public static Cliente toEntity(ClienteRequestDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNomeEmpresarial(dto.getNomeEmpresarial());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefone(dto.getTelefone());
        cliente.setEndereco(dto.getEndereco());
        cliente.setNumero(dto.getNumero());
        cliente.setComplemento(dto.getComplemento());
        cliente.setCidade(dto.getCidade());
        cliente.setEstado(dto.getEstado());
        cliente.setNota(dto.getNota());
        cliente.setSituacao(dto.getSituacao());
        return cliente;
    }

    public static void updateEntityFromDto(ClienteRequestDTO dto, Cliente cliente) {
        Optional.ofNullable(dto.getNomeEmpresarial()).ifPresent(cliente::setNomeEmpresarial);
        Optional.ofNullable(dto.getTelefone()).ifPresent(cliente::setTelefone);
        Optional.ofNullable(dto.getEndereco()).ifPresent(cliente::setEndereco);
        Optional.ofNullable(dto.getNumero()).ifPresent(cliente::setNumero);
        Optional.ofNullable(dto.getComplemento()).ifPresent(cliente::setComplemento);
        Optional.ofNullable(dto.getCidade()).ifPresent(cliente::setCidade);
        Optional.ofNullable(dto.getEstado()).ifPresent(cliente::setEstado);
        Optional.ofNullable(dto.getNota()).ifPresent(cliente::setNota);
        Optional.ofNullable(dto.getSituacao()).ifPresent(cliente::setSituacao);
    }

    public static ClienteResponseDTO toDto(Cliente cliente) {
        return ClienteResponseDTO.builder()
                .id(cliente.getId())
                .nomeEmpresarial(cliente.getNomeEmpresarial())
                .email(cliente.getEmail())
                .telefone(cliente.getTelefone())
                .endereco(cliente.getEndereco())
                .numero(cliente.getNumero())
                .complemento(cliente.getComplemento())
                .cidade(cliente.getCidade())
                .estado(cliente.getEstado())
                .nota(cliente.getNota())
                .situacao(cliente.getSituacao())
                .createdAt(cliente.getCreatedAt())
                .build();
    }
}
