import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ICustomerDTO } from "@/shared/interfaces/costumers.dto";
import {
  IClienteClassificacaoNota,
  IClienteFaturamento,
  IClienteFaturamentoResumo,
  IClienteMultiplosContactos,
  IClienteReceita,
  IClienteSemDados,
  IClienteStatusReport,
  IPeriodoQuery,
  IReportPage,
} from "@/shared/interfaces/clientes-relatorio.dto";
import { CLIENTES_RELATORIO_ENDPOINTS } from "./clientes-relatorio.endpoint";

@Injectable({ providedIn: "root" })
export class ClientesRelatorioApiService {
  private readonly http = inject(HttpClient);

  getSituacao(): Observable<IClienteStatusReport> {
    return this.http.get<IClienteStatusReport>(
      CLIENTES_RELATORIO_ENDPOINTS.SITUACAO,
    );
  }

  getClassificacao(): Observable<IClienteClassificacaoNota[]> {
    return this.http.get<IClienteClassificacaoNota[]>(
      CLIENTES_RELATORIO_ENDPOINTS.CLASSIFICACAO,
    );
  }

  getSemDados(): Observable<IClienteSemDados> {
    return this.http.get<IClienteSemDados>(
      CLIENTES_RELATORIO_ENDPOINTS.SEM_DADOS,
    );
  }

  getMultiplosContactos(): Observable<IClienteMultiplosContactos> {
    return this.http.get<IClienteMultiplosContactos>(
      CLIENTES_RELATORIO_ENDPOINTS.MULTIPLOS_CONTACTOS,
    );
  }

  getClientesRecentes(): Observable<IReportPage<ICustomerDTO>> {
    const params = new HttpParams()
      .set("page", 0)
      .set("size", 5)
      .set("sortBy", "createdAt")
      .set("sortOrder", "desc");
    return this.http.get<IReportPage<ICustomerDTO>>(
      CLIENTES_RELATORIO_ENDPOINTS.CLIENTES,
      { params },
    );
  }

  getFaturamento(periodo: IPeriodoQuery): Observable<IClienteFaturamento[]> {
    return this.http.get<IClienteFaturamento[]>(
      CLIENTES_RELATORIO_ENDPOINTS.FATURAMENTO,
      { params: this.periodParams(periodo) },
    );
  }

  getFaturamentoResumo(
    periodo: IPeriodoQuery,
  ): Observable<IClienteFaturamentoResumo> {
    return this.http.get<IClienteFaturamentoResumo>(
      CLIENTES_RELATORIO_ENDPOINTS.FATURAMENTO_RESUMO,
      { params: this.periodParams(periodo) },
    );
  }

  getReceitasCliente(clienteId: number): Observable<IReportPage<IClienteReceita>> {
    const params = new HttpParams()
      .set("clienteId", clienteId)
      .set("tipo", "RECEITA")
      .set("page", 0)
      .set("size", 5)
      .set("sortBy", "dataLancamento")
      .set("sortOrder", "desc");
    return this.http.get<IReportPage<IClienteReceita>>(
      CLIENTES_RELATORIO_ENDPOINTS.LANCAMENTOS,
      { params },
    );
  }

  private periodParams(periodo: IPeriodoQuery): HttpParams {
    let params = new HttpParams();
    if (periodo.de) params = params.set("de", periodo.de);
    if (periodo.ate) params = params.set("ate", periodo.ate);
    return params;
  }
}
