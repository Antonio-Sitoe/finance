import { Injectable } from "@angular/core";
import { SITUATION } from "@/shared/interfaces/enum.dto";
import { ICategoryPayload } from "@/shared/interfaces/categories.dto";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { atLeastOneTypeValidator } from "@/shared/utils/at-Least-One-Type-validator";

@Injectable()
export class CategoryFormService {
  readonly form: FormGroup = new FormGroup(
    {
      nome: new FormControl("", [Validators.required]),
      debito: new FormControl(false),
      credito: new FormControl(false),
      categoriaPaiId: new FormControl(""),
      descricao: new FormControl(""),
      situacao: new FormControl(true),
    },
    { validators: [atLeastOneTypeValidator] }
  );

  private readonly errorMessages: Record<string, Record<string, string>> = {
    nome: { required: "Nome é obrigatório" },
  };

  hasTipoError(): boolean {
    const debito = this.form.get("debito");
    const credito = this.form.get("credito");
    const interacted = !!(
      debito?.dirty ||
      debito?.touched ||
      credito?.dirty ||
      credito?.touched
    );
    return this.form.hasError("tipoRequired") && interacted;
  }

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

  getPayload(): ICategoryPayload {
    const value = this.form.value;
    return {
      nome: value.nome,
      debito: !!value.debito,
      credito: !!value.credito,
      categoriaPaiId: value.categoriaPaiId
        ? Number(value.categoriaPaiId)
        : undefined,
      descricao: value.descricao || undefined,
      situacao: value.situacao ? SITUATION.ATIVO : SITUATION.INATIVO,
    };
  }
}
