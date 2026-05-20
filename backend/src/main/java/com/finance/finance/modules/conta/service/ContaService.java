package com.finance.finance.modules.conta.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;
import com.finance.finance.modules.conta.dto.ContaRequestDTO;
import com.finance.finance.modules.conta.dto.ContaResponseDTO;
import com.finance.finance.modules.conta.dto.ContaStatusResponseDTO;
import com.finance.finance.modules.conta.mapper.ContaMapper;
import com.finance.finance.modules.conta.model.Conta;
import com.finance.finance.modules.conta.repository.ContaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContaService {

    private final ContaRepository contaRepository;

    @Transactional
    public ContaResponseDTO criar(ContaRequestDTO data) {
        if (data.getContaCorrente() != null && contaRepository.existsByContaCorrente(data.getContaCorrente())) {
            throw new BusinessException("Já existe uma conta com este número de conta corrente");
        }
        Conta conta = ContaMapper.toEntity(data);
        return ContaMapper.toResponse(contaRepository.save(conta));
    }

    @Transactional
    public ContaResponseDTO atualizar(Long id, ContaRequestDTO data) {
        Conta contaExistente = contaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada com id: " + id));

        if (data.getContaCorrente() != null &&
                contaRepository.existsByContaCorrenteAndIdNot(data.getContaCorrente(), id)) {
            throw new BusinessException("Já existe uma conta com este número de conta corrente");
        }

        ContaMapper.updateEntity(contaExistente, data);
        return ContaMapper.toResponse(contaRepository.save(contaExistente));
    }

    @Transactional
    public ContaStatusResponseDTO activarOuDesativar(Long id) {
        Conta conta = contaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada com id: " + id));

        String mensagem;
        if (conta.getSituacao() == Situacao.ATIVO) {
            conta.setSituacao(Situacao.INATIVO);
            mensagem = "Conta desativada com sucesso";
        } else {
            conta.setSituacao(Situacao.ATIVO);
            mensagem = "Conta ativada com sucesso";
        }

        contaRepository.save(conta);
        return new ContaStatusResponseDTO(conta.getId(), conta.getSituacao(), mensagem);
    }

    @Transactional(readOnly = true)
    public PageResponse<ContaResponseDTO> listar(String nome, Situacao situacao, PaginationRequest paginationRequest) {
        Pageable pageable = paginationRequest.toPageable("nome");
        Specification<Conta> spec = Specification.unrestricted();

        if (nome != null && !nome.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("nome")),
                    "%" + nome.trim().toLowerCase() + "%"));
        }
        if (situacao != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("situacao"), situacao));
        }

        return PageResponse.from(contaRepository.findAll(spec, pageable).map(ContaMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public ContaResponseDTO obterPorId(Long id) {
        Conta conta = contaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada com id: " + id));
        return ContaMapper.toResponse(conta);
    }
}
