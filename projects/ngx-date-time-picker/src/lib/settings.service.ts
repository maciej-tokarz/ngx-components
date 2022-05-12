import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { settingsData } from './settings-data';
import { ISettings } from './interfaces';
import { InputType } from './types';

@Injectable()
export class SettingsService {
  locale = navigator.language;
  seconds = false;
  type: InputType;

  constructor() {}

  getWeekdaysMin(): string[] {
    moment.locale(this.locale);

    const weekdaysMin = [...moment.localeData().weekdaysMin()];

    if (moment.localeData().firstDayOfWeek() === 1) {
      weekdaysMin.push(weekdaysMin.shift());
    }

    if (moment.localeData().firstDayOfWeek() === 6) {
      weekdaysMin.unshift(weekdaysMin.pop());
    }

    return weekdaysMin;
  }

  getMonths(): string[] {
    moment.locale(this.locale);
    return moment.localeData().months();
  }

  getMonthsShort(): string[] {
    moment.locale(this.locale);
    return moment.localeData().monthsShort();
  }

  getSettings(): ISettings {
    const data = settingsData[this.locale.toLowerCase()];
    return data !== undefined ? data : settingsData['en-us'];
  }
}
