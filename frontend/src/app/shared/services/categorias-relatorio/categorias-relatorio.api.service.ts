import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import {
  ICategoriaHierarquia,
  ICategoriaMedia,
  ICategoriaMovimentacao,
  ICategoriaPagoPendente,
  ICategoriaResumoFinanceiro,
  ICategoriaValorTotal,
  ISemCategoria,
} from "@/shared/interfaces/categorias-relatorio.dto";
import { CATEGORIAS_RELATORIO_ENDPOINTS } from "./categorias-relatorio.endpoint";

@Injectable({ providedIn: "root" })
export class CategoriasRelatorioApiService {
  private readonly http = inject(HttpClient);

  getDespesasPagas(): Observable<ICategoriaValorTotal[]> {
    return this.http.get<ICategoriaValorTotal[]>(
      CATEGORIAS_RELATORIO_ENDPOINTS.DESPESAS_PAGAS,
    );
  }

  getResumoFinanceiro(): Observable<ICategoriaResumoFinanceiro[]> {
    return this.http.get<ICategoriaResumoFinanceiro[]>(
      CATEGORIAS_RELATORIO_ENDPOINTS.RESUMO_FINANCEIRO,
    );
  }

  getMedia(): Observable<ICategoriaMedia[]> {
    return this.http.get<ICategoriaMedia[]>(
      CATEGORIAS_RELATORIO_ENDPOINTS.MEDIA,
    );
  }

  getMovimentacao(): Observable<ICategoriaMovimentacao[]> {
    return this.http.get<ICategoriaMovimentacao[]>(
      CATEGORIAS_RELATORIO_ENDPOINTS.MOVIMENTACAO,
    );
  }

  getHierarquia(): Observable<ICategoriaHierarquia> {
    return this.http.get<ICategoriaHierarquia>(
      CATEGORIAS_RELATORIO_ENDPOINTS.HIERARQUIA,
    );
  }

  getPagoVsPendente(): Observable<ICategoriaPagoPendente[]> {
    return this.http.get<ICategoriaPagoPendente[]>(
      CATEGORIAS_RELATORIO_ENDPOINTS.PAGO_VS_PENDENTE,
    );
  }

  getSemCategoria(): Observable<ISemCategoria> {
    return this.http.get<ISemCategoria>(
      CATEGORIAS_RELATORIO_ENDPOINTS.SEM_CATEGORIA,
    );
  }
}
