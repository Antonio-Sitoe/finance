package com.finance.finance.modules.clientes.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.modules.clientes.dto.ClienteRankingResumoDTO;
import com.finance.finance.modules.clientes.dto.ClienteRequestDTO;
import com.finance.finance.modules.clientes.dto.ClienteResponseDTO;
import com.finance.finance.modules.clientes.dto.ClienteStatusResponseDTO;
import com.finance.finance.modules.clientes.mapper.ClienteMapper;
import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.clientes.repository.ClienteRepository;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;

import java.util.List;

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

    public ClienteResponseDTO atualizar(Long id, ClienteRequestDTO clienteAtualizado) {
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Cliente não encontrado"));

        ClienteMapper.updateEntityFromDto(clienteAtualizado, clienteExistente);

        Cliente clienteSalvo = clienteRepository.save(clienteExistente);

        return ClienteMapper.toDto(clienteSalvo);
    }

    public ClienteStatusResponseDTO activarOuDesativar(Long id) {
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Cliente não encontrado"));

        String mensagem;
        if (clienteExistente.getSituacao() == Situacao.ATIVO) {
            clienteExistente.setSituacao(Situacao.INATIVO);
            mensagem = "Cliente desativado com sucesso";
        } else {
            clienteExistente.setSituacao(Situacao.ATIVO);
            mensagem = "Cliente ativado com sucesso";
        }

        Cliente clienteSalvo = clienteRepository.save(clienteExistente);
        return new ClienteStatusResponseDTO(clienteSalvo.getId(), clienteSalvo.getSituacao(), mensagem);
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
    public PageResponse<ClienteResponseDTO> listar(String nome, Situacao situacao,
            PaginationRequest paginationRequest) {
        Pageable pageable = paginationRequest.toPageable("id");
        String nomeNormalizado = (nome == null) ? null : nome.trim();

        Page<Cliente> clientesPage;
        if (nomeNormalizado != null && !nomeNormalizado.isBlank() && situacao != null) {
            clientesPage = clienteRepository.findByNomeEmpresarialContainingIgnoreCaseAndSituacao(
                    nomeNormalizado,
                    situacao,
                    pageable);
        } else if (nomeNormalizado != null && !nomeNormalizado.isBlank()) {
            clientesPage = clienteRepository.findByNomeEmpresarialContainingIgnoreCase(nomeNormalizado, pageable);
        } else if (situacao != null) {
            clientesPage = clienteRepository.findBySituacao(situacao, pageable);
        } else {
            clientesPage = clienteRepository.findAll(pageable);
        }

        Page<ClienteResponseDTO> page = clientesPage
                .map(ClienteMapper::toDto);
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> todos() {
        return clienteRepository.findBySituacao(Situacao.ATIVO)
                .stream().map(ClienteMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponseDTO obterPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Cliente não encontrado"));
        return ClienteMapper.toDto(cliente);
    }

    @Transactional(readOnly = true)
    public ClienteRankingResumoDTO obterResumoRanking() {
        return clienteRepository.obterResumoRanking();
    }

}