import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { USERS_API_ENDPOINTS } from "./users.endpoints";
import { Observable } from "rxjs";
import {
  CreateUsuarioDto,
  IUsuario,
  UpdateUsuarioDto,
  UsuariosResponse,
} from "@/shared/interfaces/users.dto";
import { ListQuery } from "@/shared/config/listing/listing.dto";
import { toHttpParams } from "@/shared/config/listing/http.params-utils";

@Injectable({
  providedIn: "root",
})
export class UsersApiService {
  private http = inject(HttpClient);

  getUsers(query: ListQuery): Observable<UsuariosResponse> {
    return this.http.get<UsuariosResponse>(USERS_API_ENDPOINTS.LIST, {
      params: toHttpParams({
        ...query,
        page: query.page - 1,
      }),
    });
  }

  createUser(dto: CreateUsuarioDto): Observable<IUsuario> {
    console.log(dto);
    return this.http.post<IUsuario>(USERS_API_ENDPOINTS.CREATE, dto);
  }

  updateUser(id: number, dto: UpdateUsuarioDto): Observable<IUsuario> {
    return this.http.put<IUsuario>(USERS_API_ENDPOINTS.UPDATE(id), dto);
  }
}
