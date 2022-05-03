import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DatePickerComponent } from './date-picker.component';
import { DatePanelComponent } from './panel/panel.component';
import { MonthsComponent } from './months/months.component';
import { MonthComponent } from './month/month.component';
import { YearComponent } from './year/year.component';
import { DayComponent } from './day/day.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DatePickerComponent,
    DatePanelComponent,
    MonthsComponent,
    MonthComponent,
    YearComponent,
    DayComponent,
  ],
  exports: [DatePickerComponent, DatePanelComponent],
})
export class DatePickerModule {}
