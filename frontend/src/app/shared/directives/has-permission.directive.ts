import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
} from '@angular/core'
import { AuthService } from '@/core/auth/auth.service'

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<unknown>)
  private readonly viewContainer = inject(ViewContainerRef)
  private readonly auth = inject(AuthService)

  private codigo = ''

  constructor() {
    effect(() => {
      // re-run when user/permissions change
      this.auth.currentUser()
      this.auth.permissoes()
      this.render()
    })
  }

  @Input()
  set hasPermission(codigo: string) {
    this.codigo = codigo ?? ''
    this.render()
  }

  private render(): void {
    const user = this.auth.currentUser()
    const allowed =
      user?.role === 'ADMIN' ||
      (user?.permissoes ?? []).includes(this.codigo)

    this.viewContainer.clear()
    if (allowed && this.codigo) {
      this.viewContainer.createEmbeddedView(this.templateRef)
    }
  }
}
