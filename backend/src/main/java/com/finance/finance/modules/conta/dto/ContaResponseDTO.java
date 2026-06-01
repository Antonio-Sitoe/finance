package com.finance.finance.modules.conta.dto;

import java.time.LocalDateTime;

import com.finance.finance.modules.common.enums.Situacao;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContaResponseDTO {

    private Long id;
    private String nome;
    private String agencia;
    private String contaCorrente;
    private String observacao;
    private LocalDateTime dataInclusao;
    private Situacao situacao;
}
