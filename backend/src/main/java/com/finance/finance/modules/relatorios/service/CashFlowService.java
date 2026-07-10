package com.finance.finance.modules.relatorios.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import com.finance.finance.modules.common.enums.PagamentoEnum;
import com.finance.finance.modules.common.enums.TipoLancamento;

import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDiaDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDiaProjection;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioLancamentoDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioLancamentoProjection;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioResumoDTO;

import com.finance.finance.modules.relatorios.repository.CashFlowRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CashFlowService {
    private final CashFlowRepository repository;

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
                            Collectors.mapping(this::toLancamentoDTO,
                                    Collectors.toList())));
        }

        BigDecimal totalEntradas = BigDecimal.ZERO;
        BigDecimal totalSaidas = BigDecimal.ZERO;
        List<FluxoDiarioDiaDTO> dias = new ArrayList<>();

        for (FluxoDiarioDiaProjection dia : diasProjection) {
            totalEntradas = totalEntradas.add(dia.getEntradas());
            totalSaidas = totalSaidas.add(dia.getSaidas());

            dias.add(FluxoDiarioDiaDTO.builder()
                    .data(dia.getDia())
                    .entradas(dia.getEntradas())
                    .saidas(dia.getSaidas())
                    .saldoDia(dia.getSaldoDia())
                    .saldoAcumulado(dia.getSaldoAcumulado())
                    .lancamentos(lancamentosPorDia.getOrDefault(dia.getDia(), List.of()))
                    .build());
        }

        BigDecimal saldoFinal = dias.isEmpty()
                ? saldoInicial
                : dias.get(dias.size() - 1).saldoAcumulado();

        FluxoDiarioResumoDTO resumo = FluxoDiarioResumoDTO.builder()
                .saldoInicial(saldoInicial)
                .totalEntradas(totalEntradas)
                .totalSaidas(totalSaidas)
                .saldoFinal(saldoFinal)
                .build();

        return FluxoDiarioDTO.builder()
                .de(de)
                .ate(ate)
                .resumo(resumo)
                .dias(dias)
                .build();
    }

    private FluxoDiarioLancamentoDTO toLancamentoDTO(FluxoDiarioLancamentoProjection projection) {
        return FluxoDiarioLancamentoDTO.builder()
                .id(projection.getId())
                .descricao(projection.getDescricao())
                .conta(projection.getConta())
                .categoria(projection.getCategoria())
                .valor(projection.getValor())
                .tipo(TipoLancamento.valueOf(projection.getTipo()))
                .situacao(PagamentoEnum.valueOf(projection.getSituacao()))
                .build();
    }
}
