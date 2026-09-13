package com.finance.finance.modules.auth.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String role;
    private List<String> permissoes;
    private LocalDateTime ultimoAcesso;
    private LocalDateTime criadoEm;
}
