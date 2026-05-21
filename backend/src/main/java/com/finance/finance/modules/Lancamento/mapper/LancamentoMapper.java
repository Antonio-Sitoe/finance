package com.finance.finance.modules.Lancamento.mapper;

import java.util.Optional;

import com.finance.finance.modules.Lancamento.dto.LancamentoRequestDto;
import com.finance.finance.modules.Lancamento.dto.LancamentoResponseDTO;
import com.finance.finance.modules.Lancamento.model.Lancamento;
import com.finance.finance.modules.categoria.model.Categoria;
import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.common.dto.BasicReferenceDTO;
import com.finance.finance.modules.common.enums.PagamentoEnum;
import com.finance.finance.modules.conta.model.Conta;
import com.finance.finance.modules.fornecedor.model.Fornecedor;

public class LancamentoMapper {

        private LancamentoMapper() {
        }

        public static Lancamento toEntity(LancamentoRequestDto dto,
                        Conta conta, Categoria categoria, Cliente cliente, Fornecedor fornecedor) {
                return Lancamento.builder()
                                .descricao(dto.getDescricao())
                                .parcela(1)
                                .totalParcela(1)
                                .valor(dto.getValor())
                                .dataLancamento(dto.getDataLancamento())
                                .dataVencimento(dto.getDataVencimento())
                                .situacao(PagamentoEnum.PENDENTE)
                                .tipo(dto.getTipo())
                                .conta(conta)
                                .categoria(categoria)
                                .cliente(cliente)
                                .fornecedor(fornecedor)
                                .build();
        }

        public static LancamentoResponseDTO toDto(Lancamento l) {
                return LancamentoResponseDTO.builder()
                                .id(l.getId())
                                .descricao(l.getDescricao())
                                .parcela(l.getParcela())
                                .totalParcela(l.getTotalParcela())
                                .valor(l.getValor())
                                .dataLancamento(l.getDataLancamento())
                                .dataVencimento(l.getDataVencimento())
                                .situacao(l.getSituacao())
                                .tipo(l.getTipo())
                                .conta(toRef(l.getConta() != null ? l.getConta().getId() : null,
                                                l.getConta() != null ? l.getConta().getNome() : null))
                                .categoria(toRef(l.getCategoria() != null ? l.getCategoria().getId() : null,
                                                l.getCategoria() != null ? l.getCategoria().getNome() : null))
                                .cliente(toRef(l.getCliente() != null ? l.getCliente().getId() : null,
                                                l.getCliente() != null ? l.getCliente().getNomeEmpresarial() : null))
                                .fornecedor(toRef(l.getFornecedor() != null ? l.getFornecedor().getId() : null,
                                                l.getFornecedor() != null ? l.getFornecedor().getNomeEmpresarial()
                                                                : null))
                                .build();
        }

        public static void updateEntity(Lancamento lancamento, LancamentoRequestDto dto,
                        Conta conta, Categoria categoria, Cliente cliente, Fornecedor fornecedor) {
                Optional.ofNullable(dto.getDescricao()).ifPresent(lancamento::setDescricao);
                Optional.ofNullable(dto.getValor()).ifPresent(lancamento::setValor);
                Optional.ofNullable(dto.getDataLancamento()).ifPresent(lancamento::setDataLancamento);
                Optional.ofNullable(dto.getDataVencimento()).ifPresent(lancamento::setDataVencimento);
                Optional.ofNullable(dto.getTipo()).ifPresent(lancamento::setTipo);
                if (conta != null)
                        lancamento.setConta(conta);
                if (categoria != null)
                        lancamento.setCategoria(categoria);
                if (dto.getClienteId() != null)
                        lancamento.setCliente(cliente);
                if (dto.getFornecedorId() != null)
                        lancamento.setFornecedor(fornecedor);
        }

        private static BasicReferenceDTO toRef(Long id, String name) {
                if (id == null)
                        return null;
                return BasicReferenceDTO.builder().id(id).name(name).build();
        }
}
