import {
  ChangeDetectorRef,
  AfterViewInit,
  EventEmitter,
  ElementRef,
  Component,
  Attribute,
  ViewChild,
  OnDestroy,
  Output,
  Input,
} from '@angular/core';

import { DatePickerComponent } from './date-picker/date-picker.component';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { DatePanelComponent } from './date-picker/panel/panel.component';
import { TimePanelComponent } from './time-picker/panel/panel.component';
import { ClockType, InputType, TimeType } from './types';
import { getSettings } from './settings';
import { ITime } from './interfaces';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngx-date-time-picker',
  templateUrl: './ngx-date-time-picker.component.html',
  styleUrls: ['./ngx-date-time-picker.component.css'],
})
export class NgxDateTimePickerComponent implements AfterViewInit, OnDestroy {
  private _initDate: string;
  private _selectedYear: number;
  private _selectedMonth: number;
  private _selectedMonthName: string;
  private _selectedDay: number;
  private _initTime: ITime;
  private _selectedHour: number;
  private _selectedMinute: number;
  private _selectedSecond: number;
  private _selectedType: TimeType;
  private _lastEmmitedDate: string;
  private _lastEmmitedTime: string;
  private _lastEmmitedDateTime: string;

  clockType = this._getBrowserClockType();
  internalDate: string;
  internalTime: ITime;
  settings = getSettings(navigator.language);
  dateTimePanelShowed = false;
  documentMouseDown = this._documentMouseDown.bind(this);

  @Input() set value(date: Date | string) {
    if (date) {
      if (typeof date === 'string' || date instanceof String) {
        date = new Date(date);
      }

      this._setInternalDate(date);
      this._setInternalTime(date);
    }
  }
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change = new EventEmitter<string>();
  @ViewChild('panel') private _panel: ElementRef;
  @ViewChild('datePicker') private _datePicker: DatePickerComponent;
  @ViewChild('timePicker') private _timePicker: TimePickerComponent;
  @ViewChild('datePanel') private _datePanel: DatePanelComponent;
  @ViewChild('timePanel') private _timePanel: TimePanelComponent;

  constructor(
    @Attribute('seconds') public seconds: string,
    @Attribute('locale') private _locale: string,
    @Attribute('type') public type: InputType,
    public cd: ChangeDetectorRef
  ) {
    if (this._locale) {
      this.settings = getSettings(this._locale);
      this._setClockType(this._locale);
    }
  }

  ngAfterViewInit(): void {
    if (this.type === 'date-time') {
      document.addEventListener('mousedown', this.documentMouseDown);
    }
  }

  ngOnDestroy(): void {
    if (this.type === 'date-time') {
      document.removeEventListener('mousedown', this.documentMouseDown);
    }
  }

  showDateTimePanel(): void {
    this.dateTimePanelShowed = !this.dateTimePanelShowed;
    this.cd.detectChanges();

    if (this.dateTimePanelShowed) {
      this._setDateTimeInitData();
      this._panel.nativeElement.focus();
      this._setPanelPosition();
    }
  }

  dateChange(date: string): void {
    this._setTimeIfEmpty();
    this.internalDate = date;
    this.cd.detectChanges();
  }

  timeChange(time: ITime): void {
    this._setDateIfEmpty();
    this.internalTime = time;
    this.cd.detectChanges();
  }

  hideDateTimePanel(parameter: null | 'onEnter'): void {
    if (
      parameter === 'onEnter' ||
      (this._initDate === this._datePicker.value &&
        JSON.stringify(this._initTime) ===
          JSON.stringify(this._timePicker.value)) ||
      (this._initDate === undefined && this._datePicker.isClear())
    ) {
      this._hideDateTimePanel();
      return;
    }

    this._datePanel.restoreInitValue();
    this._resetDateTime();
    this.cd.detectChanges();
  }

  dateTimeClear(): void {
    this.internalDate = null;
    this.internalTime = {
      hour: '--',
      minute: '--',
      second: '--',
      type: '--',
    };
    this._hideDateTimePanel();
  }

  emitDate(value: string): void {
    if (this._dateIsClear(value)) {
      value = '';
    }

    if (this._lastEmmitedDate === value) {
      return;
    }

    this._lastEmmitedDate = value;
    this.type === 'date' ? this.change.emit(value) : this._emitDateTime();
  }

  emitTime(value: ITime): void {
    const isIncomplete =
      value.hour === '--' ||
      value.minute === '--' ||
      (this.seconds === '' && value.second === '--') ||
      (this.clockType === 12 && value.type === '--');

    const toEmit = isIncomplete
      ? ''
      : `${value.hour.pad()}:${value.minute.pad()}${
          this.seconds === '' ? ':' + value.second.pad() : ''
        }`;

    if (this._lastEmmitedTime === toEmit) {
      return;
    }

    this._lastEmmitedTime = toEmit;
    this.type === 'time' ? this.change.emit(toEmit) : this._emitDateTime();
  }

  private _setDateTimeInitData(): void {
    this._initDate = this._datePicker.value;
    this._selectedYear = this._datePanel.selectedYear;
    this._selectedMonth = this._datePanel.selectedMonth;
    this._selectedMonthName = this._datePanel.selectedMonthName;
    this._selectedDay = this._datePanel.selectedDay;

    this._initTime = this._timePicker.value;
    this._selectedHour = this._timePanel.selectedHour;
    this._selectedMinute = this._timePanel.selectedMinute;
    this._selectedSecond = this._timePanel.selectedSecond;
    this._selectedType = this._timePanel.selectedType;
  }

  private _resetDateTime(): void {
    this.internalDate = this._initDate;
    this._datePanel.selectedYear = this._selectedYear;
    this._datePanel.selectedMonth = this._selectedMonth;
    this._datePanel.selectedMonthName = this._selectedMonthName;
    this._datePanel.selectedDay = this._selectedDay;

    const time: ITime = this._initTime
      ? this._initTime
      : {
          hour: '--',
          minute: '--',
          second: '--',
          type: '--',
        };

    this.internalTime = time;
    this._timePanel.selectedHour = this._selectedHour;
    this._timePanel.selectedMinute = this._selectedMinute;
    this._timePanel.selectedSecond = this._selectedSecond;
    this._timePanel.selectedType = this._selectedType;
  }

  private _setTimeIfEmpty(): void {
    if (this._timePicker.isClear()) {
      this.internalTime = {
        hour: String(this._timePanel.selectedHour).pad(),
        minute: String(this._timePanel.selectedMinute).pad(),
        second: String(this._timePanel.selectedSecond).pad(),
        type: this._timePanel.selectedType,
      };
    }
  }

  private _setDateIfEmpty(): void {
    if (this._datePicker.isClear()) {
      const date = new Date();
      this.internalDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).pad()}-${String(date.getDate()).pad()}`;
    }
  }

  private _hideDateTimePanel(): void {
    this.dateTimePanelShowed = false;
    this._datePicker.setFocus();
    this.cd.detectChanges();
  }

  private _dateIsClear(date: string): boolean {
    return (
      date.substring(0, 4) === this.settings.placeholder.year ||
      date.substring(5, 7) === this.settings.placeholder.month ||
      date.substring(8, 10) === this.settings.placeholder.day
    );
  }

  private _documentMouseDown(event: MouseEvent): void {
    if (this._panel && !this._panel.nativeElement.contains(event.target)) {
      this.dateTimePanelShowed = false;
      this.cd.detectChanges();
      this._emitDateTime();
    }
  }

  private _getBrowserClockType(): ClockType {
    return Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, {
      hour: 'numeric',
    }).resolvedOptions().hour12
      ? 12
      : 24;
  }

  private _emitDateTime(): void {
    let dateTime = `${this._lastEmmitedDate}T${this._lastEmmitedTime}`;

    const isValid = dateTime.length === 19 || dateTime.length === 16;

    if (!isValid) {
      dateTime = '';
    }

    if (dateTime === this._lastEmmitedDateTime) {
      return;
    }

    this._lastEmmitedDateTime = dateTime;
    this.change.emit(dateTime);
  }

  private _setClockType(locale: string): void {
    const locales12 = [
      'en-au',
      'bn-bd',
      'en-ca',
      'fr-ca',
      'es-co',
      'ar-eg',
      'es-sv',
      'es-hn',
      'hi-in',
      'ga-ie',
      'ar-jo',
      'ms-my',
      'es-mx',
      'en-nz',
      'es-ni',
      'ur-pk',
      'tl-ph',
      'ar-sa',
      'en-us',
    ];
    locales12.includes(locale.toLowerCase())
      ? (this.clockType = 12)
      : (this.clockType = 24);
  }

  private _setInternalDate(date: Date): void {
    this.internalDate = `${date.getFullYear()}-${(
      date.getMonth() + 1
    ).pad()}-${date.getDate().pad()}`;
    this.cd.detectChanges();
  }

  private _setInternalTime(date: Date): void {
    const initValue = date
      .toLocaleTimeString([], {
        hour12: this.clockType === 12,
      })
      .split(':');

    this.internalTime = {
      hour: initValue[0].pad(),
      minute: initValue[1].pad(),
      second: initValue[2].split(' ')[0],
      type: initValue[2].split(' ')[1] as TimeType,
    };
    this.cd.detectChanges();
  }

  private _setPanelPosition(): void {
    const rect: DOMRect = this._panel.nativeElement.getBoundingClientRect();
    const bootomPlace =
      document.documentElement.clientHeight - (rect.height + rect.y);
    const rightPlace =
      document.documentElement.clientWidth - (rect.width + rect.x);

    if (bootomPlace < 10) {
      this._panel.nativeElement.style.top = `${rect.top - 340}px`;
    }

    if (rightPlace < 10) {
      this._panel.nativeElement.style.left = `${
        rect.left - Math.abs(rightPlace) - 5
      }px`;
    }
  }
}
