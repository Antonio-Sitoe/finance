package com.finance.finance.modules.clientes.dto;

import com.finance.finance.modules.common.enums.Situacao;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClienteResponseDTO {
    private Long id;
    private String nomeEmpresarial;
    private String email;
    private String telefone;
    private String endereco;
    private String numero;
    private String complemento;
    private String cidade;
    private String estado;
    private Integer nota;
    private Situacao situacao;
    private LocalDateTime createdAt;
}
