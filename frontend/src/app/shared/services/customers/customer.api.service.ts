import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CUSTOMER_API_ENDPOINTS } from "./customer.endpoint.service";
import { Observable } from "rxjs";
import {
  CreateCustomerDto,
  ICustomerDTO,
  UpdateCustomerDto,
} from "@/shared/interfaces/costumers.dto";
import { ListQuery, PageResult } from "@/shared/config/listing/listing.dto";
import { toHttpParams } from "@/shared/config/listing/http.params-utils";

@Injectable({
  providedIn: "root",
})
export class CustomerApiService {
  private http = inject(HttpClient);

  getCustomers(query: ListQuery): Observable<PageResult<ICustomerDTO>> {
    return this.http.get<PageResult<ICustomerDTO>>(
      CUSTOMER_API_ENDPOINTS.LIST,
      {
        params: toHttpParams({
          ...query,
          page: query.page - 1,
          sortOrder: "desc",
        }),
      }
    );
  }

  createCustomer(dto: CreateCustomerDto): Observable<ICustomerDTO> {
    return this.http.post<ICustomerDTO>(CUSTOMER_API_ENDPOINTS.CREATE, dto);
  }

  updateCustomer(id: number, dto: UpdateCustomerDto): Observable<ICustomerDTO> {
    return this.http.put<ICustomerDTO>(CUSTOMER_API_ENDPOINTS.UPDATE(id), dto);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(CUSTOMER_API_ENDPOINTS.UPDATE(id));
  }
}
