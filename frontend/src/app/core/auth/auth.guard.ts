import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { catchError, map, of, switchMap } from 'rxjs'
import { AuthService } from './auth.service'

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)
  const signIn = router.createUrlTree(['/signin'])

  if (!auth.accessToken && !auth.refreshToken) {
    return signIn
  }

  if (auth.currentUser()) {
    return true
  }

  const loadOrRefresh = auth.accessToken
    ? auth.loadMe()
    : auth.refresh().pipe(switchMap(() => auth.loadMe()))

  return loadOrRefresh.pipe(
    map(() => true),
    catchError(() => {
      auth.clearSession()
      return of(signIn)
    }),
  )
}
