import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, switchMap, throwError } from 'rxjs'
import { AuthService } from './auth.service'

const PUBLIC_AUTH_URLS = [
  '/auth/login',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
]

function isPublicAuthRequest(url: string): boolean {
  return PUBLIC_AUTH_URLS.some((path) => url.includes(path))
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService)
  const router = inject(Router)
  const token = auth.accessToken

  let authReq = req.clone({ withCredentials: true })
  if (token) {
    authReq = authReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isPublicAuthRequest(req.url)) {
        return auth.refresh().pipe(
          switchMap(() =>
            next(
              authReq.clone({
                setHeaders: { Authorization: `Bearer ${auth.accessToken}` },
              }),
            ),
          ),
          catchError((refreshErr) => {
            auth.clearSession()
            router.navigate(['/signin'])
            return throwError(() => refreshErr)
          }),
        )
      }
      return throwError(() => err)
    }),
  )
}
