import { Component, Input } from "@angular/core";

type IconSize = "sm" | "md" | "lg";
type IconColor = "brand" | "success" | "warning" | "error" | "gray";

const SIZE_CLASSES: Record<IconSize, string> = {
  sm: "h-10 w-10 rounded-[8px]",
  md: "h-12 w-12 rounded-[10px]",
  lg: "h-14 w-14 rounded-[10.5px]",
};

const COLOR_CLASSES: Record<IconColor, string> = {
  brand:   "bg-brand-50 text-brand-500 dark:bg-brand-500/10",
  success: "bg-success-50 text-success-500 dark:bg-success-500/10",
  warning: "bg-warning-50 text-warning-500 dark:bg-warning-500/10",
  error:   "bg-error-50 text-error-500 dark:bg-error-500/10",
  gray:    "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

@Component({
  selector: "app-card-icon",
  template: `
    <div [class]="'flex items-center justify-center ' + sizeClass + ' ' + colorClass">
      <ng-content />
    </div>
  `,
})
export class CardIconComponent {
  @Input() size: IconSize = "lg";
  @Input() color: IconColor = "brand";

  get sizeClass(): string { return SIZE_CLASSES[this.size]; }
  get colorClass(): string { return COLOR_CLASSES[this.color]; }
}
