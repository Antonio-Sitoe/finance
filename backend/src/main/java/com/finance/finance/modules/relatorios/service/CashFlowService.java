package com.finance.finance.modules.relatorios.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import com.finance.finance.modules.common.enums.TipoLancamento;

import com.finance.finance.modules.relatorios.dto.dre.DreCategoriaDTO;
import com.finance.finance.modules.relatorios.dto.dre.DreCategoriaProjection;
import com.finance.finance.modules.relatorios.dto.dre.DreDTO;
import com.finance.finance.modules.relatorios.dto.dre.DreLancamentoDTO;
import com.finance.finance.modules.relatorios.dto.dre.DreLancamentoProjection;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDiaDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDiaProjection;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioLancamentoDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioLancamentoProjection;
import com.finance.finance.modules.relatorios.mapper.CashFlowMapper;

import com.finance.finance.modules.relatorios.repository.CashFlowRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CashFlowService {
        private final CashFlowRepository repository;

        @SuppressWarnings("null")
        @Transactional(readOnly = true)
        public FluxoDiarioDTO obterFluxoDiario(LocalDate de, LocalDate ate, boolean incluirDetalhes) {
                if (de.isAfter(ate)) {
                        throw new IllegalArgumentException("A data inicial não pode ser posterior à data final");
                }

                BigDecimal saldoInicial = repository.obterSaldoInicialFluxo(de);
                List<FluxoDiarioDiaProjection> diasProjection = repository.obterFluxoDiario(de, ate);

                Map<LocalDate, List<FluxoDiarioLancamentoDTO>> lancamentosPorDia = Map.of();
                if (incluirDetalhes) {
                        lancamentosPorDia = repository.obterLancamentosFluxoDiario(de, ate).stream()
                                        .collect(Collectors.groupingBy(
                                                        FluxoDiarioLancamentoProjection::getDia,
                                                        Collectors.mapping(CashFlowMapper::toLancamentoDTO,
                                                                        Collectors.toList())));
                }

                BigDecimal totalEntradas = BigDecimal.ZERO;
                BigDecimal totalSaidas = BigDecimal.ZERO;
                List<FluxoDiarioDiaDTO> dias = new ArrayList<>();

                for (FluxoDiarioDiaProjection dia : diasProjection) {
                        totalEntradas = totalEntradas.add(dia.getEntradas());
                        totalSaidas = totalSaidas.add(dia.getSaidas());

                        dias.add(CashFlowMapper.toDiaDTO(dia,
                                        lancamentosPorDia.getOrDefault(dia.getDia(), List.of())));
                }

                BigDecimal saldoFinal = dias.isEmpty()
                                ? saldoInicial
                                : dias.get(dias.size() - 1).saldoAcumulado();

                return CashFlowMapper.toFluxoDiarioDTO(de, ate, saldoInicial, totalEntradas, totalSaidas, saldoFinal,
                                dias);
        }

        @Transactional(readOnly = true)
        public DreDTO obterDre(LocalDate de, LocalDate ate) {
                if (de.isAfter(ate)) {
                        throw new IllegalArgumentException("A data inicial não pode ser posterior à data final");
                }

                List<DreCategoriaProjection> categorias = repository.obterDreCategorias(de, ate);

                Map<Long, List<DreLancamentoDTO>> lancamentosPorCategoria = repository
                                .obterDreLancamentos(de, ate).stream()
                                .collect(Collectors.groupingBy(
                                                DreLancamentoProjection::getCategoriaId,
                                                Collectors.mapping(CashFlowMapper::toDreLancamentoDTO,
                                                                Collectors.toList())));

                BigDecimal totalReceitas = CashFlowMapper.somarPorTipo(categorias, TipoLancamento.RECEITA);
                BigDecimal totalDespesas = CashFlowMapper.somarPorTipo(categorias, TipoLancamento.DESPESA);

                List<DreCategoriaDTO> receitas = categorias.stream()
                                .filter(c -> TipoLancamento.RECEITA.name().equals(c.getTipo()))
                                .map(c -> CashFlowMapper.toDreCategoriaDTO(c, totalReceitas, lancamentosPorCategoria))
                                .toList();

                List<DreCategoriaDTO> despesas = categorias.stream()
                                .filter(c -> TipoLancamento.DESPESA.name().equals(c.getTipo()))
                                .map(c -> CashFlowMapper.toDreCategoriaDTO(c, totalDespesas, lancamentosPorCategoria))
                                .toList();

                return CashFlowMapper.toDreDTO(de, ate, totalReceitas, totalDespesas, receitas, despesas);
        }
}
