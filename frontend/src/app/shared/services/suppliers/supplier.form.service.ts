import { Injectable } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ISupplierPayload } from '@/shared/interfaces/suppliers.dto'
import { SITUATION } from '@/shared/interfaces/enum.dto'

@Injectable()
export class SupplierFormService {
  readonly form: FormGroup = new FormGroup({
    nomeEmpresarial: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    telefone: new FormControl('', [Validators.maxLength(15)]),
    website: new FormControl(''),
    endereco: new FormControl('', [Validators.required]),
    numero: new FormControl('', [Validators.required]),
    complemento: new FormControl(''),
    bairro: new FormControl('', [Validators.required]),
    cidade: new FormControl('', [Validators.required]),
    estado: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(2),
    ]),
    nota: new FormControl(5, [Validators.min(0), Validators.max(10)]),
    situacao: new FormControl(true),
  })

  private readonly errorMessages: Record<string, Record<string, string>> = {
    nomeEmpresarial: { required: 'Nome empresarial é obrigatório' },
    email: { email: 'Email inválido' },
    telefone: { maxlength: 'Telefone deve ter no máximo 15 caracteres' },
    endereco: { required: 'Endereço é obrigatório' },
    numero: { required: 'Número é obrigatório' },
    bairro: { required: 'Bairro é obrigatório' },
    cidade: { required: 'Cidade é obrigatória' },
    estado: {
      required: 'Estado é obrigatório',
      minlength: 'Estado deve ter exactamente 2 caracteres (ex: MP)',
      maxlength: 'Estado deve ter exactamente 2 caracteres (ex: MP)',
    },
    nota: { min: 'Nota mínima é 0', max: 'Nota máxima é 10' },
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

  getPayload(): ISupplierPayload {
    const value = this.form.value
    return {
      nomeEmpresarial: value.nomeEmpresarial,
      email: value.email || undefined,
      telefone: value.telefone || undefined,
      website: value.website || undefined,
      endereco: value.endereco,
      numero: value.numero,
      complemento: value.complemento || undefined,
      bairro: value.bairro,
      cidade: value.cidade,
      estado: value.estado,
      nota: Math.round(Number(value.nota ?? 0)),
      situacao: value.situacao ? SITUATION.ATIVO : SITUATION.INATIVO,
    }
  }
}
