import { inject, Injectable } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { toSignal } from '@angular/core/rxjs-interop'
import { IUsuario } from '@/shared/interfaces/users.dto'

function passwordStrengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value as string
  if (!value) return null
  const missing: string[] = []
  if (value.length < 8) missing.push('minLength')
  if (!/[A-Z]/.test(value)) missing.push('uppercase')
  if (!/[0-9]/.test(value)) missing.push('number')
  if (!/[^A-Za-z0-9]/.test(value)) missing.push('special')
  return missing.length ? { passwordStrength: missing } : null
}

function matchPasswordsValidator(
  group: AbstractControl
): ValidationErrors | null {
  const senha = group.get('senha')?.value as string
  const confirmar = group.get('confirmarSenha')?.value as string
  if (!senha || !confirmar) return null
  return senha !== confirmar ? { passwordMismatch: true } : null
}

@Injectable()
export class UsersFormService {
  private fb = inject(FormBuilder)

  readonly form: FormGroup = this.fb.group(
    {
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      perfil: ['', Validators.required],
      situacao: [true],
      senha: ['', [Validators.required, passwordStrengthValidator]],
      confirmarSenha: ['', Validators.required],
    },
    { validators: matchPasswordsValidator }
  )

  readonly senhaValue = toSignal(this.form.get('senha')!.valueChanges, {
    initialValue: '',
  })

  get nome() {
    return this.form.get('nome')!
  }
  get email() {
    return this.form.get('email')!
  }
  get perfil() {
    return this.form.get('perfil')!
  }
  get situacao() {
    return this.form.get('situacao')!
  }
  get senha() {
    return this.form.get('senha')!
  }
  get confirmarSenha() {
    return this.form.get('confirmarSenha')!
  }

  initCreate(): void {
    this.form.reset({
      nome: '',
      email: '',
      perfil: '',
      situacao: true,
      senha: '',
      confirmarSenha: '',
    })
    this.senha.setValidators([Validators.required, passwordStrengthValidator])
    this.confirmarSenha.setValidators([Validators.required])
    this.senha.updateValueAndValidity()
    this.confirmarSenha.updateValueAndValidity()
  }

  initEdit(user: IUsuario): void {
    this.form.reset({
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      situacao: user.situacao === 'ATIVO',
      senha: '',
      confirmarSenha: '',
    })
    this.senha.setValidators([passwordStrengthValidator])
    this.confirmarSenha.setValidators(null)
    this.senha.updateValueAndValidity()
    this.confirmarSenha.updateValueAndValidity()
  }

  buildCreatePayload() {
    const { nome, email, perfil, situacao, senha } = this.form.value
    return {
      nome: nome as string,
      email: email as string,
      perfil: perfil as string,
      situacao: (situacao ? 'ATIVO' : 'INATIVO') as string,
      senha: senha as string,
    }
  }

  buildUpdatePayload() {
    const { nome, email, perfil, situacao, senha } = this.form.value
    return {
      nome: nome as string,
      email: email as string,
      perfil: perfil as string,
      situacao: (situacao ? 'ATIVO' : 'INATIVO') as string,
      ...(senha ? { senha: senha as string } : {}),
    }
  }
}
