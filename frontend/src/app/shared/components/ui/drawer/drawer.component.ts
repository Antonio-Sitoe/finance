import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-drawer',
  imports: [],
  templateUrl: './drawer.component.html',
})
export class DrawerComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showFooter = false;
  @Output() openChange = new EventEmitter<boolean>();

  ngOnChanges(): void {
    document.body.style.overflow = this.open ? 'hidden' : '';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) this.close();
  }

  close(): void {
    this.openChange.emit(false);
  }
}
