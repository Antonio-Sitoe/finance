import { HttpClient } from '@angular/common/http'
import { computed, inject, Injectable, signal } from '@angular/core'
import { finalize, Observable, switchMap, tap } from 'rxjs'
import { AUTH_API_ENDPOINTS } from './auth.endpoints'
import { LoginResponse, MeResponse } from './auth.models'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)

  /** Access token só em memória (Sprint 4). Refresh vive no cookie HttpOnly. */
  private accessTokenMemory: string | null = null

  readonly currentUser = signal<MeResponse | null>(null)
  readonly permissoes = computed(() => this.currentUser()?.permissoes ?? [])

  get accessToken(): string | null {
    return this.accessTokenMemory
  }

  login(email: string, senha: string): Observable<MeResponse> {
    return this.http
      .post<LoginResponse>(
        AUTH_API_ENDPOINTS.LOGIN,
        { email, senha },
        { withCredentials: true },
      )
      .pipe(
        tap((res) => this.persistAccessToken(res.accessToken)),
        switchMap(() => this.loadMe()),
      )
  }

  loadMe(): Observable<MeResponse> {
    return this.http
      .get<MeResponse>(AUTH_API_ENDPOINTS.ME, { withCredentials: true })
      .pipe(tap((me) => this.currentUser.set(me)))
  }

  refresh(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(AUTH_API_ENDPOINTS.REFRESH, {}, { withCredentials: true })
      .pipe(tap((res) => this.persistAccessToken(res.accessToken)))
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(AUTH_API_ENDPOINTS.LOGOUT, {}, { withCredentials: true })
      .pipe(finalize(() => this.clearSession()))
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(AUTH_API_ENDPOINTS.FORGOT_PASSWORD, { email })
  }

  resetPassword(
    token: string,
    novaSenha: string,
    confirmacao: string,
  ): Observable<void> {
    return this.http.post<void>(AUTH_API_ENDPOINTS.RESET_PASSWORD, {
      token,
      novaSenha,
      confirmacao,
    })
  }

  clearSession(): void {
    this.accessTokenMemory = null
    this.currentUser.set(null)
  }

  private persistAccessToken(accessToken: string): void {
    this.accessTokenMemory = accessToken
  }
}
