import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { CostumerContactsTableComponent } from '@/shared/components/costumers/costumer-contacts-table/costumer-contacts-table.component'
import { CostumerContactsFacadeService } from '@/shared/services/contactos/costumer-contacts.facade.service'
import { SolarDynamicIcon, AltArrowLeftBold, BuildingsBold } from '@solar-icons/angular'

@Component({
  selector: 'app-costumer-contacts',
  imports: [
    RouterModule,
    BadgeComponent,
    CostumerContactsTableComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './costumer-contacts.component.html',
  providers: [CostumerContactsFacadeService],
})
export class CostumerContactsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  readonly facade = inject(CostumerContactsFacadeService)

  readonly AltArrowLeftBold = AltArrowLeftBold
  readonly BuildingsBold = BuildingsBold

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id) this.facade.load(id)
  }

  goBack(): void {
    this.router.navigate(['/costumers'])
  }
}
