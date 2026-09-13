import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { catchError, map, of, switchMap } from 'rxjs'
import { AuthService } from './auth.service'

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)
  const dashboard = router.createUrlTree(['/dashboard'])
  const signIn = router.createUrlTree(['/signin'])

  const check = () =>
    auth.currentUser()?.role === 'ADMIN' ? true : dashboard

  if (auth.currentUser() && auth.accessToken) {
    return check()
  }

  const bootstrap$ = auth.accessToken
    ? auth.loadMe()
    : auth.refresh().pipe(switchMap(() => auth.loadMe()))

  return bootstrap$.pipe(
    map(() => check()),
    catchError(() => {
      auth.clearSession()
      return of(signIn)
    }),
  )
}
