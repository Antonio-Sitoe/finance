package com.finance.finance.modules.roles.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleUpdateRequestDTO {

    @NotBlank
    @Size(max = 100)
    private String nome;

    @Size(max = 255)
    private String descricao;

    @NotNull
    private List<Long> permissaoIds;
}
