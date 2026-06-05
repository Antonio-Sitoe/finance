import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { CONTACTO_ENDPOINTS } from './contacto.endpoint'
import { IContactoDTO } from '@/shared/interfaces/contacts.dto'
import { ListQuery, PageResult } from '@/shared/config/listing/listing.dto'

@Injectable({
  providedIn: 'root',
})
export class ContactoApiService {
  private readonly http = inject(HttpClient)

  getByCliente(clienteId: number, query: ListQuery): Observable<PageResult<IContactoDTO>> {
    const filters = query.filters ?? {}
    let params = new HttpParams()
      .set('page', String(query.page - 1))
      .set('size', String(query.size))

    if (filters['nome']) params = params.set('nome', String(filters['nome']))
    if (filters['departamento']) params = params.set('departamento', String(filters['departamento']))
    if (filters['situacao']) params = params.set('situacao', String(filters['situacao']))

    return this.http.get<PageResult<IContactoDTO>>(
      CONTACTO_ENDPOINTS.BY_CLIENTE(clienteId),
      { params },
    )
  }
}
