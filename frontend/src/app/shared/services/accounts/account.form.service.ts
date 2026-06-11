import { Injectable } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { IAccountPayload } from '@/shared/interfaces/accounts.dto'
import { SITUATION } from '@/shared/interfaces/enum.dto'

@Injectable()
export class AccountFormService {
  readonly form: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    agencia: new FormControl('', [Validators.required]),
    contaCorrente: new FormControl('', [Validators.required]),
    observacao: new FormControl('', [Validators.required]),
    situacao: new FormControl(true),
  })

  private readonly errorMessages: Record<string, Record<string, string>> = {
    nome: { required: 'Nome é obrigatório' },
    agencia: { required: 'Agência é obrigatória' },
    contaCorrente: { required: 'Conta corrente é obrigatória' },
    observacao: { required: 'Observação é obrigatória' },
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field)
    return !!(control?.invalid && (control.dirty || control.touched))
  }

  getError(field: string): string {
    const control = this.form.get(field)
    if (!control?.errors || !(control.dirty || control.touched)) return ''
    const messages = this.errorMessages[field] ?? {}
    const firstKey = Object.keys(control.errors)[0]
    return messages[firstKey] ?? 'Valor inválido'
  }

  getPayload(): IAccountPayload {
    const value = this.form.value
    return {
      nome: value.nome,
      agencia: value.agencia,
      contaCorrente: value.contaCorrente,
      observacao: value.observacao,
      situacao: value.situacao ? SITUATION.ATIVO : SITUATION.INATIVO,
    }
  }
}
