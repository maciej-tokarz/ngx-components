import {
  ChangeDetectorRef,
  EventEmitter,
  ElementRef,
  Component,
  ViewChild,
  Output,
  Input,
} from '@angular/core';

import { ISettings } from '../../interfaces';
import { InputType } from '../../types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css'],
})
export class DayComponent {
  private _keyCounter = 0;

  @Input() settings: ISettings;
  @Input() value: string;
  @Input() showBackground = false;
  @Input() type: InputType;
  @Output() valueChange = new EventEmitter<string>();
  @Output() focusOnYear = new EventEmitter<void>();
  @Output() focusOnMonth = new EventEmitter<void>();
  @ViewChild('input') input: ElementRef;

  constructor(private _cd: ChangeDetectorRef) {}

  focused(): void {
    this._keyCounter = 0;
    this.type === 'date'
      ? this.input.nativeElement.parentElement.parentElement.parentElement.classList.add(
          'outlined'
        )
      : this.input.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add(
          'outlined'
        );
  }

  blured(): void {
    if (Number(this.value) > 31) {
      this.value = '31';
      this._emitValueChange();
    }

    this.type === 'date'
      ? this.input.nativeElement.parentElement.parentElement.parentElement.classList.remove(
          'outlined'
        )
      : this.input.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.remove(
          'outlined'
        );
  }

  focus(): void {
    this.input.nativeElement.focus();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
      return;
    }

    const value = Number(
      this.value !== this.settings.placeholder.day ? this.value : 1
    );

    if (!isNaN(Number(event.key))) {
      this._setValue(event.key);
    }

    if (event.key === 'ArrowUp') {
      this.value === this.settings.placeholder.day || value >= 31
        ? (this.value = '01')
        : (this.value = String(value + 1).pad());
      this._emitValueChange();
    }

    if (event.key === 'ArrowDown') {
      value === 1
        ? (this.value = '31')
        : (this.value = String(value - 1).pad());
      this._emitValueChange();
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      this._keyCounter = 0;
      this.value = this.settings.placeholder.day;
      this._emitValueChange();
    }

    if (event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  private _setValue(key: string): void {
    if (this._keyCounter === 2) {
      this._keyCounter = 0;
    }

    const firstChar =
      this.value !== this.settings.placeholder.day && this.value.length === 2
        ? this.value.substring(2, 1)
        : '0';

    this.value = `${firstChar}${key}`;
    this._emitValueChange();

    if (this._keyCounter === 1) {
      const yearOrder = this.settings?.partOrder.indexOf('y');
      const monthOrder = this.settings?.partOrder.indexOf('m');
      const dayOrder = this.settings?.partOrder.indexOf('d');

      if (dayOrder === 0 && yearOrder === 2) {
        this.focusOnYear.emit();
      }

      if (dayOrder === 0 && monthOrder === 2) {
        this.focusOnMonth.emit();
      }

      if (dayOrder === 2 && yearOrder === 4) {
        this.focusOnYear.emit();
      }

      if (dayOrder === 2 && monthOrder === 4) {
        this.focusOnMonth.emit();
      }
    }

    this._keyCounter += 1;
  }

  private _emitValueChange(): void {
    this.valueChange.emit(this.value);
    this._cd.detectChanges();
  }
}
