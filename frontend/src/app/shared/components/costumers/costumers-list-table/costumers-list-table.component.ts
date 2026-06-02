import { Component, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import {
  DataTableComponent,
  ColumnDef,
} from "@/shared/components/ui/datatable/datatable";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { CheckboxComponent } from "@/shared/components/ui/input/checkbox.component";
import { InputFieldComponent } from "@/shared/components/ui/input/input-field.component";
import { SelectComponent } from "@/shared/components/ui/select/select.component";
import { CostumerDetailDrawerComponent } from "@/shared/components/costumers/costumer-detail-drawer/costumer-detail-drawer.component";
import { CreateAndEditCostumerComponent } from "@/shared/components/costumers/create-and-edit-costumer/create-and-edit-costumer.component";
import { ICliente } from "@/shared/interfaces/costumers.dto";
import {
  SolarDynamicIcon,
  MagnifierBold,
  Pen2Bold,
  EyeBold,
  BuildingsBold,
  UsersGroupRoundedBold,
} from "@solar-icons/angular";

@Component({
  selector: "app-costumers-list-table",
  imports: [
    DatePipe,
    DataTableComponent,
    BadgeComponent,
    CheckboxComponent,
    InputFieldComponent,
    SelectComponent,
    CostumerDetailDrawerComponent,
    CreateAndEditCostumerComponent,
    SolarDynamicIcon,
  ],
  templateUrl: "./costumers-list-table.component.html",
})
export class CostumersListTableComponent {
  private readonly router = inject(Router);

  readonly MagnifierBold = MagnifierBold;
  readonly Pen2Bold = Pen2Bold;
  readonly EyeBold = EyeBold;
  readonly BuildingsBold = BuildingsBold;
  readonly UsersGroupRoundedBold = UsersGroupRoundedBold;

  readonly drawerOpen = signal(false);
  readonly detailDrawerOpen = signal(false);
  readonly selectedCostumer = signal<ICliente | null>(null);

  columns: ColumnDef[] = [
    { id: "empresa", label: "Empresa" },
    { id: "telefone", label: "Telefone" },
    { id: "rating", label: "Rating" },
    { id: "situacao", label: "Estado", align: "center" },
    { id: "createdAt", label: "Data de Registo" },
    { id: "acoes", label: "", align: "right" },
  ];

  statusOptions = [
    { label: "Todos os estados", value: "" },
    { label: "Ativo", value: "ATIVO" },
    { label: "Inativo", value: "INATIVO" },
  ];

  classificacaoOptions = [
    { label: "Todas as classificações", value: "" },
    { label: "VIP - Segmento Institucional", value: "VIP" },
    { label: "Normal", value: "NORMAL" },
  ];

  mockData: ICliente[] = [
    {
      id: 1,
      nomeEmpresarial: "Global Trade Solutions S.A.",
      email: "contacto@globaltrade.pt",
      telefone: "+351 210 998 776",
      endereco: "Avenida da Liberdade, 110",
      numero: "110",
      complemento: "4º Piso, Ala Norte",
      cidade: "Lisboa",
      distrito: "Lisboa",
      classificacaoRisco: 4,
      classificacao: "Cliente VIP - Segmento Institucional",
      situacao: "ATIVO",
      vip: true,
      createdAt: "2024-03-15T10:00:00Z",
      contactos: [
        { id: 1, nome: "Ana Martins", cargo: "Diretora Financeira - CFO", departamento: "Financeiro", telefone: "+351 912 345 678", email: "ana.martins@globaltrade.pt", situacao: "ATIVO", ultimaAtividade: "Hoje, 10:45" },
        { id: 2, nome: "Ricardo Costa", cargo: "Gestor de Compras", departamento: "Compras", telefone: "+351 934 567 890", email: "ricardo.costa@globaltrade.pt", situacao: "ATIVO", ultimaAtividade: "Ontem, 14:20" },
        { id: 3, nome: "Sandra Teixeira", cargo: "Assistente Administrativa", departamento: "Administrativo", telefone: "+351 961 122 334", email: "sandra.t@globaltrade.pt", situacao: "INATIVO", ultimaAtividade: "3 dias atrás" },
      ],
    },
    {
      id: 2,
      nomeEmpresarial: "TechVision Lda.",
      email: "geral@techvision.ao",
      telefone: "+244 923 456 789",
      cidade: "Luanda",
      classificacaoRisco: 3,
      classificacao: "Normal",
      situacao: "ATIVO",
      vip: false,
      createdAt: "2024-05-20T08:30:00Z",
      contactos: [{ nome: "Pedro Alves", cargo: "Diretor Geral" }],
    },
    {
      id: 3,
      nomeEmpresarial: "Construtora Norte S.A.",
      email: "info@construtora-norte.pt",
      telefone: "+351 253 112 233",
      cidade: "Braga",
      classificacaoRisco: 2,
      classificacao: "Normal",
      situacao: "INATIVO",
      vip: false,
      createdAt: "2023-11-08T14:00:00Z",
      contactos: [],
    },
  ];

  openEdit(costumer?: ICliente): void {
    this.selectedCostumer.set(costumer ?? null);
    this.detailDrawerOpen.set(false);
    this.drawerOpen.set(true);
  }

  openDetail(costumer: ICliente): void {
    this.selectedCostumer.set(costumer);
    this.detailDrawerOpen.set(true);
  }

  openContacts(costumer: ICliente): void {
    this.router.navigate(['/costumers', costumer.id, 'contacts']);
  }
}
