package com.finance.finance.modules.categoria.model;

import com.finance.finance.modules.common.baseEntity.BaseEntity;
import com.finance.finance.modules.common.enums.Situacao;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "categoria")
public class Categoria extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "nome", nullable = false, length = 255)
  private String nome;

  @Column(name = "debito")
  private Boolean debito;

  @Column(name = "credito")
  private Boolean credito;

  @ManyToOne
  @JoinColumn(name = "id_pai", referencedColumnName = "id")
  private Categoria categoriaPai;

  @Column(name = "descricao", columnDefinition = "TEXT")
  private String descricao;

  @Enumerated(EnumType.STRING)
  @Column(name = "situacao", nullable = false)
  private Situacao situacao;
}