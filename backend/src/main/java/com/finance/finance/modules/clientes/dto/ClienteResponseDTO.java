package com.finance.finance.modules.clientes.dto;

import com.finance.finance.modules.common.enums.Situacao;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClienteResponseDTO {
    private String nomeEmpresarial;
    private String email;
    private String telefone;
    private String cep;
    private String endereco;
    private String numero;
    private String complemento;
    private String cidade;
    private String estado;
    private Integer nota;
    private Situacao situacao;
}