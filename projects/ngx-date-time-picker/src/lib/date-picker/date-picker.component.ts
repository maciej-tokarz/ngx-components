import {
  ChangeDetectorRef,
  AfterViewInit,
  EventEmitter,
  ElementRef,
  Component,
  ViewChild,
  OnDestroy,
  Output,
  Input,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { MonthComponent } from './month/month.component';
import { YearComponent } from './year/year.component';
import { DayComponent } from './day/day.component';
import { ISettings } from '../interfaces';
import { InputType } from '../types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements AfterViewInit, OnDestroy {
  private _subscription = new Subscription();
  private _year: string;
  private _month: string;
  private _day: string;
  private _settings: ISettings;
  private _lastEmmited: string;

  showPanel = false;

  set year(value: string) {
    this._year = value;
    this._emitValue();
  }
  get year() {
    return this._year;
  }

  set month(value: string) {
    this._month = value;
    this._emitValue();
  }
  get month() {
    return this._month;
  }

  set day(value: string) {
    this._day = value;
    this._emitValue();
  }
  get day() {
    return this._day;
  }

  @Input()
  set value(value: string) {
    if (value) {
      this.year = value.substring(0, 4);
      this.month = value.substring(5, 7);
      this.day = value.substring(8, 10);
    } else {
      this.year = this.settings.placeholder.year;
      this.month = this.settings.placeholder.month;
      this.day = this.settings.placeholder.day;
    }
    this._emitValue();
  }
  get value() {
    return `${this.year}-${this.month}-${this.day}`;
  }

  @Input() set settings(value: ISettings) {
    if (value) {
      this._settings = value;
      this.year = value.placeholder.year;
      this.month = value.placeholder.month;
      this.day = value.placeholder.day;
    }
  }
  get settings() {
    return this._settings;
  }

  @Input() type: InputType;
  @Input() dateTimePanelShowed: boolean;
  @Output() valueChange = new EventEmitter<string>();
  @ViewChild(YearComponent) private _yearInput: YearComponent;
  @ViewChild(MonthComponent) private _monthInput: MonthComponent;
  @ViewChild(DayComponent) private _dayInput: DayComponent;
  @ViewChild('dateContainer') private _dateContainer: ElementRef;

  constructor(public cd: ChangeDetectorRef, private _element: ElementRef) {}

  ngAfterViewInit(): void {
    this._subscription.add(
      this._yearInput.focusOnMonth.subscribe(() => this._monthInput.focus())
    );

    this._subscription.add(
      this._yearInput.focusOnDay.subscribe(() => this._dayInput.focus())
    );

    this._subscription.add(
      this._monthInput.focusOnYear.subscribe(() => this._yearInput.focus())
    );

    this._subscription.add(
      this._monthInput.focusOnDay.subscribe(() => this._dayInput.focus())
    );

    this._subscription.add(
      this._dayInput.focusOnYear.subscribe(() => this._yearInput.focus())
    );

    this._subscription.add(
      this._dayInput.focusOnMonth.subscribe(() => this._monthInput.focus())
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  hidePanel(): void {
    this.setFocus();
    this.showPanel = false;
    this.cd.detectChanges();
  }

  setFocus(): void {
    const dateContainer = this._dateContainer.nativeElement;
    const firstElement = dateContainer.children[0].children[0].children[0];
    firstElement.focus();
  }

  yearOnKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      const yearOrder = this.settings?.partOrder.indexOf('y');
      const monthOrder = this.settings?.partOrder.indexOf('m');
      const dayOrder = this.settings?.partOrder.indexOf('d');

      if (yearOrder === 4 && monthOrder === 2) {
        this._monthInput.focus();
      }

      if (yearOrder === 4 && dayOrder === 2) {
        this._dayInput.focus();
      }
    }

    if (event.key === 'ArrowRight') {
      const yearOrder = this.settings?.partOrder.indexOf('y');
      const monthOrder = this.settings?.partOrder.indexOf('m');
      const dayOrder = this.settings?.partOrder.indexOf('d');

      if (yearOrder === 0 && monthOrder === 2) {
        this._monthInput.focus();
      }

      if (yearOrder === 0 && dayOrder === 2) {
        this._dayInput.focus();
      }

      if (this.type === 'date-time') {
        if (yearOrder === 4) {
          this._element.nativeElement.parentNode.children[1].children[0].children[0].children[0].focus();
        }
      }
    }
  }

  monthOnKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      const yearOrder = this.settings?.partOrder.indexOf('y');
      const monthOrder = this.settings?.partOrder.indexOf('m');
      const dayOrder = this.settings?.partOrder.indexOf('d');

      if (monthOrder === 2 && yearOrder === 0) {
        this._yearInput.focus();
      }

      if (monthOrder === 2 && dayOrder === 0) {
        this._dayInput.focus();
      }

      if (monthOrder === 4 && dayOrder === 2) {
        this._dayInput.focus();
      }
    }

    if (event.key === 'ArrowRight') {
      const yearOrder = this.settings?.partOrder.indexOf('y');
      const monthOrder = this.settings?.partOrder.indexOf('m');
      const dayOrder = this.settings?.partOrder.indexOf('d');

      if (monthOrder === 0 && dayOrder === 2) {
        this._dayInput.focus();
      }

      if (monthOrder === 2 && yearOrder === 4) {
        this._yearInput.focus();
      }

      if (monthOrder === 2 && dayOrder === 4) {
        this._dayInput.focus();
      }

      if (this.type === 'date-time') {
        if (monthOrder === 4) {
          this._element.nativeElement.parentNode.children[1].children[0].children[0].children[0].focus();
        }
      }
    }
  }

  dayOnKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      const yearOrder = this.settings?.partOrder.indexOf('y');
      const monthOrder = this.settings?.partOrder.indexOf('m');
      const dayOrder = this.settings?.partOrder.indexOf('d');

      if (dayOrder === 2 && monthOrder === 0) {
        this._monthInput.focus();
      }

      if (dayOrder === 2 && yearOrder === 0) {
        this._yearInput.focus();
      }

      if (dayOrder === 4 && monthOrder === 2) {
        this._monthInput.focus();
      }
    }

    if (event.key === 'ArrowRight') {
      const yearOrder = this.settings?.partOrder.indexOf('y');
      const monthOrder = this.settings?.partOrder.indexOf('m');
      const dayOrder = this.settings?.partOrder.indexOf('d');

      if (dayOrder === 0 && monthOrder === 2) {
        this._monthInput.focus();
      }

      if (dayOrder === 2 && monthOrder === 4) {
        this._monthInput.focus();
      }

      if (dayOrder === 2 && yearOrder === 4) {
        this._yearInput.focus();
      }

      if (this.type === 'date-time') {
        if (dayOrder === 4) {
          this._element.nativeElement.parentNode.children[1].children[0].children[0].children[0].focus();
        }
      }
    }
  }

  isClear(): boolean {
    return (
      this.year === this.settings.placeholder.year ||
      this.month === this.settings.placeholder.month ||
      this.day === this.settings.placeholder.day
    );
  }

  private _emitValue(): void {
    if (Number(this.year) < 1000) {
      this.year = '1000';
    }

    const date = new Date(
      Number(this.year),
      Number(this.month) - 1,
      Number(this.day)
    );

    const isValid =
      Number(this.year) === date.getFullYear() &&
      Number(this.month) - 1 === date.getMonth() &&
      Number(this.day) === date.getDate();

    if (!isValid && !this.isClear()) {
      return;
    }

    if (this._lastEmmited === this.value) {
      return;
    }

    this.valueChange.emit(this.value);
    this._lastEmmited = this.value;
  }
}
