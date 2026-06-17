import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { TRANSACTION_ENDPOINTS } from './transaction.endpoint'
import {
  ITransaction,
  ITransactionAnalytics,
  ITransactionParceladoPayload,
  ITransactionPayload,
  ITransactionStatusResponse,
} from '@/shared/interfaces/transactions.dto'
import { ListQuery, PageResult } from '@/shared/config/listing/listing.dto'
import { toHttpParams } from '@/shared/config/listing/http.params-utils'

@Injectable({ providedIn: 'root' })
export class TransactionApiService {
  private readonly http = inject(HttpClient)

  getAll(query: ListQuery): Observable<PageResult<ITransaction>> {
    const filters = query.filters ?? {}
    return this.http.get<PageResult<ITransaction>>(TRANSACTION_ENDPOINTS.LIST, {
      params: toHttpParams({
        ...query,
        page: query.page - 1,
        sortOrder: 'desc',
        filters: {
          descricao: filters['descricao'] ?? '',
          situacao: filters['situacao'] ?? '',
          tipo: filters['tipo'] ?? '',
        },
      }),
    })
  }

  getById(id: number): Observable<ITransaction> {
    return this.http.get<ITransaction>(TRANSACTION_ENDPOINTS.DETAIL(id))
  }

  create(payload: ITransactionPayload): Observable<ITransaction> {
    return this.http.post<ITransaction>(TRANSACTION_ENDPOINTS.CREATE, payload)
  }

  update(id: number, payload: Partial<ITransactionPayload>): Observable<ITransaction> {
    return this.http.patch<ITransaction>(TRANSACTION_ENDPOINTS.UPDATE(id), payload)
  }

  toggleSituacao(id: number): Observable<ITransactionStatusResponse> {
    return this.http.patch<ITransactionStatusResponse>(
      TRANSACTION_ENDPOINTS.SITUACAO(id),
      {}
    )
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(TRANSACTION_ENDPOINTS.DELETE(id))
  }

  createParcelado(payload: ITransactionParceladoPayload): Observable<ITransaction[]> {
    return this.http.post<ITransaction[]>(TRANSACTION_ENDPOINTS.PARCELADO, payload)
  }

  getResumo(): Observable<ITransactionAnalytics> {
    return this.http.get<ITransactionAnalytics>(TRANSACTION_ENDPOINTS.RESUMO)
  }

  exportCsv(): Observable<Blob> {
    return this.http.get(TRANSACTION_ENDPOINTS.EXPORT_CSV, { responseType: 'blob' })
  }
}
