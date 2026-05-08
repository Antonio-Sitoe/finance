package com.finance.finance.modules.clientes.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.modules.clientes.dto.ClienteRequestDTO;
import com.finance.finance.modules.clientes.dto.ClienteResponseDTO;
import com.finance.finance.modules.clientes.mapper.ClienteMapper;
import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.clientes.repository.ClienteRepository;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteResponseDTO criar(ClienteRequestDTO novoCliente) {
        validarEmailUnico(novoCliente.getEmail(), null);

        Cliente cliente = ClienteMapper.toEntity(novoCliente);

        Cliente clienteSalvo = clienteRepository.save(cliente);

        return ClienteMapper.toDto(clienteSalvo);
    }

    private void validarEmailUnico(String email, Long idAtual) {
        boolean emailEmUso = idAtual == null
                ? clienteRepository.existsByEmail(email)
                : clienteRepository.existsByEmailAndIdNot(email, idAtual);

        if (emailEmUso) {
            throw new BusinessException("Já existe um usuário cadastrado com este email");
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<ClienteResponseDTO> listar(PaginationRequest paginationRequest) {
        Pageable pageable = paginationRequest.toPageable("id");
        Page<ClienteResponseDTO> page = clienteRepository.findAll(pageable)
                .map(ClienteMapper::toDto);
        return PageResponse.from(page);
    }
}