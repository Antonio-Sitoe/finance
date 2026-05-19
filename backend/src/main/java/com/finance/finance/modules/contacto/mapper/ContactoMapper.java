package com.finance.finance.modules.contacto.mapper;

import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.contacto.dto.ContactoRequestDTO;
import com.finance.finance.modules.contacto.dto.ContactoResponseDTO;
import com.finance.finance.modules.contacto.model.Contacto;

public final class ContactoMapper {

    public static Contacto toEntity(ContactoRequestDTO contactoRequestDTO, Cliente cliente) {
        return Contacto.builder()
                .nome(contactoRequestDTO.getNome())
                .departamento(contactoRequestDTO.getDepartamento())
                .email(contactoRequestDTO.getEmail())
                .telefone(contactoRequestDTO.getTelefone())
                .situacao(contactoRequestDTO.getSituacao())
                .cliente(cliente)
                .build();
    }

    public static ContactoResponseDTO toDto(Contacto contacto) {
        return ContactoResponseDTO.builder()
                .id(contacto.getId())
                .nome(contacto.getNome())
                .departamento(contacto.getDepartamento())
                .email(contacto.getEmail())
                .telefone(contacto.getTelefone())
                .situacao(contacto.getSituacao())
                .cliente(contacto.getCliente())
                .build();
    }
}
