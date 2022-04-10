import { NgModule } from '@angular/core';
import './prototypes';

import { NgxDateTimePickerComponent } from './ngx-date-time-picker.component';
import { TimePickerModule } from './time-picker/time-picker.module';
import { DatePickerModule } from './date-picker/date-picker.module';

@NgModule({
  declarations: [NgxDateTimePickerComponent],
  imports: [DatePickerModule, TimePickerModule],
  exports: [NgxDateTimePickerComponent],
})
export class NgxDateTimePickerModule {}
