package com.finance.finance.modules.Lancamento.model;

import com.finance.finance.modules.categoria.model.Categoria;
import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.common.baseEntity.BaseEntity;
import com.finance.finance.modules.common.enums.PagamentoEnum;
import com.finance.finance.modules.common.enums.TipoLancamento;
import com.finance.finance.modules.conta.model.Conta;
import com.finance.finance.modules.fornecedor.model.Fornecedor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "lancamentos")
public class Lancamento extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String descricao;

  @Column(nullable = false)
  private Integer parcela;

  @Column(name = "total_parcela", nullable = false)
  private Integer totalParcela;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal valor;

  @Column(name = "data_lancamento", nullable = false)
  private LocalDateTime dataLancamento;

  @Column(name = "data_vencimento", nullable = false)
  private LocalDateTime dataVencimento;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private PagamentoEnum situacao;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20, columnDefinition = "VARCHAR(20) DEFAULT 'DESPESA' NOT NULL")
  private TipoLancamento tipo;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_conta")
  private Conta conta;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_categoria")
  private Categoria categoria;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_cliente")
  private Cliente cliente;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_fornecedor")
  private Fornecedor fornecedor;
}