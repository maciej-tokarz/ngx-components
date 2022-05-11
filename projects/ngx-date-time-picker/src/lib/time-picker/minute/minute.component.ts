import {
  ChangeDetectorRef,
  EventEmitter,
  ElementRef,
  Component,
  ViewChild,
  Output,
  Input,
} from '@angular/core';

import { InputType } from '../../types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'minute',
  templateUrl: './minute.component.html',
  styleUrls: ['./minute.component.css'],
})
export class MinuteComponent {
  private _keyCounter = 0;

  @Input() value = '--';
  @Input() seconds: boolean;
  @Input() type: InputType;
  @Output() valueChange = new EventEmitter<string>();
  @Output() focusOnSecond = new EventEmitter<void>();
  @Output() focusOnTime = new EventEmitter<void>();
  @ViewChild('input') private _input: ElementRef;

  constructor(private _cd: ChangeDetectorRef) {}

  focused(): void {
    this._keyCounter = 0;

    this.type === 'time'
      ? this._input.nativeElement.parentElement.parentElement.classList.add(
          'outlined'
        )
      : this._input.nativeElement.parentElement.parentElement.parentElement.parentElement.classList.add(
          'outlined'
        );
  }

  blured(): void {
    if (Number(this.value) > 59) {
      this.value = '59';
      this._emitValueChange();
    }

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
    if (event.key === ' ') {
      event.preventDefault();
      return;
    }

    const value = Number(this.value !== '--' ? this.value : 0);

    if (!isNaN(Number(event.key))) {
      this._setValue(event.key);
    }

    if (event.key === 'ArrowUp') {
      this.value === '--' || value >= 59
        ? (this.value = '00')
        : (this.value = String(value + 1).pad());
      this._emitValueChange();
    }

    if (event.key === 'ArrowDown') {
      value === 0
        ? (this.value = '59')
        : (this.value = String(value - 1).pad());
      this._emitValueChange();
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      this._keyCounter = 0;
      this.value = '--';
      this._emitValueChange();
    }

    if (event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  private _setValue(key: string): void {
    const firstChar =
      this.value !== '--' && this.value.length === 2
        ? this.value.substring(2, 1)
        : '0';

    this.value = `${firstChar}${key}`;
    this._emitValueChange();

    if (this._keyCounter === 1) {
      this.seconds ? this.focusOnSecond.emit() : this.focusOnTime.emit();
    }

    this._keyCounter += 1;
  }

  private _emitValueChange(): void {
    if (Number(this.value) > 59) {
      return;
    }

    this.valueChange.emit(this.value);
    this._cd.detectChanges();
  }
}
