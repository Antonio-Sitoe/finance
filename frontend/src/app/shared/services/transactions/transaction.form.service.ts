import { Injectable } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ITransactionPayload, TipoLancamento } from '@/shared/interfaces/transactions.dto'

@Injectable()
export class TransactionFormService {
  readonly form: FormGroup = new FormGroup({
    tipo: new FormControl<TipoLancamento>('DESPESA', [Validators.required]),
    descricao: new FormControl('', [Validators.required]),
    valor: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    dataLancamento: new FormControl(''),
    dataVencimento: new FormControl('', [Validators.required]),
    contaId: new FormControl('', [Validators.required]),
    categoriaId: new FormControl('', [Validators.required]),
    clienteId: new FormControl(''),
    fornecedorId: new FormControl(''),
  })

  private readonly errorMessages: Record<string, Record<string, string>> = {
    descricao: { required: 'Descrição é obrigatória' },
    valor: { required: 'Valor é obrigatório', min: 'Valor deve ser maior que zero' },
    dataVencimento: { required: 'Data de vencimento é obrigatória' },
    contaId: { required: 'Conta é obrigatória' },
    categoriaId: { required: 'Categoria é obrigatória' },
  }

  get tipo(): TipoLancamento {
    return this.form.get('tipo')?.value ?? 'DESPESA'
  }

  setTipo(tipo: TipoLancamento): void {
    this.form.patchValue({ tipo, clienteId: '', fornecedorId: '' })
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

  getPayload(): ITransactionPayload {
    const v = this.form.value
    return {
      tipo: v.tipo,
      descricao: v.descricao,
      valor: Number(v.valor),
      dataLancamento: v.dataLancamento ? `${v.dataLancamento}T00:00:00` : undefined,
      dataVencimento: `${v.dataVencimento}T00:00:00`,
      contaId: Number(v.contaId),
      categoriaId: Number(v.categoriaId),
      clienteId: v.clienteId ? Number(v.clienteId) : undefined,
      fornecedorId: v.fornecedorId ? Number(v.fornecedorId) : undefined,
    }
  }

  patchFromTransaction(t: {
    tipo: TipoLancamento
    descricao: string
    valor: number
    dataLancamento: string | null
    dataVencimento: string
    conta: { id: number } | null
    categoria: { id: number } | null
    cliente: { id: number } | null
    fornecedor: { id: number } | null
  }): void {
    this.form.patchValue({
      tipo: t.tipo,
      descricao: t.descricao,
      valor: t.valor,
      dataLancamento: t.dataLancamento ? t.dataLancamento.slice(0, 10) : '',
      dataVencimento: t.dataVencimento.slice(0, 10),
      contaId: t.conta ? String(t.conta.id) : '',
      categoriaId: t.categoria ? String(t.categoria.id) : '',
      clienteId: t.cliente ? String(t.cliente.id) : '',
      fornecedorId: t.fornecedor ? String(t.fornecedor.id) : '',
    })
  }

  reset(): void {
    this.form.reset({ tipo: 'DESPESA' })
  }
}
