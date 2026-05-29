
import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { LineChartOneComponent } from '../../../shared/components/charts/line/line-chart-one/line-chart-one.component';


@Component({
  selector: 'app-line-chart',
  imports: [
    PageHeaderComponent,
    ComponentCardComponent,
    LineChartOneComponent
],
  templateUrl: './line-chart.component.html',
  styles: ``
})
export class LineChartComponent {

}
