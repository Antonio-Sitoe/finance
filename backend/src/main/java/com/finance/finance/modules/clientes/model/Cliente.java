package com.finance.finance.modules.clientes.model;

import com.finance.finance.modules.common.baseEntity.BaseEntity;
import com.finance.finance.modules.common.enums.Situacao;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "clientes")
public class Cliente extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_empresarial", nullable = false)
    private String nomeEmpresarial;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = true)
    private String telefone;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String numero;

    @Column(nullable = false)
    private String complemento;

    @Column(nullable = false)
    private String cidade;

    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private Integer nota;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Situacao situacao;
}