import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IFluxoDiario } from "@/shared/interfaces/cash-flow.dto";
import { CASH_FLOW_ENDPOINTS } from "./cash-flow.endpoint";

@Injectable({ providedIn: "root" })
export class CashFlowApiService {
  private readonly http = inject(HttpClient);

  getFluxoDiario(
    de: string,
    ate: string,
    incluirDetalhes = true
  ): Observable<IFluxoDiario> {
    const params = new HttpParams()
      .set("de", de)
      .set("ate", ate)
      .set("incluirDetalhes", String(incluirDetalhes));

    return this.http.get<IFluxoDiario>(CASH_FLOW_ENDPOINTS.FLUXO_DIARIO, {
      params,
    });
  }
}
