import { toSignal } from "@angular/core/rxjs-interop";
import { IUsuario } from "@/shared/interfaces/users.dto";
import { computed, inject, Injectable, signal } from "@angular/core";
import { matchPasswordsValidator } from "@/shared/utils/match-password-validator";
import { passwordStrengthValidator } from "@/shared/utils/password-streegth-validator";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EMPTY, catchError, map, Observable, tap, throwError } from "rxjs";
import { UsersApiService } from "./users.api.service";
import { UserFacadeService } from "./users.facade.service";

@Injectable()
export class UsersFormService {
  private fb = inject(FormBuilder);
  private api = inject(UsersApiService);
  private facade = inject(UserFacadeService);

  readonly isLoading = signal(false);
  readonly form: FormGroup = this.fb.group(
    {
      nome: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      perfil: ["", Validators.required],
      situacao: [true],
      senha: ["", [Validators.required, passwordStrengthValidator]],
      confirmarSenha: ["", Validators.required],
    },
    { validators: matchPasswordsValidator }
  );

  readonly senhaValue = toSignal(this.form.get("senha")!.valueChanges, {
    initialValue: "",
  });

  readonly passwordStrength = computed(() => {
    const p = this.senhaValue() ?? "";
    if (!p) return 0;
    const len = p.length;
    if (len < 6) return 0;
    if (len < 8) return 1;
    if (len < 10) return 2;
    if (len < 12) return 3;
    return 4;
  });

  readonly strengthInfo = computed(() => {
    const s = this.passwordStrength();
    if (s <= 1) return { text: "Fraca", textColor: "text-error-500", barColor: "bg-error-500" };
    if (s === 2) return { text: "Média", textColor: "text-warning-500", barColor: "bg-warning-500" };
    if (s === 3) return { text: "Boa", textColor: "text-brand-500", barColor: "bg-brand-500" };
    return { text: "Forte", textColor: "text-success-500", barColor: "bg-success-500" };
  });

  get nomeHint(): string {
    if (!this.nome.touched) return "";
    if (this.nome.hasError("required")) return "Campo obrigatório";
    if (this.nome.hasError("minlength")) return "Mínimo 3 caracteres";
    if (this.nome.hasError("maxlength")) return "Máximo 100 caracteres";
    return "";
  }

  get emailHint(): string {
    if (!this.email.touched) return "";
    if (this.email.hasError("required")) return "Campo obrigatório";
    if (this.email.hasError("email")) return "Email inválido";
    return "";
  }

  get senhaHint(): string {
    if (!this.senha.touched) return "";
    if (this.senha.hasError("required")) return "Campo obrigatório";
    if (this.senha.hasError("passwordStrength")) return "A senha deve ter pelo menos 6 caracteres";
    return "";
  }

  get confirmarSenhaHint(): string {
    if (this.confirmarSenha.invalid && this.confirmarSenha.touched) return "Campo obrigatório";
    if (this.form.hasError("passwordMismatch") && this.confirmarSenha.dirty) return "As palavras-passe não coincidem";
    return "";
  }

  initCreate(): void {
    this.form.reset({
      nome: "",
      email: "",
      perfil: "",
      situacao: true,
      senha: "",
      confirmarSenha: "",
    });
    this.senha.setValidators([Validators.required, passwordStrengthValidator]);
    this.confirmarSenha.setValidators([Validators.required]);
    this.senha.updateValueAndValidity();
    this.confirmarSenha.updateValueAndValidity();
  }

  initEdit(user: IUsuario): void {
    this.form.reset({
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      situacao: user.situacao === "ATIVO",
      senha: "",
      confirmarSenha: "",
    });
    this.senha.setValidators([passwordStrengthValidator]);
    this.confirmarSenha.setValidators(null);
    this.senha.updateValueAndValidity();
    this.confirmarSenha.updateValueAndValidity();
  }

  buildCreatePayload() {
    const { nome, email, perfil, situacao, senha } = this.form.value;
    return {
      nome: nome as string,
      email: email as string,
      perfil: perfil as string,
      situacao: (situacao ? "ATIVO" : "INATIVO") as string,
      senha: senha as string,
    };
  }

  submit(): Observable<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return EMPTY;
    }
    this.isLoading.set(true);
    const user = this.facade.editingUser();
    const obs$ = user
      ? this.api.updateUser(user.id, this.buildUpdatePayload())
      : this.api.createUser(this.buildCreatePayload());

    return obs$.pipe(
      tap(() => {
        this.facade.list.reload();
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        return throwError(() => err);
      }),
      map(() => void 0),
    );
  }

  buildUpdatePayload() {
    const { nome, email, perfil, situacao, senha } = this.form.value;
    return {
      nome: nome as string,
      email: email as string,
      perfil: perfil as string,
      situacao: (situacao ? "ATIVO" : "INATIVO") as string,
      ...(senha ? { senha: senha as string } : {}),
    };
  }

  get nome() {
    return this.form.get("nome")!;
  }
  get email() {
    return this.form.get("email")!;
  }
  get perfil() {
    return this.form.get("perfil")!;
  }
  get situacao() {
    return this.form.get("situacao")!;
  }
  get senha() {
    return this.form.get("senha")!;
  }
  get confirmarSenha() {
    return this.form.get("confirmarSenha")!;
  }
}
