import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DatePickerModule } from '../date-picker/date-picker.module';
import { TimePickerModule } from '../time-picker/time-picker.module';

import { DateTimePickerComponent } from './date-time-picker.component';

@NgModule({
  imports: [CommonModule, DatePickerModule, TimePickerModule],
  declarations: [DateTimePickerComponent],
  exports: [DateTimePickerComponent],
})
export class DateTimePickerModule {}
