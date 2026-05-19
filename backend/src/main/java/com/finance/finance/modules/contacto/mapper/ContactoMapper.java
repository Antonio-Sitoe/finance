package com.finance.finance.modules.contacto.mapper;

import java.util.Optional;

import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.contacto.dto.ContactoRequestDTO;
import com.finance.finance.modules.contacto.dto.ContactoResponseDTO;
import com.finance.finance.modules.contacto.model.Contacto;

public final class ContactoMapper {

    private ContactoMapper() {
    }

    public static Contacto toEntity(ContactoRequestDTO dto, Cliente cliente) {
        return Contacto.builder()
                .nome(dto.getNome())
                .departamento(dto.getDepartamento())
                .email(dto.getEmail())
                .telefone(dto.getTelefone())
                .situacao(dto.getSituacao())
                .cliente(cliente)
                .build();
    }

    public static void updateEntityFromDto(ContactoRequestDTO dto, Contacto contacto) {
        Optional.ofNullable(dto.getNome()).ifPresent(contacto::setNome);
        Optional.ofNullable(dto.getDepartamento()).ifPresent(contacto::setDepartamento);
        Optional.ofNullable(dto.getEmail()).ifPresent(contacto::setEmail);
        Optional.ofNullable(dto.getTelefone()).ifPresent(contacto::setTelefone);
        Optional.ofNullable(dto.getSituacao()).ifPresent(contacto::setSituacao);
    }

    public static ContactoResponseDTO toDto(Contacto contacto) {
        return ContactoResponseDTO.builder()
                .id(contacto.getId())
                .nome(contacto.getNome())
                .departamento(contacto.getDepartamento())
                .email(contacto.getEmail())
                .telefone(contacto.getTelefone())
                .situacao(contacto.getSituacao())
                .clienteId(contacto.getCliente().getId())
                .clienteNome(contacto.getCliente().getNomeEmpresarial())
                .createdAt(contacto.getCreatedAt())
                .updatedAt(contacto.getUpdatedAt())
                .build();
    }
}
