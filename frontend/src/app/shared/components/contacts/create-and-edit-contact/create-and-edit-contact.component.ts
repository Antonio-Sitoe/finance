import {
  Input,
  Output,
  signal,
  computed,
  Component,
  OnInit,
  OnChanges,
  EventEmitter,
  SimpleChanges,
  inject,
} from "@angular/core";

import {
  DEPARTMENT_OPTIONS,
  DEPARTMENT_SHORTCUTS,
} from "@/shared/constants/contacts.columns";

import {
  IContactPayloadDTO,
  IContactDTO,
} from "@/shared/interfaces/contacts.dto";
import { LabelComponent } from "@/shared/components/ui/label/label.component";
import { SwitchComponent } from "@/shared/components/ui/input/switch.component";
import { ButtonComponent } from "@/shared/components/ui/button/button.component";
import { DrawerComponent } from "@/shared/components/ui/drawer/drawer.component";
import { SolarDynamicIcon } from "@solar-icons/angular";
import { ContactFormService } from "@/shared/services/contactos/contact.form.service";
import { CustomerApiService } from "@/shared/services/customers/customer.api.service";
import { ContactoApiService } from "@/shared/services/contactos/contacto.api.service";
import { InputFieldComponent } from "@/shared/components/ui/input/input-field.component";
import { ReactiveFormsModule } from "@angular/forms";
import {
  SelectComponent,
  SelectOption,
} from "@/shared/components/ui/select/select.component";
import { ToastService } from "@/shared/services/toast.service";
import { ContactsFacadeService } from "@/shared/services/contactos/contacts.facade.service";

@Component({
  selector: "app-create-and-edit-contact",
  imports: [
    LabelComponent,
    SelectComponent,
    SwitchComponent,
    ButtonComponent,
    DrawerComponent,
    SolarDynamicIcon,
    ReactiveFormsModule,
    InputFieldComponent,
  ],
  templateUrl: "./create-and-edit-contact.component.html",
  providers: [ContactFormService],
})
export class CreateAndEditContactComponent implements OnInit, OnChanges {
  @Input() open = false;
  @Input() contact: IContactDTO | null = null;
  @Input() lockedClienteId: number | null = null;
  @Input() lockedClienteNome: string | null = null;
  @Output() openChange = new EventEmitter<boolean>();

  readonly toast = inject(ToastService);
  readonly facade = inject(ContactsFacadeService);
  readonly contactService = inject(ContactFormService);
  readonly customerApi = inject(CustomerApiService);
  readonly api = inject(ContactoApiService);
  readonly form = this.contactService.form;
  readonly isEditing = computed(() => !!this.contact);
  readonly isLoading = signal(false);

  readonly departamentosRapidos = DEPARTMENT_SHORTCUTS;
  readonly departamentoOptions = DEPARTMENT_OPTIONS;
  readonly empresaOptions = signal<SelectOption[]>([]);

  ngOnInit(): void {
    this.customerApi.getAllCostumers().subscribe((clientes) => {
      this.empresaOptions.set(
        clientes.map((c) => ({ value: String(c.id), label: c.nomeEmpresarial }))
      );
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["open"]?.currentValue === true) {
      if (this.contact) {
        this.form.patchValue({
          nome: this.contact.nome,
          email: this.contact.email ?? "",
          telefone: this.contact.telefone ?? "",
          departamento: this.contact.departamento ?? "",
          empresa: this.contact.clienteId ? String(this.contact.clienteId) : "",
          situacao: this.contact.situacao === "ATIVO",
        });
      } else {
        this.form.reset({
          situacao: true,
          empresa: this.lockedClienteId ? String(this.lockedClienteId) : "",
        });
      }
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const payload = this.contactService.getPayload();

    const request$ = this.contact
      ? this.api.update(this.contact.id, payload)
      : this.api.create(payload);

    request$.subscribe({
      next: (response) => {
        this.toast.success(
          this.isEditing()
            ? "Contacto atualizado: " + response.nome
            : "Contacto criado: " + response.nome
        );
        this.facade.refresh();
        this.openChange.emit(false);
        this.isLoading.set(false);
        this.close();
      },
      error: (error) => {
        const body = error?.error;
        const fieldErrors: Record<string, string> | undefined =
          body?.fieldErrors;
        const msg = fieldErrors
          ? Object.values(fieldErrors).join(", ")
          : body?.message || error?.message || "Erro ao gravar contacto";
        this.toast.error("Falha", msg);
        this.isLoading.set(false);
      },
    });
  }

  setDepartamento(value: string): void {
    this.form.get("departamento")?.setValue(value);
  }

  close(): void {
    this.openChange.emit(false);
  }

  isInvalid(field: string): boolean {
    return this.contactService.isInvalid(field);
  }

  getError(field: string): string {
    return this.contactService.getError(field);
  }

  get isFormValid(): boolean {
    return this.form.valid;
  }

  get departamento(): string {
    return this.form.get("departamento")?.value ?? "";
  }
}
