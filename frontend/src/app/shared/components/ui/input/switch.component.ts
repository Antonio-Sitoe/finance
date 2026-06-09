import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  template: `
   <label
      class="flex cursor-pointer select-none items-center gap-3 text-sm font-medium"
      [ngClass]="disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-400'"
      (click)="handleToggle()"
    >
      <div class="relative">
        <div
          class="block transition duration-150 ease-linear h-6 w-11 rounded-full"
          [ngClass]="
            (disabled
              ? 'bg-gray-100 pointer-events-none dark:bg-gray-800'
              : switchColors.background)
          "
        ></div>
        <div
          class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform"
          [ngClass]="switchColors.knob"
        ></div>
      </div>
      {{ label }}
    </label>
  `
})
export class SwitchComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() label!: string;
  @Input() defaultChecked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() color: 'blue' | 'gray' = 'blue';

  @Output() valueChange = new EventEmitter<boolean>();

  isChecked: boolean = false;

  private _onChange: (value: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  ngOnInit() {
    this.isChecked = this.defaultChecked;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultChecked'] && !changes['defaultChecked'].firstChange) {
      this.isChecked = this.defaultChecked;
    }
  }

  writeValue(value: boolean): void {
    this.isChecked = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleToggle() {
    if (this.disabled) return;
    this.isChecked = !this.isChecked;
    this.valueChange.emit(this.isChecked);
    this._onChange(this.isChecked);
    this._onTouched();
  }

  get switchColors() {
    if (this.color === 'blue') {
      return {
        background: this.isChecked
          ? 'bg-brand-500'
          : 'bg-gray-200 dark:bg-white/10',
        knob: this.isChecked
          ? 'translate-x-full bg-white'
          : 'translate-x-0 bg-white',
      };
    } else {
      return {
        background: this.isChecked
          ? 'bg-gray-800 dark:bg-white/10'
          : 'bg-gray-200 dark:bg-white/10',
        knob: this.isChecked
          ? 'translate-x-full bg-white'
          : 'translate-x-0 bg-white',
      };
    }
  }
}
