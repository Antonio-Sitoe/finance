package com.finance.finance.modules.fornecedor.model;

import com.finance.finance.modules.common.baseEntity.BaseEntity;
import com.finance.finance.modules.common.enums.Situacao;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fornecedor")
public class Fornecedor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_empresarial", nullable = false)
    private String nomeEmpresarial;

    @Column(unique = true)
    private String email;

    @Column(length = 15)
    private String telefone;

    private String website;

    private String endereco;

    private String numero;

    private String complemento;

    private String bairro;

    private String cidade;

    @Column(length = 2)
    private String estado;

    private Integer nota;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Situacao situacao;
}