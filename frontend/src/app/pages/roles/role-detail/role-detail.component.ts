import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { switchMap } from 'rxjs'
import { PageHeaderComponent } from '@/shared/components/common/page-header/page-header.component'
import { CheckboxComponent } from '@/shared/components/ui/input/checkbox.component'
import { LabelComponent } from '@/shared/components/ui/label/label.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { RolesApiService } from '@/shared/services/roles/roles.api.service'
import { PermissaoGranted } from '@/shared/interfaces/roles.dto'

@Component({
  selector: 'app-role-detail',
  imports: [
    PageHeaderComponent,
    RouterModule,
    ReactiveFormsModule,
    CheckboxComponent,
    LabelComponent,
    InputFieldComponent,
  ],
  templateUrl: './role-detail.component.html',
})
export class RoleDetailComponent implements OnInit {
  private readonly api = inject(RolesApiService)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder)

  readonly loading = signal(true)
  readonly saving = signal(false)
  readonly error = signal<string | null>(null)
  readonly isNew = signal(false)
  readonly roleId = signal<number | null>(null)
  readonly sistema = signal(false)
  readonly modulos = signal<{ nome: string; items: PermissaoGranted[] }[]>([])
  readonly openModulos = signal<Set<string>>(new Set())

  readonly form = this.fb.nonNullable.group({
    codigo: ['', [Validators.required, Validators.maxLength(50)]],
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    descricao: [''],
  })

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id')
    if (!idParam || idParam === 'new') {
      this.isNew.set(true)
      this.loadNew()
      return
    }
    const id = Number(idParam)
    if (Number.isNaN(id)) {
      this.router.navigate(['/roles'])
      return
    }
    this.roleId.set(id)
    this.loadExisting(id)
  }

  private loadNew(): void {
    this.api.catalog().subscribe({
      next: (catalog) => {
        const mods = Object.entries(catalog.modulos).map(([nome, items]) => ({
          nome,
          items: items.map((p) => ({
            id: p.id,
            codigo: p.codigo,
            acao: p.acao,
            metodo: p.metodo,
            path: p.path,
            granted: false,
          })),
        }))
        this.modulos.set(mods)
        this.openModulos.set(new Set(mods.slice(0, 1).map((m) => m.nome)))
        this.loading.set(false)
      },
      error: () => {
        this.error.set('Não foi possível carregar o catálogo de permissões.')
        this.loading.set(false)
      },
    })
  }

  private loadExisting(id: number): void {
    this.api.getById(id).subscribe({
      next: (role) => {
        this.sistema.set(role.sistema)
        this.form.patchValue({
          codigo: role.codigo,
          nome: role.nome,
          descricao: role.descricao ?? '',
        })
        this.form.controls.codigo.disable()
        if (role.sistema) {
          this.form.disable()
        }
        const mods = Object.entries(role.matriz).map(([nome, items]) => ({
          nome,
          items: [...items],
        }))
        this.modulos.set(mods)
        this.openModulos.set(new Set(mods.slice(0, 1).map((m) => m.nome)))
        this.loading.set(false)
      },
      error: () => {
        this.error.set('Role não encontrada.')
        this.loading.set(false)
      },
    })
  }

  toggleModulo(nome: string): void {
    this.openModulos.update((set) => {
      const next = new Set(set)
      if (next.has(nome)) next.delete(nome)
      else next.add(nome)
      return next
    })
  }

  isOpen(nome: string): boolean {
    return this.openModulos().has(nome)
  }

  togglePermissao(moduloNome: string, permissaoId: number, granted: boolean): void {
    if (this.sistema()) return
    this.modulos.update((mods) =>
      mods.map((m) =>
        m.nome !== moduloNome
          ? m
          : {
              ...m,
              items: m.items.map((p) =>
                p.id === permissaoId ? { ...p, granted } : p,
              ),
            },
      ),
    )
  }

  selectAll(moduloNome: string, granted: boolean): void {
    if (this.sistema()) return
    this.modulos.update((mods) =>
      mods.map((m) =>
        m.nome !== moduloNome
          ? m
          : { ...m, items: m.items.map((p) => ({ ...p, granted })) },
      ),
    )
  }

  moduleAllSelected(moduloNome: string): boolean {
    const mod = this.modulos().find((m) => m.nome === moduloNome)
    return !!mod && mod.items.length > 0 && mod.items.every((p) => p.granted)
  }

  grantedCount(moduloNome: string): number {
    const mod = this.modulos().find((m) => m.nome === moduloNome)
    return mod ? mod.items.filter((p) => p.granted).length : 0
  }

  selectedIds(): number[] {
    return this.modulos()
      .flatMap((m) => m.items)
      .filter((p) => p.granted)
      .map((p) => p.id)
  }

  save(): void {
    if (this.sistema()) return
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const { codigo, nome, descricao } = this.form.getRawValue()
    const permissaoIds = this.selectedIds()
    this.saving.set(true)
    this.error.set(null)

    const update$ = (id: number) =>
      this.api.update(id, {
        nome,
        descricao: descricao || null,
        permissaoIds,
      })

    const req$ = this.isNew()
      ? this.api
          .create({
            codigo: codigo.trim().toUpperCase(),
            nome,
            descricao: descricao || null,
          })
          .pipe(switchMap((created) => update$(created.id)))
      : update$(this.roleId()!)

    req$.subscribe({
      next: () => {
        this.saving.set(false)
        this.router.navigate(['/roles'])
      },
      error: (err) => {
        this.saving.set(false)
        this.error.set(err?.error?.message ?? 'Erro ao guardar role.')
      },
    })
  }

  cancel(): void {
    this.router.navigate(['/roles'])
  }
}
