import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  signal,
} from '@angular/core';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.component.html',
})
export class SelectComponent implements OnChanges {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Seleccionar';
  @Input() className = '';
  @Input() defaultValue = '';
  @Input() value = '';

  @Output() valueChange = new EventEmitter<string>();

  isOpen = signal(false);

  ngOnChanges(): void {
    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue;
    }
  }

  get selectedLabel(): string {
    return this.options.find((o) => o.value === this.value)?.label ?? '';
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  select(option: SelectOption): void {
    this.value = option.value;
    this.valueChange.emit(option.value);
    this.isOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isOpen.set(false);
  }
}
