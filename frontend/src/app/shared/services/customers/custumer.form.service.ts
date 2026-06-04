import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class CustumerFormService {
  readonly form: FormGroup = new FormGroup({
    nomeEmpresarial: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    telefone: new FormControl("", [Validators.required]),
    endereco: new FormControl("", [Validators.required]),
    numero: new FormControl("", [Validators.required]),
    complemento: new FormControl("", [Validators.required]),
    cidade: new FormControl("", [Validators.required]),
    estado: new FormControl("", [Validators.required]),
    nota: new FormControl(0, [Validators.min(1)]),
    situacao: new FormControl("ATIVO", [Validators.required]),
  });

  private readonly errorMessages: Record<string, Record<string, string>> = {
    nomeEmpresarial: { required: "Nome empresarial é obrigatório" },
    email: { required: "Email é obrigatório", email: "Email inválido" },
    telefone: { required: "Telefone é obrigatório" },
    endereco: { required: "Endereço é obrigatório" },
    numero: { required: "Número é obrigatório" },
    complemento: { required: "Complemento é obrigatório" },
    cidade: { required: "Cidade é obrigatória" },
    estado: { required: "Distrito / Estado é obrigatório" },
  };

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors || !(control.dirty || control.touched)) return "";
    const messages = this.errorMessages[field] ?? {};
    const firstKey = Object.keys(control.errors)[0];
    return messages[firstKey] ?? "Valor inválido";
  }
}
