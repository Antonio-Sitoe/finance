package com.finance.finance.modules.roles.dto;

import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RoleDetailDTO {
    private Long id;
    private String codigo;
    private String nome;
    private String descricao;
    private boolean sistema;
    private Map<String, List<PermissaoGrantedDTO>> matriz;
}
