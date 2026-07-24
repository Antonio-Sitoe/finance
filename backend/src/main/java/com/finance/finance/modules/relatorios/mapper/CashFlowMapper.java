package com.finance.finance.modules.relatorios.mapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.finance.finance.modules.common.enums.PagamentoEnum;
import com.finance.finance.modules.common.enums.TipoLancamento;
import com.finance.finance.modules.relatorios.dto.dre.DreCategoriaDTO;
import com.finance.finance.modules.relatorios.dto.dre.DreCategoriaProjection;
import com.finance.finance.modules.relatorios.dto.dre.DreDTO;
import com.finance.finance.modules.relatorios.dto.dre.DreLancamentoDTO;
import com.finance.finance.modules.relatorios.dto.dre.DreLancamentoProjection;
import com.finance.finance.modules.relatorios.dto.dre.DreResumoDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDiaDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioDiaProjection;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioLancamentoDTO;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioLancamentoProjection;
import com.finance.finance.modules.relatorios.dto.fluxo.FluxoDiarioResumoDTO;

public class CashFlowMapper {

        private CashFlowMapper() {
        }

        public static FluxoDiarioLancamentoDTO toLancamentoDTO(FluxoDiarioLancamentoProjection projection) {
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

        public static FluxoDiarioDiaDTO toDiaDTO(FluxoDiarioDiaProjection dia,
                        List<FluxoDiarioLancamentoDTO> lancamentos) {
                return FluxoDiarioDiaDTO.builder()
                                .data(dia.getDia())
                                .entradas(dia.getEntradas())
                                .saidas(dia.getSaidas())
                                .saldoDia(dia.getSaldoDia())
                                .saldoAcumulado(dia.getSaldoAcumulado())
                                .lancamentos(lancamentos)
                                .build();
        }

        public static FluxoDiarioDTO toFluxoDiarioDTO(LocalDate de, LocalDate ate, BigDecimal saldoInicial,
                        BigDecimal totalEntradas, BigDecimal totalSaidas, BigDecimal saldoFinal,
                        List<FluxoDiarioDiaDTO> dias) {
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

        public static DreLancamentoDTO toDreLancamentoDTO(DreLancamentoProjection projection) {
                return DreLancamentoDTO.builder()
                                .id(projection.getId())
                                .descricao(projection.getDescricao())
                                .conta(projection.getConta())
                                .valor(projection.getValor())
                                .data(projection.getData())
                                .build();
        }

        public static DreCategoriaDTO toDreCategoriaDTO(DreCategoriaProjection categoria, BigDecimal totalTipo,
                        Map<Long, List<DreLancamentoDTO>> lancamentosPorCategoria) {
                return DreCategoriaDTO.builder()
                                .categoriaId(categoria.getCategoriaId())
                                .nome(categoria.getNome())
                                .total(categoria.getTotal())
                                .percentual(percentual(categoria.getTotal(), totalTipo))
                                .lancamentos(lancamentosPorCategoria.getOrDefault(categoria.getCategoriaId(),
                                                List.of()))
                                .build();
        }

        public static DreDTO toDreDTO(LocalDate de, LocalDate ate, BigDecimal totalReceitas, BigDecimal totalDespesas,
                        List<DreCategoriaDTO> receitas, List<DreCategoriaDTO> despesas) {
                BigDecimal resultado = totalReceitas.subtract(totalDespesas);

                DreResumoDTO resumo = DreResumoDTO.builder()
                                .totalReceitas(totalReceitas)
                                .totalDespesas(totalDespesas)
                                .resultado(resultado)
                                .margemPercentual(percentual(resultado, totalReceitas))
                                .build();

                return DreDTO.builder()
                                .de(de)
                                .ate(ate)
                                .resumo(resumo)
                                .receitas(receitas)
                                .despesas(despesas)
                                .build();
        }

        public static BigDecimal somarPorTipo(List<DreCategoriaProjection> categorias, TipoLancamento tipo) {
                return categorias.stream()
                                .filter(c -> tipo.name().equals(c.getTipo()))
                                .map(DreCategoriaProjection::getTotal)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        public static BigDecimal percentual(BigDecimal valor, BigDecimal total) {
                if (total == null || total.signum() == 0) {
                        return BigDecimal.ZERO;
                }
                return valor.multiply(BigDecimal.valueOf(100))
                                .divide(total, 1, RoundingMode.HALF_UP);
        }
}
