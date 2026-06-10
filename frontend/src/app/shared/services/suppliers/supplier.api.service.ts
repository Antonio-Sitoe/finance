import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SUPPLIER_ENDPOINTS } from "./supplier.endpoint";
import {
  ISupplier,
  ISupplierAnalytics,
  ISupplierPayload,
  ISupplierSituacaoResponse,
} from "@/shared/interfaces/suppliers.dto";
import { ListQuery, PageResult } from "@/shared/config/listing/listing.dto";

const AVALIACAO_PARAMS: Record<string, { notaMin?: number; notaMax?: number }> =
  {
    excelente: { notaMin: 8 },
    regular: { notaMin: 5, notaMax: 7 },
    risco: { notaMax: 4 },
  };

@Injectable({ providedIn: "root" })
export class SupplierApiService {
  private readonly http = inject(HttpClient);

  getAll(query: ListQuery): Observable<PageResult<ISupplier>> {
    const filters = query.filters ?? {};
    let params = new HttpParams()
      .set("page", String(query.page - 1))
      .set("size", String(query.size))
      .set("sortOrder", "desc");

    if (filters["nome"]) params = params.set("nome", String(filters["nome"]));
    if (filters["situacao"])
      params = params.set("situacao", String(filters["situacao"]));

    const avaliacao = AVALIACAO_PARAMS[String(filters["avaliacao"] ?? "")];
    if (avaliacao?.notaMin !== undefined)
      params = params.set("notaMin", String(avaliacao.notaMin));
    if (avaliacao?.notaMax !== undefined)
      params = params.set("notaMax", String(avaliacao.notaMax));

    return this.http.get<PageResult<ISupplier>>(SUPPLIER_ENDPOINTS.LIST, {
      params,
    });
  }

  getById(id: number): Observable<ISupplier> {
    return this.http.get<ISupplier>(SUPPLIER_ENDPOINTS.DETAIL(id));
  }

  create(payload: ISupplierPayload): Observable<ISupplier> {
    return this.http.post<ISupplier>(SUPPLIER_ENDPOINTS.CREATE, payload);
  }

  update(id: number, payload: ISupplierPayload): Observable<ISupplier> {
    return this.http.patch<ISupplier>(SUPPLIER_ENDPOINTS.UPDATE(id), payload);
  }

  toggleSituacao(id: number): Observable<ISupplierSituacaoResponse> {
    return this.http.patch<ISupplierSituacaoResponse>(
      SUPPLIER_ENDPOINTS.SITUACAO(id),
      {}
    );
  }

  getAnalytics(): Observable<ISupplierAnalytics> {
    return this.http.get<ISupplierAnalytics>(SUPPLIER_ENDPOINTS.ANALYTICS);
  }
}
