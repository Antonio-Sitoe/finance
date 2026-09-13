package com.finance.finance.modules.roles.model;

import com.finance.finance.modules.common.baseEntity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Entity
@Table(name = "permissao")
public class Permissao extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String codigo;

    @Column(nullable = false, length = 60)
    private String modulo;

    @Column(nullable = false, length = 60)
    private String acao;

    @Column(nullable = false, length = 10)
    private String metodo;

    @Column(name = "path_pattern", nullable = false, length = 255)
    private String pathPattern;

    @Column(length = 255)
    private String descricao;
}
