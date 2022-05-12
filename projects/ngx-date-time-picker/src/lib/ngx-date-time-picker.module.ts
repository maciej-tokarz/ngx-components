import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import './prototypes';

import { DateTimePickerModule } from './date-time-picker/date-time-picker.module';
import { NgxDateTimePickerComponent } from './ngx-date-time-picker.component';
import { TimePickerModule } from './time-picker/time-picker.module';
import { DatePickerModule } from './date-picker/date-picker.module';

@NgModule({
  declarations: [NgxDateTimePickerComponent],
  imports: [
    CommonModule,
    DatePickerModule,
    TimePickerModule,
    DateTimePickerModule,
  ],
  exports: [NgxDateTimePickerComponent],
})
export class NgxDateTimePickerModule {}
