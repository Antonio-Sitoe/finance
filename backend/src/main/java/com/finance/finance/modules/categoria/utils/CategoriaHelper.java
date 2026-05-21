package com.finance.finance.modules.categoria.utils;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import com.finance.finance.modules.categoria.dto.CategoriaRequestDTO;
import com.finance.finance.modules.categoria.mapper.CategoriaMapper;
import com.finance.finance.modules.categoria.model.Categoria;
import com.finance.finance.modules.categoria.repository.CategoriaRepository;
import com.finance.finance.modules.common.dto.BulkErroDTO;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CategoriaHelper {

    private final CategoriaRepository categoriaRepository;

    public Categoria resolverCategoriaPai(Long categoriaPaiId) {
        if (categoriaPaiId == null) {
            return null;
        }
        return categoriaRepository.findById(categoriaPaiId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria pai não encontrada com id: " + categoriaPaiId));
    }

    public void validarNomeUnico(String nome, Long categoriaPaiId, Long idExcluir) {
        boolean existe;
        if (idExcluir == null) {
            existe = categoriaPaiId == null
                    ? categoriaRepository.existsByNomeAndCategoriaPaiIsNull(nome)
                    : categoriaRepository.existsByNomeAndCategoriaPaiId(nome, categoriaPaiId);
        } else {
            existe = categoriaPaiId == null
                    ? categoriaRepository.existsByNomeAndCategoriaPaiIsNullAndIdNot(nome, idExcluir)
                    : categoriaRepository.existsByNomeAndCategoriaPaiIdAndIdNot(nome, categoriaPaiId, idExcluir);
        }
        if (existe) {
            throw new BusinessException("Já existe uma categoria com este nome neste nível");
        }
    }

    public CategoriaBulkProcessResult processarBulk(List<CategoriaRequestDTO> dtos) {
        Set<String> nomesNoBatch = new HashSet<>();
        List<Categoria> paraGravar = new ArrayList<>();
        List<BulkErroDTO> erros = new ArrayList<>();

        for (int i = 0; i < dtos.size(); i++) {
            CategoriaRequestDTO dto = dtos.get(i);
            int pos = i + 1;
            String nomeDisplay = CategoriaUtils.getNomeDisplay(dto.getNome(), pos);

            try {
                if (dto.getNome() == null || dto.getNome().isBlank()) {
                    erros.add(new BulkErroDTO(pos, nomeDisplay, "Nome é obrigatório"));
                    continue;
                }
                if (dto.getSituacao() == null) {
                    erros.add(new BulkErroDTO(pos, nomeDisplay, "Situação é obrigatória"));
                    continue;
                }
                if (!nomesNoBatch.add(CategoriaUtils.buildChaveDuplicata(dto.getNome(), dto.getCategoriaPaiId()))) {
                    erros.add(new BulkErroDTO(pos, nomeDisplay, "Nome duplicado na lista enviada"));
                    continue;
                }

                Categoria categoriaPai = resolverCategoriaPai(dto.getCategoriaPaiId());
                validarNomeUnico(dto.getNome(), dto.getCategoriaPaiId(), null);
                paraGravar.add(CategoriaMapper.toEntity(dto, categoriaPai));

            } catch (BusinessException | ResourceNotFoundException e) {
                erros.add(new BulkErroDTO(pos, nomeDisplay, e.getMessage()));
            }
        }

        return new CategoriaBulkProcessResult(paraGravar, erros);
    }
}
