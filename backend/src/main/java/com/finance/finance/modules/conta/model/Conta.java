package com.finance.finance.modules.conta.model;

import java.time.LocalDateTime;

import com.finance.finance.modules.common.baseEntity.BaseEntity;
import com.finance.finance.modules.common.enums.Situacao;

import lombok.*;
import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contas")
public class Conta extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String nome;

  @Column(nullable = false)
  private String agencia;

  @Column(nullable = false)
  private String observacao;

  @Column(name = "conta_corrente", nullable = false)
  private String contaCorrente;

  @Column(name = "data_inclusao", nullable = false, updatable = false)
  private LocalDateTime dataInclusao;

  @Enumerated(EnumType.STRING)
  @Column(name = "situacao", nullable = false)
  private Situacao situacao;
}
