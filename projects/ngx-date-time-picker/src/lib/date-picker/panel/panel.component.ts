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

import { ISettings, IYearMonth } from '../../interfaces';
import { InputType } from '../../types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'date-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class DatePanelComponent implements AfterViewInit, OnDestroy {
  private _setted = false;
  private _initValue: string;
  private _initYear: number;
  private _initMonth: number;
  private _initMonthName: string;
  private _initDay: number;

  showMonths = false;
  selectedYear: number;
  selectedMonth: number;
  selectedMonthName: string;
  selectedDay: number;
  days: number[];
  dayOvered: number = -1;
  documentMouseDown = this._documentMouseDown.bind(this);
  documentKeyDown = this._documentKeyDown.bind(this);

  @Input() set show(value: string) {
    if (value && !this._setted) {
      const currentDay =
        value.includes(this.settings.placeholder.year) ||
        value.includes(this.settings.placeholder.month) ||
        value.includes(this.settings.placeholder.day)
          ? new Date()
          : new Date(value);
      currentDay.setHours(0, 0, 0, 0);

      this._initValue = value;
      this._setCalendar(currentDay);
      this._setted = true;
    }
  }

  @Input() settings: ISettings;
  @Input() type: InputType;
  @Input() dateTimePanelShowed: boolean;
  @Output() hidePanel = new EventEmitter<void>();
  @Output() dateChange = new EventEmitter<string>();
  @Output() dateTimeClear = new EventEmitter<void>();
  @ViewChild('panel') private _panel: ElementRef;

  constructor(public cd: ChangeDetectorRef) {
    document.addEventListener('keydown', this.documentKeyDown);
  }

  ngAfterViewInit(): void {
    if (this.type === 'date') {
      document.addEventListener('mousedown', this.documentMouseDown);
      this._setPanelPosition();
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.documentKeyDown);

    if (this.type === 'date') {
      document.removeEventListener('mousedown', this.documentMouseDown);
    }
  }

  nextMonth(up: boolean = true): void {
    let newDate = new Date(this.selectedDay);
    const beforeDay = newDate.getDate();
    newDate.setMonth(up ? newDate.getMonth() + 1 : newDate.getMonth() - 1);
    const afterDay = newDate.getDate();

    if (beforeDay !== afterDay) {
      newDate = new Date(this.selectedDay);
      up
        ? newDate.setMonth(newDate.getMonth() + 2, 0)
        : newDate.setMonth(newDate.getMonth(), 0);
    }

    this._setCalendar(newDate);
    this._emitChanges(newDate.getTime());
  }

  selectDay(day: number): void {
    this.selectedDay = day;
    this.cd.detectChanges();
    this._emitChanges(day);

    if (this.type === 'date') {
      this.hidePanel.emit();
    }
  }

  clear(): void {
    if (this.type === 'date-time') {
      this.dateTimeClear.emit();
      return;
    }

    this._emitChanges(null);
    this.hidePanel.emit();
  }

  today(): void {
    const currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);
    this._setCalendar(currentDay);
    this.selectDay(currentDay.getTime());
  }

  isOutsideDay(day: number): boolean {
    const currentDay = new Date(day);
    return currentDay.getMonth() !== this.selectedMonth;
  }

  setMonthsResult(result: IYearMonth): void {
    const currentDay = new Date(this.selectedDay).getDate();
    let newDate = new Date(result.year, result.month + 1, 0, 0, 0, 0, 0);

    if (currentDay <= newDate.getDate()) {
      newDate.setDate(new Date(this.selectedDay).getDate());
    }

    this.showMonths = false;
    this._setCalendar(newDate);
    this._emitChanges(newDate.getTime());
  }

  restoreInitValue(): void {
    this.selectedYear = this._initYear;
    this.selectedMonth = this._initMonth;
    this.selectedMonthName = this._initMonthName;
    this.selectedDay = this._initDay;
    this._setDays();
    this.dateChange.emit(this._initValue);
  }

  private _getDateString(day: number): string {
    const currentDay = new Date(day);
    return `${currentDay.getFullYear()}-${String(
      currentDay.getMonth() + 1
    ).pad()}-${String(currentDay.getDate()).pad()}`;
  }

  private _emitChanges(day: number): void {
    day
      ? this.dateChange.emit(this._getDateString(day))
      : this.dateChange.emit(null);
  }

  private _setCalendar(currentDay: Date): void {
    this.selectedDay = currentDay.getTime();
    this.selectedMonth = currentDay.getMonth();
    this.selectedMonthName =
      this.settings.translations.monthsLong[this.selectedMonth];
    this.selectedYear = currentDay.getFullYear();

    this._setInitValues();
    this._setDays();
    this.cd.detectChanges();
  }

  private _setInitValues(): void {
    if (this._setted) {
      return;
    }

    this._initYear = this.selectedYear;
    this._initMonth = this.selectedMonth;
    this._initMonthName = this.selectedMonthName;
    this._initDay = this.selectedDay;
  }

  private _setDays(): void {
    let fromDate = new Date(this.selectedYear, this.selectedMonth);
    this._setFromDate(fromDate);
    const toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + 41);
    this.days = this._getDays(fromDate, toDate);
  }

  private _setFromDate(fromDate: Date): void {
    fromDate.setDate(
      fromDate.getDate() -
        (this.settings.firstWeekDay !== 6
          ? fromDate.getDay() > 0
            ? fromDate.getDay() - this.settings.firstWeekDay
            : this.settings.firstWeekDay !== 1
            ? fromDate.getDay()
            : fromDate.getDay() + 6
          : fromDate.getDay() !== 6
          ? fromDate.getDay() + 1
          : fromDate.getDay() - 6)
    );
  }

  private _getDays(fromDate: Date, toDate: Date): number[] {
    const days = [];

    while (fromDate <= toDate) {
      const date = new Date(fromDate);
      date.setHours(0, 0, 0, 0);
      days.push(date.getTime());
      fromDate.setDate(date.getDate() + 1);
    }

    return days;
  }

  private _documentMouseDown(event: MouseEvent): void {
    if (this._panel && !this._panel.nativeElement.contains(event.target)) {
      this.hidePanel.emit();
    }
  }

  private _documentKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.selectDay(this.selectedDay);
    }

    if (event.key === 'Escape') {
      if (this.type === 'date') {
        this.selectedYear !== this._initYear ||
        this.selectedMonth !== this._initMonth
          ? this.restoreInitValue()
          : this.hidePanel.emit();
      }
    }

    if (event.key === 'PageUp') {
      this.nextMonth(false);
    }

    if (event.key === 'PageDown') {
      this.nextMonth(true);
    }
  }

  private _setPanelPosition(): void {
    const rect: DOMRect = this._panel.nativeElement.getBoundingClientRect();
    const bootomPlace =
      document.documentElement.clientHeight - (rect.height + rect.y);
    const rightPlace =
      document.documentElement.clientWidth - (rect.width + rect.x);

    if (bootomPlace < 10) {
      this._panel.nativeElement.style.top = `${rect.top - 285}px`;
    }

    if (rightPlace < 10) {
      this._panel.nativeElement.style.left = `${
        rect.left - Math.abs(rightPlace) - 5
      }px`;
    }
  }
}
