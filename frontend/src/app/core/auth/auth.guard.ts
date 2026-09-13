import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { catchError, map, of, switchMap } from 'rxjs'
import { AuthService } from './auth.service'

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)
  const signIn = router.createUrlTree(['/signin'])

  if (auth.currentUser() && auth.accessToken) {
    return true
  }

  // F5: access token em memória some → refresh via cookie HttpOnly, depois /me
  const bootstrap$ = auth.accessToken
    ? auth.loadMe()
    : auth.refresh().pipe(switchMap(() => auth.loadMe()))

  return bootstrap$.pipe(
    map(() => true),
    catchError(() => {
      auth.clearSession()
      return of(signIn)
    }),
  )
}
