import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CONTACTO_ENDPOINTS } from "./contacto.endpoint";
import {
  EmpresaStatsDTO,
  IContactDTO,
  IContactPayloadDTO,
  IContactSituacaoResponse,
} from "@/shared/interfaces/contacts.dto";
import { ListQuery, PageResult } from "@/shared/config/listing/listing.dto";

@Injectable({
  providedIn: "root",
})
export class ContactoApiService {
  private readonly http = inject(HttpClient);

  getAll(query: ListQuery): Observable<PageResult<IContactDTO>> {
    const filters = query.filters ?? {};
    let params = new HttpParams()
      .set("page", String(query.page - 1))
      .set("size", String(query.size))
      .set("sortOrder", "desc");

    if (filters["nome"]) params = params.set("nome", String(filters["nome"]));
    if (filters["departamento"])
      params = params.set("departamento", String(filters["departamento"]));
    if (filters["situacao"])
      params = params.set("situacao", String(filters["situacao"]));

    return this.http.get<PageResult<IContactDTO>>(CONTACTO_ENDPOINTS.LIST, {
      params,
    });
  }

  getByCliente(
    clienteId: number,
    query: ListQuery
  ): Observable<PageResult<IContactDTO>> {
    const filters = query.filters ?? {};
    let params = new HttpParams()
      .set("page", String(query.page - 1))
      .set("size", String(query.size));

    if (filters["nome"]) params = params.set("nome", String(filters["nome"]));
    if (filters["departamento"])
      params = params.set("departamento", String(filters["departamento"]));
    if (filters["situacao"])
      params = params.set("situacao", String(filters["situacao"]));

    return this.http.get<PageResult<IContactDTO>>(
      CONTACTO_ENDPOINTS.BY_CLIENTE(clienteId),
      { params }
    );
  }

  create(payload: IContactPayloadDTO): Observable<IContactDTO> {
    return this.http.post<IContactDTO>(CONTACTO_ENDPOINTS.CREATE, payload);
  }

  update(id: number, payload: IContactPayloadDTO): Observable<IContactDTO> {
    return this.http.patch<IContactDTO>(CONTACTO_ENDPOINTS.UPDATE(id), payload);
  }

  toggleSituacao(id: number): Observable<IContactSituacaoResponse> {
    return this.http.patch<IContactSituacaoResponse>(
      CONTACTO_ENDPOINTS.SITUACAO(id),
      {}
    );
  }

  analytics(): Observable<EmpresaStatsDTO> {
    return this.http.get<EmpresaStatsDTO>(CONTACTO_ENDPOINTS.ANALYTICS);
  }
}
