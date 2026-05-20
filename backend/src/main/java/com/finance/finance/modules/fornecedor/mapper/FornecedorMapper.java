package com.finance.finance.modules.fornecedor.mapper;

import java.util.Optional;

import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.fornecedor.dto.FornecedorRequestDTO;
import com.finance.finance.modules.fornecedor.dto.FornecedorResponseDTO;
import com.finance.finance.modules.fornecedor.model.Fornecedor;

public class FornecedorMapper {

    private FornecedorMapper() {
    }

    public static Fornecedor toEntity(FornecedorRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Fornecedor fornecedor = new Fornecedor();

        fornecedor.setNomeEmpresarial(dto.getNomeEmpresarial());
        fornecedor.setEmail(dto.getEmail());
        fornecedor.setTelefone(dto.getTelefone());
        fornecedor.setWebsite(dto.getWebsite());
        fornecedor.setEndereco(dto.getEndereco());
        fornecedor.setNumero(dto.getNumero());
        fornecedor.setComplemento(dto.getComplemento());
        fornecedor.setBairro(dto.getBairro());
        fornecedor.setCidade(dto.getCidade());
        fornecedor.setEstado(dto.getEstado());
        fornecedor.setNota(dto.getNota());
        fornecedor.setSituacao(dto.getSituacao() != null
                ? dto.getSituacao()
                : Situacao.ATIVO);

        return fornecedor;
    }

    public static FornecedorResponseDTO toResponse(Fornecedor fornecedor) {
        if (fornecedor == null) {
            return null;
        }

        return FornecedorResponseDTO.builder()
                .id(fornecedor.getId())
                .nomeEmpresarial(fornecedor.getNomeEmpresarial())
                .email(fornecedor.getEmail())
                .telefone(fornecedor.getTelefone())
                .website(fornecedor.getWebsite())
                .endereco(fornecedor.getEndereco())
                .numero(fornecedor.getNumero())
                .complemento(fornecedor.getComplemento())
                .bairro(fornecedor.getBairro())
                .cidade(fornecedor.getCidade())
                .estado(fornecedor.getEstado())
                .nota(fornecedor.getNota())
                .situacao(fornecedor.getSituacao())
                .build();

    }

    public static void updateEntity(
            Fornecedor fornecedor,
            FornecedorRequestDTO dto) {
        Optional.ofNullable(dto.getNomeEmpresarial()).ifPresent(fornecedor::setNomeEmpresarial);
        Optional.ofNullable(dto.getTelefone()).ifPresent(fornecedor::setTelefone);
        Optional.ofNullable(dto.getWebsite()).ifPresent(fornecedor::setWebsite);
        Optional.ofNullable(dto.getEndereco()).ifPresent(fornecedor::setEndereco);
        Optional.ofNullable(dto.getNumero()).ifPresent(fornecedor::setNumero);
        Optional.ofNullable(dto.getComplemento()).ifPresent(fornecedor::setComplemento);
        Optional.ofNullable(dto.getBairro()).ifPresent(fornecedor::setBairro);
        Optional.ofNullable(dto.getCidade()).ifPresent(fornecedor::setCidade);
        Optional.ofNullable(dto.getEstado()).ifPresent(fornecedor::setEstado);
        Optional.ofNullable(dto.getNota()).ifPresent(fornecedor::setNota);
        Optional.ofNullable(dto.getSituacao()).ifPresent(fornecedor::setSituacao);
    }
}