import { Component, computed, inject, signal } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { ICliente, IContactoCliente } from '@/shared/interfaces/costumers.dto'
import { DataTableComponent, ColumnDef } from '@/shared/components/ui/datatable/datatable'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { AvatarTextComponent } from '@/shared/components/ui/avatar/avatar-text.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SelectComponent } from '@/shared/components/ui/select/select.component'
import {
  SolarDynamicIcon,
  AltArrowLeftBold,
  BuildingsBold,
  UserPlusBold,
  MagnifierBold,
  FilterBold,
  LetterBold,
  MenuDotsBold,
  UsersGroupRoundedBold,
} from '@solar-icons/angular'

const MOCK_CLIENTES: ICliente[] = [
  {
    id: 1,
    nomeEmpresarial: 'Global Trade Solutions S.A.',
    email: 'contacto@globaltrade.pt',
    telefone: '+351 210 998 776',
    endereco: 'Avenida da Liberdade, 110',
    numero: '110',
    complemento: '4º Piso, Ala Norte',
    cidade: 'Lisboa',
    distrito: 'Lisboa',
    situacao: 'ATIVO',
    createdAt: '2024-03-15T10:00:00Z',
    contactos: [
      { id: 1, nome: 'Ana Martins', cargo: 'Diretora Financeira - CFO', departamento: 'Financeiro', telefone: '+351 912 345 678', email: 'ana.martins@globaltrade.pt', situacao: 'ATIVO', ultimaAtividade: 'Hoje, 10:45' },
      { id: 2, nome: 'Ricardo Costa', cargo: 'Gestor de Compras', departamento: 'Compras', telefone: '+351 934 567 890', email: 'ricardo.costa@globaltrade.pt', situacao: 'ATIVO', ultimaAtividade: 'Ontem, 14:20' },
      { id: 3, nome: 'Sandra Teixeira', cargo: 'Assistente Administrativa', departamento: 'Administrativo', telefone: '+351 961 122 334', email: 'sandra.t@globaltrade.pt', situacao: 'INATIVO', ultimaAtividade: '3 dias atrás' },
    ],
  },
  {
    id: 2,
    nomeEmpresarial: 'TechVision Lda.',
    email: 'geral@techvision.ao',
    telefone: '+244 923 456 789',
    cidade: 'Luanda',
    classificacaoRisco: 3,
    classificacao: 'Normal',
    situacao: 'ATIVO',
    createdAt: '2024-05-20T08:30:00Z',
    contactos: [
      { id: 4, nome: 'Pedro Alves', cargo: 'Diretor Geral', departamento: 'Direção', telefone: '+244 923 456 789', email: 'pedro.alves@techvision.ao', situacao: 'ATIVO', ultimaAtividade: 'Hoje, 09:00' },
    ],
  },
  {
    id: 3,
    nomeEmpresarial: 'Construtora Norte S.A.',
    email: 'info@construtora-norte.pt',
    telefone: '+351 253 112 233',
    cidade: 'Braga',
    situacao: 'INATIVO',
    createdAt: '2023-11-08T14:00:00Z',
    contactos: [],
  },
]

@Component({
  selector: 'app-costumer-contacts',
  imports: [
    RouterModule,
    DataTableComponent,
    BadgeComponent,
    AvatarTextComponent,
    InputFieldComponent,
    SelectComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './costumer-contacts.component.html',
})
export class CostumerContactsComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)

  readonly AltArrowLeftBold = AltArrowLeftBold
  readonly BuildingsBold = BuildingsBold
  readonly UserPlusBold = UserPlusBold
  readonly MagnifierBold = MagnifierBold
  readonly FilterBold = FilterBold
  readonly LetterBold = LetterBold
  readonly MenuDotsBold = MenuDotsBold
  readonly UsersGroupRoundedBold = UsersGroupRoundedBold

  readonly searchTerm = signal('')
  readonly filterDepartamento = signal('')
  readonly filterSituacao = signal('')

  readonly cliente = computed<ICliente | null>(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    return MOCK_CLIENTES.find(c => c.id === id) ?? null
  })

  readonly contactosFiltrados = computed<IContactoCliente[]>(() => {
    const contactos = this.cliente()?.contactos ?? []
    const search = this.searchTerm().toLowerCase()
    const dept = this.filterDepartamento()
    const sit = this.filterSituacao()

    return contactos.filter(c => {
      const matchSearch = !search || c.nome.toLowerCase().includes(search) || c.email?.toLowerCase().includes(search) || c.cargo.toLowerCase().includes(search)
      const matchDept = !dept || c.departamento === dept
      const matchSit = !sit || c.situacao === sit
      return matchSearch && matchDept && matchSit
    })
  })

  readonly departamentos = computed<string[]>(() => {
    const depts = this.cliente()?.contactos?.map(c => c.departamento).filter(Boolean) as string[]
    return [...new Set(depts)]
  })

  readonly departamentoOptions = computed(() => [
    { label: 'Todos os departamentos', value: '' },
    ...this.departamentos().map(d => ({ label: d, value: d })),
  ])

  readonly situacaoOptions = [
    { label: 'Todos os estados', value: '' },
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Inativo', value: 'INATIVO' },
  ]

  columns: ColumnDef[] = [
    { id: 'contacto', label: 'Nome / Cargo' },
    { id: 'departamento', label: 'Departamento' },
    { id: 'telefone', label: 'Telefone' },
    { id: 'ultimaAtividade', label: 'Última Atividade' },
    { id: 'situacao', label: 'Estado', align: 'center' },
    { id: 'acoes', label: '', align: 'right' },
  ]

  goBack(): void {
    this.router.navigate(['/costumers'])
  }

  getInitials(nome: string): string {
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  }
}
