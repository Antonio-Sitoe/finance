import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passwordStrengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  const trimmed = value.trim();
  const missing: string[] = [];
  if (trimmed.length < 6) missing.push("minLength");
  return missing.length ? { passwordStrength: missing } : null;
}
