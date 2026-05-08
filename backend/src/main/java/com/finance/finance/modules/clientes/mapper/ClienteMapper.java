package com.finance.finance.modules.clientes.mapper;

import com.finance.finance.modules.clientes.dto.ClienteRequestDTO;
import com.finance.finance.modules.clientes.dto.ClienteResponseDTO;
import com.finance.finance.modules.clientes.model.Cliente;

public final class ClienteMapper {
    private ClienteMapper() {
    }

    public static Cliente toEntity(ClienteRequestDTO cliente) {
        Cliente clientMapper = new Cliente();
        clientMapper.setNomeEmpresarial(cliente.getNomeEmpresarial());
        clientMapper.setEmail(cliente.getEmail());
        clientMapper.setTelefone(cliente.getTelefone());
        clientMapper.setCep(cliente.getCep());
        clientMapper.setEndereco(cliente.getEndereco());
        clientMapper.setNumero(cliente.getNumero());
        clientMapper.setComplemento(cliente.getComplemento());
        clientMapper.setCidade(cliente.getCidade());
        clientMapper.setEstado(cliente.getEstado());
        clientMapper.setNota(cliente.getNota());
        clientMapper.setSituacao(cliente.getSituacao());
        return clientMapper;
    }

    public static ClienteResponseDTO toDto(Cliente cliente) {
        return ClienteResponseDTO.builder()
                .nomeEmpresarial(cliente.getNomeEmpresarial())
                .email(cliente.getEmail())
                .telefone(cliente.getTelefone())
                .cep(cliente.getCep())
                .endereco(cliente.getEndereco())
                .numero(cliente.getNumero())
                .complemento(cliente.getComplemento())
                .cidade(cliente.getCidade())
                .estado(cliente.getEstado())
                .nota(cliente.getNota())
                .situacao(cliente.getSituacao())
                .build();
    }
}
