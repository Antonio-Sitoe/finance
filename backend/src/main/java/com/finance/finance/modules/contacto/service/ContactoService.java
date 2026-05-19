package com.finance.finance.modules.contacto.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.clientes.repository.ClienteRepository;
import com.finance.finance.modules.contacto.dto.ContactoRequestDTO;
import com.finance.finance.modules.contacto.dto.ContactoResponseDTO;
import com.finance.finance.modules.contacto.mapper.ContactoMapper;
import com.finance.finance.modules.contacto.model.Contacto;
import com.finance.finance.modules.contacto.repository.ContactoRepository;

@Service
@RequiredArgsConstructor
public class ContactoService {
        private final ContactoRepository contactoRepository;
        private final ClienteRepository clienteRepository;

        public ContactoResponseDTO criar(ContactoRequestDTO novoContacto) {
                Cliente cliente = validateCheckCliente(novoContacto);
                Contacto contacto = ContactoMapper.toEntity(novoContacto, cliente);
                Contacto contactoSalvo = contactoRepository.save(contacto);
                return ContactoMapper.toDto(contactoSalvo);
        }

        public Cliente validateCheckCliente(ContactoRequestDTO contacto) {
                Cliente cliente = clienteRepository.findById(contacto.getClienteId())
                                .orElseThrow(() -> new BusinessException("Cliente não encontrado"));

                String conflict = contactoRepository.checkConflictByClienteIdAndEmailAndTelefone(
                                contacto.getClienteId(),
                                contacto.getEmail(),
                                contacto.getTelefone());

                if ("email".equals(conflict)) {
                        throw new BusinessException("Já existe um contacto com este email para este cliente");
                }
                if ("telefone".equals(conflict)) {
                        throw new BusinessException("Já existe um contacto com este telefone para este cliente");
                }

                return cliente;
        }

}
