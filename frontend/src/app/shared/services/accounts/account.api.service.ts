import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ACCOUNT_ENDPOINTS } from "./account.endpoint";
import {
  IAccount,
  IAccountPayload,
  IAccountSituacaoResponse,
} from "@/shared/interfaces/accounts.dto";
import { ListQuery, PageResult } from "@/shared/config/listing/listing.dto";

@Injectable({ providedIn: "root" })
export class AccountApiService {
  private readonly http = inject(HttpClient);

  getAll(query: ListQuery): Observable<PageResult<IAccount>> {
    const filters = query.filters ?? {};
    let params = new HttpParams()
      .set("page", String(query.page - 1))
      .set("size", String(query.size))
      .set("sortOrder", "desc");

    if (filters["nome"]) params = params.set("nome", String(filters["nome"]));
    if (filters["situacao"])
      params = params.set("situacao", String(filters["situacao"]));

    return this.http.get<PageResult<IAccount>>(ACCOUNT_ENDPOINTS.LIST, {
      params,
    });
  }

  getById(id: number): Observable<IAccount> {
    return this.http.get<IAccount>(ACCOUNT_ENDPOINTS.DETAIL(id));
  }

  create(payload: IAccountPayload): Observable<IAccount> {
    return this.http.post<IAccount>(ACCOUNT_ENDPOINTS.CREATE, payload);
  }

  update(id: number, payload: IAccountPayload): Observable<IAccount> {
    return this.http.patch<IAccount>(ACCOUNT_ENDPOINTS.UPDATE(id), payload);
  }

  toggleSituacao(id: number): Observable<IAccountSituacaoResponse> {
    return this.http.patch<IAccountSituacaoResponse>(
      ACCOUNT_ENDPOINTS.SITUACAO(id),
      {}
    );
  }
}
