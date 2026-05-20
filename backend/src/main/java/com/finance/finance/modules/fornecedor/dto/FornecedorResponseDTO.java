package com.finance.finance.modules.fornecedor.dto;

import com.finance.finance.modules.common.enums.Situacao;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FornecedorResponseDTO {

    private Long id;

    private String nomeEmpresarial;

    private String email;

    private String telefone;

    private String website;

    private String cep;

    private String endereco;

    private String numero;

    private String complemento;

    private String bairro;

    private String cidade;

    private String estado;

    private Integer nota;

    private Situacao situacao;
}