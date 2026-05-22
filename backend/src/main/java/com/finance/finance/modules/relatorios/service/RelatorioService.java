package com.finance.finance.modules.relatorios.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

import com.finance.finance.modules.clientes.repository.ClienteRepository;
import com.finance.finance.modules.fornecedor.repository.FornecedorRepository;
import com.finance.finance.modules.relatorios.dto.DashboardDTO;
import com.finance.finance.modules.relatorios.dto.GlobalSearchResponseDTO;
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

    public List<GlobalSearchResponseDTO> globalSearch(String q) {

        List<GlobalSearchResponseDTO> results = new ArrayList<>();

        results.addAll(clienteRepository.findByIdAndNomeEmpresarial(q));

        results.addAll(fornecedorRepository.findByIdAndNomeEmpresarial(q));

        results.addAll(repository.lancamentoSearch(q));

        return results;
    }

}
