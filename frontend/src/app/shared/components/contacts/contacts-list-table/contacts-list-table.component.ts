import { Component, computed, inject, signal } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import {
  DataTableComponent,
  ColumnDef,
} from '@/shared/components/ui/datatable/datatable'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { AvatarTextComponent } from '@/shared/components/ui/avatar/avatar-text.component'
import { CheckboxComponent } from '@/shared/components/ui/input/checkbox.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SelectComponent } from '@/shared/components/ui/select/select.component'
import { ButtonComponent } from '@/shared/components/ui/button/button.component'
import { ModalComponent } from '@/shared/components/ui/modal/modal.component'
import { ContactDetailDrawerComponent } from '@/shared/components/contacts/contact-detail-drawer/contact-detail-drawer.component'
import { CreateAndEditContactComponent } from '@/shared/components/contacts/create-and-edit-contact/create-and-edit-contact.component'
import { IContact } from '@/shared/interfaces/contacts.dto'
import {
  SolarDynamicIcon,
  MagnifierBold,
  Pen2Bold,
  EyeBold,
  MenuDotsBold,
  DangerTriangleBold,
} from '@solar-icons/angular'

@Component({
  selector: 'app-contacts-list-table',
  imports: [
    RouterModule,
    DataTableComponent,
    BadgeComponent,
    AvatarTextComponent,
    CheckboxComponent,
    InputFieldComponent,
    SelectComponent,
    ModalComponent,
    ContactDetailDrawerComponent,
    CreateAndEditContactComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './contacts-list-table.component.html',
})
export class ContactsListTableComponent {
  private readonly router = inject(Router)

  readonly MagnifierBold = MagnifierBold
  readonly Pen2Bold = Pen2Bold
  readonly EyeBold = EyeBold
  readonly MenuDotsBold = MenuDotsBold
  readonly DangerTriangleBold = DangerTriangleBold

  readonly drawerOpen = signal(false)
  readonly detailDrawerOpen = signal(false)
  readonly deactivateOpen = signal(false)
  readonly selectedContact = signal<IContact | null>(null)

  readonly searchTerm = signal('')
  readonly filterEmpresa = signal('')
  readonly filterDepartamento = signal('')
  readonly filterSituacao = signal('')

  columns: ColumnDef[] = [
    { id: 'contacto', label: 'Nome / Email' },
    { id: 'departamento', label: 'Departamento' },
    { id: 'telefone', label: 'Telefone' },
    { id: 'empresa', label: 'Empresa' },
    { id: 'situacao', label: 'Estado', align: 'center' },
    { id: 'acoes', label: '', align: 'right' },
  ]

  readonly mockData: IContact[] = [
    { id: 1, nome: 'Ana Martins', cargo: 'Diretora Financeira - CFO', departamento: 'Financeiro', empresaNome: 'Global Trade Solutions S.A.', empresaId: 1, telefone: '+351 912 345 678', email: 'ana.martins@globaltrade.pt', situacao: 'ATIVO', createdAt: '2024-01-10T09:00:00Z', ultimaAtividade: 'Hoje, 10:45' },
    { id: 2, nome: 'Ricardo Costa', cargo: 'Gestor de Compras', departamento: 'Compras', empresaNome: 'Global Trade Solutions S.A.', empresaId: 1, telefone: '+351 934 567 890', email: 'ricardo.costa@globaltrade.pt', situacao: 'ATIVO', createdAt: '2024-01-15T10:00:00Z', ultimaAtividade: 'Ontem, 14:20' },
    { id: 3, nome: 'Sandra Teixeira', cargo: 'Assistente Administrativa', departamento: 'Administrativo', empresaNome: 'Global Trade Solutions S.A.', empresaId: 1, telefone: '+351 961 122 334', email: 'sandra.t@globaltrade.pt', situacao: 'INATIVO', createdAt: '2023-11-20T08:00:00Z', ultimaAtividade: '3 dias atrás' },
    { id: 4, nome: 'Pedro Alves', cargo: 'Diretor Geral', departamento: 'Direção', empresaNome: 'TechVision Lda.', empresaId: 2, telefone: '+244 923 456 789', email: 'pedro.alves@techvision.ao', situacao: 'ATIVO', createdAt: '2024-02-01T11:00:00Z', ultimaAtividade: 'Hoje, 09:00' },
    { id: 5, nome: 'João Silva', cargo: 'Engenheiro de Software', departamento: 'Tecnologia', empresaNome: 'TechVision Lda.', empresaId: 2, telefone: '+244 912 345 000', email: 'joao.silva@techvision.ao', situacao: 'ATIVO', createdAt: '2024-03-05T14:00:00Z', ultimaAtividade: 'Hoje, 11:30' },
    { id: 6, nome: 'Maria Fernandes', cargo: 'Diretora de Projetos', departamento: 'Operações', empresaNome: 'Construtora Norte S.A.', empresaId: 3, telefone: '+351 253 998 001', email: 'm.fernandes@construtora-norte.pt', situacao: 'INATIVO', createdAt: '2023-09-12T07:00:00Z', ultimaAtividade: '15 dias atrás' },
  ]

  readonly empresaOptions = computed(() => {
    const empresas = [...new Set(this.mockData.map(c => c.empresaNome).filter(Boolean))] as string[]
    return [{ label: 'Todas as empresas', value: '' }, ...empresas.map(e => ({ label: e, value: e }))]
  })

  readonly departamentoOptions = computed(() => {
    const depts = [...new Set(this.mockData.map(c => c.departamento).filter(Boolean))] as string[]
    return [{ label: 'Todos os departamentos', value: '' }, ...depts.map(d => ({ label: d, value: d }))]
  })

  readonly situacaoOptions = [
    { label: 'Todos os estados', value: '' },
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Inativo', value: 'INATIVO' },
  ]

  readonly filteredData = computed(() => {
    const search = this.searchTerm().toLowerCase()
    const empresa = this.filterEmpresa()
    const dept = this.filterDepartamento()
    const sit = this.filterSituacao()

    return this.mockData.filter(c => {
      const matchSearch = !search || c.nome.toLowerCase().includes(search) || c.email?.toLowerCase().includes(search) || c.cargo.toLowerCase().includes(search)
      const matchEmpresa = !empresa || c.empresaNome === empresa
      const matchDept = !dept || c.departamento === dept
      const matchSit = !sit || c.situacao === sit
      return matchSearch && matchEmpresa && matchDept && matchSit
    })
  })

  getEmpresaInitials(nome?: string): string {
    if (!nome) return '?'
    return nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  }

  openEdit(contact?: IContact): void {
    this.selectedContact.set(contact ?? null)
    this.detailDrawerOpen.set(false)
    this.deactivateOpen.set(false)
    this.drawerOpen.set(true)
  }

  openDetail(contact: IContact): void {
    this.selectedContact.set(contact)
    this.detailDrawerOpen.set(true)
  }

  openDeactivate(contact: IContact): void {
    this.selectedContact.set(contact)
    this.detailDrawerOpen.set(false)
    this.deactivateOpen.set(true)
  }

  confirmDeactivate(): void {
    this.deactivateOpen.set(false)
    this.selectedContact.set(null)
  }
}
