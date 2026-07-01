package com.finance.finance.modules.relatorios.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.finance.modules.clientes.repository.ClienteRepository;
import com.finance.finance.modules.common.dto.BasicLabelValueDTO;
import com.finance.finance.modules.common.enums.PagamentoEnum;
import com.finance.finance.modules.common.enums.TipoLancamento;
import com.finance.finance.modules.fornecedor.repository.FornecedorRepository;
import com.finance.finance.modules.relatorios.dto.search.GlobalSearchResultDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioAnualDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioAnualProjecaoDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioCategoriaDto;
import com.finance.finance.modules.relatorios.dto.RelatorioMensalDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioPercentual;
import com.finance.finance.modules.relatorios.dto.RelatorioPorCategoria;
import com.finance.finance.modules.relatorios.dto.RelatorioSituacaoDTO;
import com.finance.finance.modules.relatorios.dto.dashboard.DashboardAlertDTO;
import com.finance.finance.modules.relatorios.dto.dashboard.DashboardDTO;
import com.finance.finance.modules.relatorios.dto.dashboard.DashboardReceitaDispesas;
import com.finance.finance.modules.relatorios.dto.dashboard.DashboardReceitaDispesasProjection;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDiaDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDiaProjection;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioLancamentoDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioLancamentoProjection;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioResumoDTO;
import com.finance.finance.modules.relatorios.repository.RelatoriosRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RelatorioService {
    private final RelatoriosRepository repository;
    private final ClienteRepository clienteRepository;
    private final FornecedorRepository fornecedorRepository;

    public RelatorioAnualDTO gerarRelatorioAnual() {
        RelatorioAnualProjecaoDTO relatorioAnual = repository.realizarRelatorioAnual();
        List<RelatorioMensalDTO> relatorioMensal = repository.realizarRelatorioMensal();
        return RelatorioAnualDTO.builder()
                .ano(relatorioAnual.getAno())
                .totalAnual(relatorioAnual.getTotalAnual())
                .saldoTotalAnual(relatorioAnual.getSaldoTotalAnual())
                .meses(relatorioMensal.stream()
                        .filter(m -> m.getAno().equals(relatorioAnual.getAno()))
                        .toList())
                .build();
    }

    public RelatorioPercentual gerarRelatorioPercentual() {
        Long totalLancamentos = repository.count();
        List<RelatorioSituacaoDTO> situacao = repository.realizarRelatorioPercentual();

        return RelatorioPercentual.builder()
                .totalLancamentos(totalLancamentos)
                .situacao(situacao)
                .build();
    }

    public DashboardDTO gerarDashboard() {
        var r = repository.resumo();
        return DashboardDTO.builder()
                .totalReceitasMes(r.getTotalReceitasMes())
                .totalDespesasMes(r.getTotalDespesasMes())
                .saldoAtual(r.getSaldoAtual())
                .resultadoMes(r.getResultadoMes())
                .contasAPagar(r.getContasAPagar())
                .contasAReceber(r.getContasAReceber())
                .build();
    }

    public List<RelatorioPorCategoria> realizarRelatorioCategoria() {
        List<RelatorioPorCategoria> relatorio = repository.realizarRelatorioCategoria();
        return relatorio;
    }

    public GlobalSearchResultDTO globalSearch(String q, Integer limit) {
        if (q == null || q.isBlank()) {
            return GlobalSearchResultDTO.empty();
        }

        String termo = q.trim();
        Pageable pageable = (limit == null || limit <= 0)
                ? Pageable.unpaged()
                : PageRequest.of(0, limit);

        return new GlobalSearchResultDTO(
                clienteRepository.searchGlobal(termo, pageable),
                fornecedorRepository.searchGlobal(termo, pageable),
                repository.searchGlobal(termo, pageable));
    }

    @Transactional(readOnly = true)
    public DashboardAlertDTO obterAlertas() {
        var alertas = repository.obterAlertas();
        return DashboardAlertDTO.builder()
                .receitasVencidas(alertas.getReceitasVencidas())
                .despesasVencidas(alertas.getDespesasVencidas())
                .qtdLancamentosVencemHoje(alertas.getQtdLancamentosVencemHoje())
                .build();
    }

    @Transactional(readOnly = true)
    public List<BasicLabelValueDTO<BigDecimal>> obterEstatisticasPorContas() {
        List<BasicLabelValueDTO<BigDecimal>> lancamento = repository.obterEstatisticasPorContas();
        return lancamento;
    }

    @Transactional(readOnly = true)
    public List<DashboardReceitaDispesas> obterReceitaVsDespesas() {
        List<DashboardReceitaDispesasProjection> projections = repository.obterReceitaVsDespesas();
        return projections.stream()
                .map(p -> DashboardReceitaDispesas.builder()
                        .mes(p.getMes())
                        .receitas(p.getReceitas())
                        .despesas(p.getDespesas())
                        .build())
                .toList();
    }

    public List<RelatorioCategoriaDto> obterRelatorioCategoria() {
        return repository
                .buscarTop3()
                .stream()
                .toList();
    }

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
                            Collectors.mapping(this::toLancamentoDTO, Collectors.toList())));
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
