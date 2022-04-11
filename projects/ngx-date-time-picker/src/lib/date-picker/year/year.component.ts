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
  selector: 'year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.css'],
})
export class YearComponent {
  private _keyCounter = 0;

  @Input() settings: ISettings;
  @Input() value: string;
  @Input() showBackground = false;
  @Input() type: InputType;
  @Output() valueChange = new EventEmitter<string>();
  @Output() focusOnMonth = new EventEmitter<void>();
  @Output() focusOnDay = new EventEmitter<void>();
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
    if (Number(this.value) < 1000) {
      this.value = '1000';
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

    const value = String(
      this.value !== this.settings.placeholder.year
        ? this.value
        : new Date().getFullYear()
    );

    if (!isNaN(Number(event.key))) {
      this._setValue(event.key);
    }

    if (event.key === 'ArrowUp') {
      if (Number(this.value) >= 9999) {
        this.value = '9998';
      }

      if (Number(this.value) < 1000) {
        this.value = '999';
      }

      this.value =
        this.value === this.settings.placeholder.year
          ? value
          : (this.value = String(Number(this.value) + 1));

      this._emitValueChange();
    }

    if (event.key === 'ArrowDown') {
      if (Number(this.value) <= 1000) {
        this.value = '1001';
      }

      this.value =
        this.value === this.settings.placeholder.year
          ? value
          : (this.value = String(Number(this.value) - 1));

      this._emitValueChange();
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      this._keyCounter = 0;
      this.value = this.settings.placeholder.year;
      this._emitValueChange();
    }

    if (event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  private _setValue(key: string): void {
    let front = this.value.substring(1, 4);

    if (this._keyCounter === 4) {
      this._keyCounter = 0;
    }

    if (
      this._keyCounter === 0 &&
      this.value === this.settings.placeholder.year
    ) {
      front = '000';
    }

    this.value = `${front}${key}`;
    this._emitValueChange();

    if (this._keyCounter === 3) {
      const yearOrder = this.settings?.partOrder.indexOf('y');
      const monthOrder = this.settings?.partOrder.indexOf('m');
      const dayOrder = this.settings?.partOrder.indexOf('d');

      if (yearOrder === 0 && monthOrder === 2) {
        this.focusOnMonth.emit();
      }

      if (yearOrder === 0 && dayOrder === 2) {
        this.focusOnDay.emit();
      }
    }

    this._keyCounter += 1;
  }

  private _emitValueChange(): void {
    this.valueChange.emit(this.value);
    this._cd.detectChanges();
  }
}
