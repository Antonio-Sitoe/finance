package com.finance.finance.modules.roles.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PermissaoItemDTO {
    private Long id;
    private String codigo;
    private String acao;
    private String metodo;
    private String path;
    private String descricao;
}
