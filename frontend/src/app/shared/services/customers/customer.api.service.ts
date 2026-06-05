import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { CUSTOMER_API_ENDPOINTS } from './customer.endpoint.service'
import { Observable } from 'rxjs'
import {
  CreateCustomerDto,
  ICustomerRankingResumoDTO,
  ICustomerDTO,
  UpdateCustomerDto,
} from '@/shared/interfaces/costumers.dto'
import { SITUATION } from '@/shared/interfaces/enum.dto'
import { ListQuery, PageResult } from '@/shared/config/listing/listing.dto'
import { toHttpParams } from '@/shared/config/listing/http.params-utils'

@Injectable({
  providedIn: 'root',
})
export class CustomerApiService {
  private http = inject(HttpClient)

  getCustomers(query: ListQuery): Observable<PageResult<ICustomerDTO>> {
    return this.http.get<PageResult<ICustomerDTO>>(
      CUSTOMER_API_ENDPOINTS.LIST,
      {
        params: toHttpParams({
          ...query,
          page: query.page - 1,
          sortOrder: 'desc',
        }),
      },
    )
  }

  createCustomer(dto: CreateCustomerDto): Observable<ICustomerDTO> {
    return this.http.post<ICustomerDTO>(CUSTOMER_API_ENDPOINTS.CREATE, dto)
  }

  updateCustomer(id: number, dto: UpdateCustomerDto): Observable<ICustomerDTO> {
    return this.http.patch<ICustomerDTO>(CUSTOMER_API_ENDPOINTS.UPDATE(id), dto)
  }

  getById(id: number): Observable<ICustomerDTO> {
    return this.http.get<ICustomerDTO>(CUSTOMER_API_ENDPOINTS.GET_BY_ID(id))
  }

  getRankingResumo(): Observable<ICustomerRankingResumoDTO> {
    return this.http.get<ICustomerRankingResumoDTO>(
      CUSTOMER_API_ENDPOINTS.RANKING,
    )
  }

  updateSituacao(id: number, situacao: SITUATION): Observable<ICustomerDTO> {
    return this.http.patch<ICustomerDTO>(CUSTOMER_API_ENDPOINTS.SITUACAO(id), { situacao })
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(CUSTOMER_API_ENDPOINTS.DELETE(id))
  }
}
