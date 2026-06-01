import { AbstractControl, ValidationErrors } from "@angular/forms";

export function matchPasswordsValidator(
  group: AbstractControl
): ValidationErrors | null {
  const senha = group.get("senha")?.value as string;
  const confirmar = group.get("confirmarSenha")?.value as string;
  if (!senha || !confirmar) return null;
  return senha !== confirmar ? { passwordMismatch: true } : null;
}
