package com.finance.finance.modules.relatorios.dto.recebimentospagamentos;

import java.time.LocalDate;
import java.util.List;

public record InnerRecebimentosPagamentosDTO(
    LocalDate de,
    LocalDate ate,
    RecebimentosBlocoDTO recebimentos,
    RecebimentosBlocoDTO pagamentos,
    List<RecebimentosMesDTO> evolucaoMensal) {
}