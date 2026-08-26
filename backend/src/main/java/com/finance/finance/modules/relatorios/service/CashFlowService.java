package com.finance.finance.modules.relatorios.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import com.finance.finance.modules.common.enums.TipoLancamento;

import java.time.temporal.ChronoUnit;
import com.finance.finance.modules.relatorios.dto.capitalgiro.CapitalGiroDTO;
import com.finance.finance.modules.relatorios.dto.capitalgiro.CapitalGiroTituloDTO;
import com.finance.finance.modules.relatorios.dto.projecao.ProjecaoCaixaDTO;
import com.finance.finance.modules.relatorios.dto.projecao.ProjecaoDevedorDTO;
import com.finance.finance.modules.relatorios.dto.projecao.ProjecaoDevedorProjection;
import com.finance.finance.modules.relatorios.dto.projecao.ProjecaoHorizonteDTO;
import com.finance.finance.modules.relatorios.dto.projecao.ProjecaoHorizonteProjection;
import com.finance.finance.modules.relatorios.dto.projecao.ProjecaoInsightDTO;
import com.finance.finance.modules.relatorios.dto.dre.DreCategoriaDTO;
import com.finance.finance.modules.relatorios.dto.recebimentospagamentos.InnerRecebimentosPagamentosDTO;
import com.finance.finance.modules.relatorios.dto.recebimentospagamentos.RecebimentosBlocoDTO;
import com.finance.finance.modules.relatorios.dto.recebimentospagamentos.RecebimentosBlocoProjection;
import com.finance.finance.modules.relatorios.dto.recebimentospagamentos.RecebimentosMesDTO;
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
        public CapitalGiroDTO obterCapitalGiro() {
                BigDecimal activo = repository.obterActivoCirculante();
                BigDecimal passivo = repository.obterPassivoCirculante();
                BigDecimal capitalGiro = activo.subtract(passivo);

                BigDecimal liquidez = passivo.signum() == 0 ? null
                                : activo.divide(passivo, 2, RoundingMode.HALF_UP);

                List<CapitalGiroTituloDTO> aReceber = repository.obterTitulosAReceber().stream()
                                .map(CashFlowMapper::toCapitalGiroTituloDTO)
                                .toList();

                List<CapitalGiroTituloDTO> aPagar = repository.obterTitulosAPagar().stream()
                                .map(CashFlowMapper::toCapitalGiroTituloDTO)
                                .toList();

                return CashFlowMapper.toCapitalGiroDTO(activo, passivo, capitalGiro, liquidez, aReceber, aPagar);
        }

        @Transactional(readOnly = true)
        public InnerRecebimentosPagamentosDTO obterRecebimentosPagamentos(LocalDate de, LocalDate ate) {
                if (de.isAfter(ate)) {
                        throw new IllegalArgumentException("A data inicial não pode ser posterior à data final");
                }

                List<RecebimentosBlocoProjection> blocos = repository.obterBlocosRecebimentosPagamentos(de, ate);

                RecebimentosBlocoDTO recebimentos = blocos.stream()
                                .filter(b -> "RECEITA".equals(b.getTipo()))
                                .findFirst()
                                .map(this::buildBloco)
                                .orElse(blocoZero());

                RecebimentosBlocoDTO pagamentos = blocos.stream()
                                .filter(b -> "DESPESA".equals(b.getTipo()))
                                .findFirst()
                                .map(this::buildBloco)
                                .orElse(blocoZero());

                List<RecebimentosMesDTO> evolucaoMensal = repository
                                .obterEvolucaoMensalRecebimentos(de, ate).stream()
                                .map(m -> RecebimentosMesDTO.builder()
                                                .mes(m.getMes())
                                                .previsto(m.getPrevisto())
                                                .realizado(m.getRealizado())
                                                .build())
                                .toList();

                return new InnerRecebimentosPagamentosDTO(de, ate, recebimentos, pagamentos, evolucaoMensal);
        }

        private RecebimentosBlocoDTO buildBloco(RecebimentosBlocoProjection p) {
                BigDecimal previsto = p.getPrevisto();
                BigDecimal realizado = p.getRealizado();
                BigDecimal soma = previsto.add(realizado);
                BigDecimal taxa = soma.signum() == 0 ? BigDecimal.ZERO
                                : realizado.multiply(BigDecimal.valueOf(100)).divide(soma, 1, RoundingMode.HALF_UP);

                return RecebimentosBlocoDTO.builder()
                                .previsto(previsto)
                                .realizado(realizado)
                                .taxaPercentual(taxa)
                                .emAtraso(p.getEmAtraso())
                                .build();
        }

        private RecebimentosBlocoDTO blocoZero() {
                return RecebimentosBlocoDTO.builder()
                                .previsto(BigDecimal.ZERO)
                                .realizado(BigDecimal.ZERO)
                                .taxaPercentual(BigDecimal.ZERO)
                                .emAtraso(BigDecimal.ZERO)
                                .build();
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

        @Transactional(readOnly = true)
        public ProjecaoCaixaDTO obterProjecaoCaixa() {
                BigDecimal saldoAtual = coalesce(repository.obterSaldoAtual());
                BigDecimal vencido = coalesce(repository.obterVencidoTotal());
                List<ProjecaoHorizonteProjection> horizontesRaw = repository.obterHorizontesProjecao();
                List<ProjecaoDevedorProjection> devedoresRaw = repository.obterPrincipaisDevedores();

                BigDecimal riscoPercentual = calcRiscoPercentual(saldoAtual, vencido);

                List<ProjecaoHorizonteDTO> horizontes = horizontesRaw.stream()
                                .map(h -> buildHorizonte(h, saldoAtual, riscoPercentual))
                                .toList();

                ProjecaoHorizonteDTO h90 = horizontes.stream()
                                .filter(h -> h.dias() == 90)
                                .findFirst()
                                .orElse(emptyHorizonte(90, saldoAtual));

                BigDecimal variacao = saldoAtual.signum() == 0 ? BigDecimal.ZERO
                                : h90.saldoProjetado().subtract(saldoAtual)
                                                .multiply(BigDecimal.valueOf(100))
                                                .divide(saldoAtual.abs(), 1, RoundingMode.HALF_UP);

                LocalDate hoje = LocalDate.now();
                List<ProjecaoDevedorDTO> devedores = devedoresRaw.stream().map(d -> {
                        long diasAteVencimento = ChronoUnit.DAYS.between(hoje, d.getVencimento());
                        String riscoDevedor = diasAteVencimento < 0 ? "ALTO"
                                        : diasAteVencimento <= 30 ? "MEDIO" : "BAIXO";
                        return ProjecaoDevedorDTO.builder()
                                        .id(d.getId())
                                        .nome(d.getNome())
                                        .valor(d.getValor())
                                        .venceEmDias((int) diasAteVencimento)
                                        .risco(riscoDevedor)
                                        .build();
                }).toList();

                List<ProjecaoInsightDTO> insights = gerarInsights(h90, vencido, riscoPercentual);

                return ProjecaoCaixaDTO.builder()
                                .horizonteActivo(90)
                                .saldoAtual(saldoAtual)
                                .entradasPrevistas(h90.entradas())
                                .saidasPrevistas(h90.saidas())
                                .saldoProjetado(h90.saldoProjetado())
                                .variacaoPercentual(variacao)
                                .riscoInadimplenciaPercentual(riscoPercentual)
                                .impactoRisco(vencido)
                                .horizontes(horizontes)
                                .insights(insights)
                                .principaisDevedores(devedores)
                                .build();
        }

        private BigDecimal coalesce(BigDecimal value) {
                return value != null ? value : BigDecimal.ZERO;
        }

        private BigDecimal calcRiscoPercentual(BigDecimal saldoAtual, BigDecimal vencido) {
                if (saldoAtual.signum() == 0 || vencido.signum() == 0)
                        return BigDecimal.ZERO;
                return vencido.multiply(BigDecimal.valueOf(100))
                                .divide(saldoAtual.abs(), 1, RoundingMode.HALF_UP);
        }

        private ProjecaoHorizonteDTO buildHorizonte(ProjecaoHorizonteProjection h, BigDecimal saldoAtual,
                        BigDecimal riscoPercentual) {
                BigDecimal entradas = coalesce(h.getEntradas());
                BigDecimal saidas = coalesce(h.getSaidas());
                BigDecimal saldoProjetado = saldoAtual.add(entradas).subtract(saidas);

                String risco;
                if (saldoProjetado.signum() < 0 || riscoPercentual.compareTo(BigDecimal.valueOf(30)) > 0) {
                        risco = "ALTO";
                } else if (riscoPercentual.compareTo(BigDecimal.valueOf(10)) > 0) {
                        risco = "MEDIO";
                } else {
                        risco = "BAIXO";
                }

                return ProjecaoHorizonteDTO.builder()
                                .dias(h.getDias())
                                .entradas(entradas)
                                .saidas(saidas)
                                .saldoProjetado(saldoProjetado)
                                .risco(risco)
                                .riscoPercentual(riscoPercentual)
                                .build();
        }

        private ProjecaoHorizonteDTO emptyHorizonte(int dias, BigDecimal saldoAtual) {
                return ProjecaoHorizonteDTO.builder()
                                .dias(dias)
                                .entradas(BigDecimal.ZERO)
                                .saidas(BigDecimal.ZERO)
                                .saldoProjetado(saldoAtual)
                                .risco("BAIXO")
                                .riscoPercentual(BigDecimal.ZERO)
                                .build();
        }

        private List<ProjecaoInsightDTO> gerarInsights(ProjecaoHorizonteDTO h90, BigDecimal vencido,
                        BigDecimal riscoPerc) {
                List<ProjecaoInsightDTO> insights = new ArrayList<>();

                if (h90.saldoProjetado().signum() < 0) {
                        insights.add(ProjecaoInsightDTO.builder()
                                        .tipo("alerta")
                                        .titulo("Saldo projectado negativo")
                                        .descricao(
                                                        "O saldo pode ficar negativo nos próximos 90 dias. Considere antecipar recebimentos ou adiar pagamentos.")
                                        .build());
                }

                if (vencido.signum() > 0) {
                        insights.add(ProjecaoInsightDTO.builder()
                                        .tipo("alerta")
                                        .titulo("Títulos vencidos em aberto")
                                        .descricao("Existem recebimentos vencidos que representam "
                                                        + riscoPerc.toPlainString() + "% do saldo actual.")
                                        .build());
                }

                if (h90.entradas().compareTo(h90.saidas()) > 0) {
                        insights.add(ProjecaoInsightDTO.builder()
                                        .tipo("oportunidade")
                                        .titulo("Fluxo positivo previsto")
                                        .descricao("As entradas previstas superam as saídas nos próximos 90 dias.")
                                        .build());
                } else if (h90.saidas().compareTo(h90.entradas()) > 0) {
                        insights.add(ProjecaoInsightDTO.builder()
                                        .tipo("alerta")
                                        .titulo("Saídas superam entradas")
                                        .descricao(
                                                        "As saídas previstas são superiores às entradas no horizonte de 90 dias.")
                                        .build());
                }

                return insights;
        }
}
