import {
  ICategory,
  ICategoryAnalytics,
  ICategoryOption,
  ICategoryPayload,
  ICategorySituacaoResponse,
} from "@/shared/interfaces/categories.dto";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CATEGORY_ENDPOINTS } from "./category.endpoint";
import { ListQuery, PageResult } from "@/shared/config/listing/listing.dto";
import { toHttpParams } from "@/shared/config/listing/http.params-utils";

@Injectable({ providedIn: "root" })
export class CategoryApiService {
  private readonly http = inject(HttpClient);

  getAll(query: ListQuery): Observable<PageResult<ICategory>> {
    const filters = query.filters ?? {};
    return this.http.get<PageResult<ICategory>>(CATEGORY_ENDPOINTS.LIST, {
      params: toHttpParams({
        ...query,
        page: query.page - 1,
        sortOrder: "desc",
        filters: {
          nome: filters["nome"] ?? "",
          situacao: filters["situacao"] ?? "",
          ...(filters["tipo"] === "debito" ? { debito: true } : {}),
          ...(filters["tipo"] === "credito" ? { credito: true } : {}),
        },
      }),
    });
  }

  getAllOptions(): Observable<ICategoryOption[]> {
    return this.http.get<ICategoryOption[]>(CATEGORY_ENDPOINTS.ALL);
  }

  getById(id: number): Observable<ICategory> {
    return this.http.get<ICategory>(CATEGORY_ENDPOINTS.DETAIL(id));
  }

  create(payload: ICategoryPayload): Observable<ICategory> {
    return this.http.post<ICategory>(CATEGORY_ENDPOINTS.CREATE, payload);
  }

  update(id: number, payload: ICategoryPayload): Observable<ICategory> {
    return this.http.patch<ICategory>(CATEGORY_ENDPOINTS.UPDATE(id), payload);
  }

  toggleSituacao(id: number): Observable<ICategorySituacaoResponse> {
    return this.http.patch<ICategorySituacaoResponse>(
      CATEGORY_ENDPOINTS.SITUACAO(id),
      {}
    );
  }

  getAnalytics(): Observable<ICategoryAnalytics> {
    return this.http.get<ICategoryAnalytics>(CATEGORY_ENDPOINTS.ANALYTICS);
  }
}
