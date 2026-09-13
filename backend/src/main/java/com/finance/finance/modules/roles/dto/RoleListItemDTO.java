package com.finance.finance.modules.roles.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RoleListItemDTO {
    private Long id;
    private String codigo;
    private String nome;
    private String descricao;
    private boolean sistema;
    private long totalUsuarios;
}
