import { inject, Injectable, signal } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IContactPayloadDTO } from "@/shared/interfaces/contacts.dto";
import { CustomerApiService } from "../customers/customer.api.service";
import { SelectOption } from "@/shared/components/ui/select/select.component";

@Injectable()
export class ContactFormService {
  private readonly customerApi = inject(CustomerApiService);
  readonly clientesOptions = signal<SelectOption[]>([]);

  readonly form: FormGroup = new FormGroup({
    nome: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    telefone: new FormControl("", [Validators.required]),
    departamento: new FormControl("", [Validators.required]),
    empresa: new FormControl("", [Validators.required]),
    situacao: new FormControl(true),
  });

  private readonly errorMessages: Record<string, Record<string, string>> = {
    nome: { required: "Nome é obrigatório" },
    email: { required: "Email é obrigatório", email: "Email inválido" },
    telefone: { required: "Telefone é obrigatório" },
    departamento: { required: "Departamento é obrigatório" },
    empresa: { required: "Selecione uma empresa" },
  };

  constructor() {
    this.customerApi.getAllCostumers().subscribe({
      next: (customers) => {
        this.clientesOptions.set(
          customers.map((c) => ({
            label: c.nomeEmpresarial,
            value: String(c.id),
          }))
        );
      },
      error: (err) => {
        console.error(
          "Erro ao carregar clientes para o formulário de contacto",
          err
        );
      },
    });
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

  get empresa(): string {
    return this.form.get("empresa")?.value ?? "";
  }

  get clientes() {
    return this.clientesOptions();
  }

  getPayload(): IContactPayloadDTO {
    const { nome, email, telefone, departamento, empresa, situacao } =
      this.form.value;
    return {
      nome,
      email,
      telefone,
      departamento,
      clienteId: empresa,
      situacao: situacao ? "ATIVO" : "INATIVO",
    };
  }
}
