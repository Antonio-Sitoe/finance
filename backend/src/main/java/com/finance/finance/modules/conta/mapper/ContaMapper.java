package com.finance.finance.modules.conta.mapper;

import java.time.LocalDateTime;
import java.util.Optional;

import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.conta.dto.ContaRequestDTO;
import com.finance.finance.modules.conta.dto.ContaResponseDTO;
import com.finance.finance.modules.conta.model.Conta;

public class ContaMapper {

    private ContaMapper() {
    }

    public static Conta toEntity(ContaRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Conta conta = new Conta();
        conta.setNome(dto.getNome());
        conta.setAgencia(dto.getAgencia());
        conta.setContaCorrente(dto.getContaCorrente());
        conta.setObservacao(dto.getObservacao());
        conta.setDataInclusao(LocalDateTime.now());
        conta.setSituacao(dto.getSituacao() != null ? dto.getSituacao() : Situacao.ATIVO);

        return conta;
    }

    public static ContaResponseDTO toResponse(Conta conta) {
        if (conta == null) {
            return null;
        }

        return ContaResponseDTO.builder()
                .id(conta.getId())
                .nome(conta.getNome())
                .agencia(conta.getAgencia())
                .contaCorrente(conta.getContaCorrente())
                .observacao(conta.getObservacao())
                .dataInclusao(conta.getDataInclusao())
                .situacao(conta.getSituacao())
                .build();
    }

    public static void updateEntity(Conta conta, ContaRequestDTO dto) {
        Optional.ofNullable(dto.getNome()).ifPresent(conta::setNome);
        Optional.ofNullable(dto.getAgencia()).ifPresent(conta::setAgencia);
        Optional.ofNullable(dto.getContaCorrente()).ifPresent(conta::setContaCorrente);
        Optional.ofNullable(dto.getObservacao()).ifPresent(conta::setObservacao);
        Optional.ofNullable(dto.getSituacao()).ifPresent(conta::setSituacao);
    }
}
