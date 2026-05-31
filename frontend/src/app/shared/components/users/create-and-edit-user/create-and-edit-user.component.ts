import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { LabelComponent } from '@/shared/components/ui/label/label.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import {
  SelectComponent,
  SelectOption,
} from '@/shared/components/ui/select/select.component'
import { SwitchComponent } from '@/shared/components/ui/input/switch.component'
import { ButtonComponent } from '@/shared/components/ui/button/button.component'
import { SolarDynamicIcon } from '@solar-icons/angular'
import { EyeBold, EyeClosedBold } from '@solar-icons/angular'
import { UsersFormService } from '@/shared/services/users/users.form.service'
import { UserFacadeService } from '@/shared/services/users/users.facade.service'
import { UsersApiService } from '@/shared/services/users/users.api.service'

@Component({
  selector: 'app-create-and-edit-user',
  imports: [
    ReactiveFormsModule,
    DrawerComponent,
    LabelComponent,
    InputFieldComponent,
    SelectComponent,
    SwitchComponent,
    ButtonComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './create-and-edit-user.component.html',
  providers: [UsersFormService],
})
export class CreateAndEditUserComponent implements OnChanges {
  @Input() open = false
  @Output() openChange = new EventEmitter<boolean>()

  readonly EyeBold = EyeBold
  readonly EyeClosedBold = EyeClosedBold

  readonly userForm = inject(UsersFormService)
  readonly facade = inject(UserFacadeService)
  readonly api = inject(UsersApiService)

  readonly showPassword = signal(false)
  readonly showConfirmPassword = signal(false)
  readonly isLoading = signal(false)

  readonly isEditing = computed(() => !!this.facade.editingUser())

  readonly roleOptions: SelectOption[] = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'USER', label: 'Utilizador' },
  ]

  readonly passwordStrength = computed(() => {
    const p = this.userForm.senhaValue() ?? ''
    if (!p) return 0
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  })

  readonly strengthInfo = computed(() => {
    const s = this.passwordStrength()
    if (s <= 1)
      return { text: 'Fraca', textColor: 'text-error-500', barColor: 'bg-error-500' }
    if (s === 2)
      return { text: 'Média', textColor: 'text-warning-500', barColor: 'bg-warning-500' }
    if (s === 3)
      return { text: 'Boa', textColor: 'text-brand-500', barColor: 'bg-brand-500' }
    return { text: 'Forte', textColor: 'text-success-500', barColor: 'bg-success-500' }
  })

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      const user = this.facade.editingUser()
      if (user) {
        this.userForm.initEdit(user)
      } else {
        this.userForm.initCreate()
      }
      this.showPassword.set(false)
      this.showConfirmPassword.set(false)
    }
  }

  close(): void {
    this.openChange.emit(false)
  }

  submit(): void {
    if (this.userForm.form.invalid) {
      this.userForm.form.markAllAsTouched()
      return
    }
    this.isLoading.set(true)
    const user = this.facade.editingUser()
    const obs$ = user
      ? this.api.updateUser(user.id, this.userForm.buildUpdatePayload())
      : this.api.createUser(this.userForm.buildCreatePayload())

    obs$.subscribe({
      next: () => {
        this.isLoading.set(false)
        this.facade.list.reload()
        this.close()
      },
      error: () => {
        this.isLoading.set(false)
      },
    })
  }
}
