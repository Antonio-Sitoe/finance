package com.finance.finance.modules.categoria.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import com.finance.finance.modules.categoria.dto.CategoriaRequestDTO;
import com.finance.finance.modules.categoria.dto.CategoriaResponseDTO;
import com.finance.finance.modules.categoria.dto.CategoriaResumoDTO;
import com.finance.finance.modules.categoria.dto.CategoriaStatusResponseDTO;
import com.finance.finance.modules.categoria.dto.CategoriaValueLabelDTO;
import com.finance.finance.modules.categoria.mapper.CategoriaMapper;
import com.finance.finance.modules.categoria.model.Categoria;
import com.finance.finance.modules.categoria.repository.CategoriaRepository;
import com.finance.finance.modules.categoria.utils.CategoriaHelper;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaHelper categoriaHelper;

    @Transactional
    public CategoriaResponseDTO criar(CategoriaRequestDTO data) {
        Categoria categoriaPai = categoriaHelper.resolverCategoriaPai(data.getCategoriaPaiId());
        categoriaHelper.validarNomeUnico(data.getNome(), data.getCategoriaPaiId(), null);

        Categoria categoria = CategoriaMapper.toEntity(data, categoriaPai);
        return CategoriaMapper.toResponse(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponseDTO atualizar(Long id, CategoriaRequestDTO data) {
        Categoria categoriaExistente = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + id));

        if (data.getCategoriaPaiId() != null && data.getCategoriaPaiId().equals(id)) {
            throw new BusinessException("Uma categoria não pode ser pai de si mesma");
        }

        Categoria categoriaPai = categoriaHelper.resolverCategoriaPai(data.getCategoriaPaiId());

        if (data.getNome() != null) {
            categoriaHelper.validarNomeUnico(data.getNome(), data.getCategoriaPaiId(), id);
        }

        CategoriaMapper.updateEntity(categoriaExistente, data, categoriaPai);
        return CategoriaMapper.toResponse(categoriaRepository.save(categoriaExistente));
    }

    @Transactional
    public CategoriaStatusResponseDTO activarOuDesativar(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + id));

        String mensagem;
        if (categoria.getSituacao() == Situacao.ATIVO) {
            categoria.setSituacao(Situacao.INATIVO);
            mensagem = "Categoria desativada com sucesso";
        } else {
            categoria.setSituacao(Situacao.ATIVO);
            mensagem = "Categoria ativada com sucesso";
        }

        categoriaRepository.save(categoria);
        return new CategoriaStatusResponseDTO(categoria.getId(), categoria.getSituacao(), mensagem);
    }

    @Transactional(readOnly = true)
    public PageResponse<CategoriaResponseDTO> listar(String nome, Boolean debito, Boolean credito,
            Situacao situacao, PaginationRequest paginationRequest) {

        Pageable pageable = paginationRequest.toPageable("nome");
        Specification<Categoria> spec = Specification.unrestricted();

        if (nome != null && !nome.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("nome")),
                    "%" + nome.trim().toLowerCase() + "%"));
        }
        if (debito != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("debito"), debito));
        }
        if (credito != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("credito"), credito));
        }
        if (situacao != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("situacao"), situacao));
        }

        return PageResponse.from(categoriaRepository.findAll(spec, pageable).map(CategoriaMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public List<CategoriaValueLabelDTO> todos() {
        return categoriaRepository.findAll(Sort.by(Sort.Direction.ASC, "nome")).stream()
                .map(categoria -> CategoriaValueLabelDTO.builder()
                        .id(categoria.getId())
                        .nome(categoria.getNome())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResumoDTO getResumo() {
        return categoriaRepository.getResumo();
    }

    @Transactional(readOnly = true)
    public CategoriaResponseDTO obterPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + id));
        return CategoriaMapper.toResponse(categoria);
    }
}
