import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import {
  PermissaoCatalog,
  RoleCreateRequest,
  RoleDetail,
  RoleListItem,
  RoleUpdateRequest,
} from '@/shared/interfaces/roles.dto'
import { ROLES_API_ENDPOINTS } from './roles.endpoints'

@Injectable({ providedIn: 'root' })
export class RolesApiService {
  private readonly http = inject(HttpClient)

  list(): Observable<RoleListItem[]> {
    return this.http.get<RoleListItem[]>(ROLES_API_ENDPOINTS.LIST)
  }

  getById(id: number): Observable<RoleDetail> {
    return this.http.get<RoleDetail>(ROLES_API_ENDPOINTS.BY_ID(id))
  }

  create(dto: RoleCreateRequest): Observable<RoleListItem> {
    return this.http.post<RoleListItem>(ROLES_API_ENDPOINTS.CREATE, dto)
  }

  update(id: number, dto: RoleUpdateRequest): Observable<RoleDetail> {
    return this.http.put<RoleDetail>(ROLES_API_ENDPOINTS.BY_ID(id), dto)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(ROLES_API_ENDPOINTS.BY_ID(id))
  }

  catalog(): Observable<PermissaoCatalog> {
    return this.http.get<PermissaoCatalog>(ROLES_API_ENDPOINTS.PERMISSOES)
  }
}
