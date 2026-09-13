package com.finance.finance.modules.roles.dto;

import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PermissaoCatalogDTO {
    private Map<String, List<PermissaoItemDTO>> modulos;
}
