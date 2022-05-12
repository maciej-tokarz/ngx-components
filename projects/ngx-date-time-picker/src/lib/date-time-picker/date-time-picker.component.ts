import {
  ChangeDetectorRef,
  EventEmitter,
  Component,
  Output,
  Input,
} from '@angular/core';

import { SettingsService } from '../settings.service';
import { ITime } from '../interfaces';
import { ClockType } from '../types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
})
export class DateTimePickerComponent {
  settings = this._settingsService.getSettings();
  dateTimePanelShowed = false;
  internalDate: string;
  internalTime: ITime;

  seconds = this._settingsService.seconds;
  type = this._settingsService.type;

  @Input() clockType: ClockType;
  @Input() date: string;
  @Input() time: ITime;

  @Output() valueChange = new EventEmitter<string>();

  constructor(
    private _settingsService: SettingsService,
    public cd: ChangeDetectorRef
  ) {}

  showDateTimePanel(): void {
    this.dateTimePanelShowed = !this.dateTimePanelShowed;
    this.cd.detectChanges();
  }

  dateChange(value: string): void {
    console.log('date change', value);
  }

  timeChange(value: ITime): void {
    console.log('time change', value);
  }

  emitDate(value: string): void {
    console.log('emit date', value);
  }

  emitTime(value: ITime): void {
    console.log('emit time', value);
  }

  emitDateTime(): void {
    console.log('emit date time');
  }

  dateTimeClear(): void {
    console.log('date time clear');
  }

  hideDateTimePanel(parameter: null | 'onEnter'): void {
    console.log('hide date time panel', parameter);
    if (
      parameter === 'onEnter'
      // (this._initDate === this._datePicker.value &&
      //   JSON.stringify(this._initTime) ===
      //     JSON.stringify(this._timePicker.value)) ||
      // (this._initDate === undefined && this._datePicker.isNotComplete())
    ) {
      // this._hideDateTimePanel();
      return;
    }

    // this._datePanel.restoreInitValue();
    // this._resetDateTime();
    this.cd.detectChanges();
  }

  private _hideDateTimePanel(): void {
    this.dateTimePanelShowed = false;
    // this._datePicker.setFocus();
    this.cd.detectChanges();
  }
}
