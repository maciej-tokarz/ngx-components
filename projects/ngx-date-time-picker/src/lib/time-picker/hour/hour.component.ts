import {
  ChangeDetectorRef,
  EventEmitter,
  ElementRef,
  Component,
  ViewChild,
  Output,
  Input,
} from '@angular/core';

import { ClockType, InputType } from '../../types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hour',
  templateUrl: './hour.component.html',
  styleUrls: ['./hour.component.css'],
})
export class HourComponent {
  private _keyCounter = 0;

  @Input() clockType: ClockType;
  @Input() value = '--';
  @Input() showBackground = false;
  @Input() type: InputType;
  @Output() valueChange = new EventEmitter<string>();
  @Output() focusOnMinute = new EventEmitter<void>();
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
    if (this.clockType === 12) {
      if (this.value === '00' || Number(this.value) > 19) {
        this.value = '12';
        this._emitValueChange();
      }

      if (Number(this.value) >= 13 && Number(this.value) <= 19) {
        this.value = String(Number(this.value) - 12).pad();
        this._emitValueChange();
      }
    }

    if (this.clockType === 24 && Number(this.value) > 23) {
      this.value = String(23).pad();
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
      if (this.value === '--') {
        this.clockType === 12 ? (this.value = '01') : (this.value = '00');
        this._emitValueChange();
        return;
      }

      if (this.clockType === 12 && value === 12) {
        this.value = '01';
        this._emitValueChange();
        return;
      }

      if (this.clockType === 24 && value === 23) {
        this.value = '00';
        this._emitValueChange();
        return;
      }

      this.value = String(value + 1).pad();
      this._emitValueChange();
    }

    if (event.key === 'ArrowDown') {
      if (this.value === '--') {
        this.clockType === 12 ? (this.value = '12') : (this.value = '23');
        this._emitValueChange();
        return;
      }

      if (this.clockType === 12 && value === 1) {
        this.value = '12';
        this._emitValueChange();
        return;
      }

      if (this.clockType === 24 && value === 0) {
        this.value = '23';
        this._emitValueChange();
        return;
      }

      this.value = String(value - 1).pad();
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

    if (
      this._keyCounter === 0 &&
      Number(key) > (this.clockType === 12 ? 1 : 2)
    ) {
      this.value = `0${key}`;
      this._emitValueChange();
      this.focusOnMinute.emit();
      return;
    }

    this.value = `${firstChar}${key}`;
    this._emitValueChange();
    this._checkNumCounter();
  }

  private _checkNumCounter(): void {
    if (this._keyCounter === 1) {
      this.focusOnMinute.emit();
    }

    this._keyCounter += 1;
  }

  private _emitValueChange(): void {
    if (
      this.clockType === 12 &&
      (this.value === '00' || Number(this.value) > 12)
    ) {
      return;
    }

    if (this.clockType === 24 && Number(this.value) > 23) {
      return;
    }

    this.valueChange.emit(this.value);
    this._cd.detectChanges();
  }
}
