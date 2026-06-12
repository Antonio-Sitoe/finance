import { AbstractControl, ValidationErrors } from "@angular/forms";

export function atLeastOneTypeValidator(
  group: AbstractControl
): ValidationErrors | null {
  const debito = group.get("debito")?.value;
  const credito = group.get("credito")?.value;
  return debito || credito ? null : { tipoRequired: true };
}
