package com.finance.finance.modules.fornecedor.service;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.domain.Specification;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.fornecedor.model.Fornecedor;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.fornecedor.mapper.FornecedorMapper;
import com.finance.finance.modules.common.pagination.PaginationRequest;
import com.finance.finance.modules.fornecedor.dto.FornecedorRequestDTO;
import com.finance.finance.modules.fornecedor.dto.FornecedorResponseDTO;
import com.finance.finance.modules.fornecedor.dto.FornecedorResumoDTO;
import com.finance.finance.modules.fornecedor.dto.FornecedorResumoProjection;
import com.finance.finance.modules.fornecedor.dto.FornecedorStatusResponseDTO;
import com.finance.finance.modules.fornecedor.repository.FornecedorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FornecedorService {
    private final FornecedorRepository fornecedorRepository;

    @Transactional
    public FornecedorResponseDTO criar(FornecedorRequestDTO data) {
        if (data.getEmail() != null && fornecedorRepository.existsByEmail(data.getEmail())) {
            throw new BusinessException("Email já cadastrado");
        }
        Fornecedor fornecedor = FornecedorMapper.toEntity(data);
        return FornecedorMapper.toResponse(fornecedorRepository.save(fornecedor));
    }

    @Transactional
    public FornecedorResponseDTO atualizar(Long id, FornecedorRequestDTO data) {
        Fornecedor fornecedorExistente = fornecedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + id));

        if (data.getEmail() != null &&
                !data.getEmail().equals(fornecedorExistente.getEmail()) &&
                fornecedorRepository.existsByEmail(data.getEmail())) {
            throw new BusinessException("Email já cadastrado");
        }

        FornecedorMapper.updateEntity(fornecedorExistente, data);
        return FornecedorMapper.toResponse(fornecedorRepository.save(fornecedorExistente));
    }

    @Transactional
    public FornecedorStatusResponseDTO activarOuDesativar(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + id));

        String mensagem;
        if (fornecedor.getSituacao() == Situacao.ATIVO) {
            fornecedor.setSituacao(Situacao.INATIVO);
            mensagem = "Fornecedor desativado com sucesso";
        } else {
            fornecedor.setSituacao(Situacao.ATIVO);
            mensagem = "Fornecedor ativado com sucesso";
        }

        fornecedorRepository.save(fornecedor);
        return new FornecedorStatusResponseDTO(fornecedor.getId(), fornecedor.getSituacao(), mensagem);
    }

    @Transactional(readOnly = true)
    public PageResponse<FornecedorResponseDTO> listar(String nome, Situacao situacao,
            Integer notaMin, Integer notaMax, PaginationRequest paginationRequest) {

        Pageable pageable = paginationRequest.toPageable("nomeEmpresarial");
        Specification<Fornecedor> spec = Specification.unrestricted();

        if (nome != null && !nome.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("nomeEmpresarial")),
                    "%" + nome.trim().toLowerCase() + "%"));
        }
        if (situacao != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("situacao"), situacao));
        }
        if (notaMin != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("nota"), notaMin));
        }
        if (notaMax != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("nota"), notaMax));
        }
        return PageResponse.from(fornecedorRepository.findAll(spec, pageable).map(FornecedorMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public FornecedorResponseDTO obterPorId(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + id));
        return FornecedorMapper.toResponse(fornecedor);
    }

    @Transactional(readOnly = true)
    public FornecedorResumoDTO getResumo() {
        FornecedorResumoProjection p = fornecedorRepository.getResumoFornecedor();

        return new FornecedorResumoDTO(
                p.getTotal(),
                p.getTotalAtivos(),
                p.getTotalInativos(),
                p.getAltaConformidade());
    }
}
