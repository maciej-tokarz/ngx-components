import {
  ChangeDetectorRef,
  EventEmitter,
  ElementRef,
  Component,
  ViewChild,
  Output,
  Input,
} from '@angular/core';

import { InputType, TimeType } from '../../types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css'],
})
export class TimeComponent {
  @Input() value: TimeType;
  @Input() type: InputType;
  @Output() valueChange = new EventEmitter<TimeType>();
  @ViewChild('input') private _input: ElementRef;

  constructor(private _cd: ChangeDetectorRef) {}

  focused(): void {
    this.type === 'time'
      ? this._input.nativeElement.parentElement.parentElement.classList.add(
          'outlined'
        )
      : this._input.nativeElement.parentElement.parentElement.parentElement.parentElement.classList.add(
          'outlined'
        );
  }

  blured(): void {
    this.type === 'time'
      ? this._input.nativeElement.parentElement.parentElement.classList.remove(
          'outlined'
        )
      : this._input.nativeElement.parentElement.parentElement.parentElement.parentElement.classList.remove(
          'outlined'
        );
  }

  focus(): void {
    this._input.nativeElement.focus();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'a' || event.key === 'A') {
      this.value = 'AM';
      this._emitValueChange();
    }

    if (event.key === 'p' || event.key === 'P') {
      this.value = 'PM';
      this._emitValueChange();
    }

    if (event.key === 'ArrowUp') {
      this.value = this.value === 'AM' ? 'PM' : 'AM';
      this._emitValueChange();
    }

    if (event.key === 'ArrowDown') {
      this.value = this.value === 'PM' ? 'AM' : 'PM';
      this._emitValueChange();
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      this.value = '--';
      this._emitValueChange();
    }

    if (event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  private _emitValueChange(): void {
    this.valueChange.emit(this.value);
    this._cd.detectChanges();
  }
}
