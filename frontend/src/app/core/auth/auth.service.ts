import { HttpClient } from '@angular/common/http'
import { computed, inject, Injectable, signal } from '@angular/core'
import { finalize, Observable, switchMap, tap } from 'rxjs'
import { AUTH_API_ENDPOINTS } from './auth.endpoints'
import { LoginResponse, MeResponse } from './auth.models'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)

  readonly currentUser = signal<MeResponse | null>(null)
  readonly permissoes = computed(() => this.currentUser()?.permissoes ?? [])

  get accessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY)
  }

  get refreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY)
  }

  login(email: string, senha: string): Observable<MeResponse> {
    return this.http
      .post<LoginResponse>(AUTH_API_ENDPOINTS.LOGIN, { email, senha })
      .pipe(
        tap((res) => this.persistTokens(res)),
        switchMap(() => this.loadMe()),
      )
  }

  loadMe(): Observable<MeResponse> {
    return this.http
      .get<MeResponse>(AUTH_API_ENDPOINTS.ME)
      .pipe(tap((me) => this.currentUser.set(me)))
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = this.refreshToken
    return this.http
      .post<LoginResponse>(AUTH_API_ENDPOINTS.REFRESH, { refreshToken })
      .pipe(tap((res) => this.persistTokens(res)))
  }

  logout(): Observable<void> {
    const refreshToken = this.refreshToken
    return this.http
      .post<void>(AUTH_API_ENDPOINTS.LOGOUT, { refreshToken })
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
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    this.currentUser.set(null)
  }

  private persistTokens(res: LoginResponse): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken)
    sessionStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken)
  }
}
