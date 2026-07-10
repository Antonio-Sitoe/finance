import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CashFlowPeriodPreset } from "@/shared/interfaces/cash-flow.dto";
import { SolarDynamicIcon } from "@solar-icons/angular";

@Component({
  selector: "app-cash-flow-period-filter",
  templateUrl: "./cash-flow-period-filter.component.html",
  imports: [SolarDynamicIcon],
})
export class CashFlowPeriodFilterComponent {
  @Input() active: CashFlowPeriodPreset = "month";
  @Input() customDe = "";
  @Input() customAte = "";
  @Input() showCustom = false;
  @Output() presetChange = new EventEmitter<CashFlowPeriodPreset>();
  @Output() customDeChange = new EventEmitter<string>();
  @Output() customAteChange = new EventEmitter<string>();
  @Output() applyCustom = new EventEmitter<void>();

  readonly options: { key: CashFlowPeriodPreset; label: string }[] = [
    { key: "week", label: "Esta semana" },
    { key: "month", label: "Este mês" },
    { key: "quarter", label: "Este trimestre" },
    { key: "year", label: "Este ano" },
    { key: "custom", label: "Personalizado" },
  ];

  onSelect(key: CashFlowPeriodPreset) {
    this.presetChange.emit(key);
  }

  onCustomDeChange(event: Event) {
    this.customDeChange.emit((event.target as HTMLInputElement).value);
  }

  onCustomAteChange(event: Event) {
    this.customAteChange.emit((event.target as HTMLInputElement).value);
  }
}
