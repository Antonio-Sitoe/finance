package com.finance.finance.modules.relatorios.service;

import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.finance.finance.modules.clientes.repository.ClienteRepository;
import com.finance.finance.modules.fornecedor.repository.FornecedorRepository;
import com.finance.finance.modules.relatorios.dto.DashboardDTO;
import com.finance.finance.modules.relatorios.dto.search.GlobalSearchResultDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioAnualDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioAnualProjecaoDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioMensalDTO;
import com.finance.finance.modules.relatorios.dto.RelatorioPercentual;
import com.finance.finance.modules.relatorios.dto.RelatorioPorCategoria;
import com.finance.finance.modules.relatorios.dto.RelatorioSituacaoDTO;
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
        return DashboardDTO.builder()
                .totalReceitasMes(repository.totalReceitasMes())
                .totalDespesasMes(repository.totalDespesasMes())
                .saldoAtual(repository.saldoAtual())
                .contasAPagar(repository.contasAPagar())
                .contasAReceber(repository.contasAReceber())
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

}
