import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TimePickerComponent } from './time-picker.component';
import { TimePanelComponent } from './panel/panel.component';
import { MinuteComponent } from './minute/minute.component';
import { SecondComponent } from './second/second.component';
import { HourComponent } from './hour/hour.component';
import { TimeComponent } from './time/time.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TimePickerComponent,
    MinuteComponent,
    SecondComponent,
    TimePanelComponent,
    HourComponent,
    TimeComponent,
  ],
  exports: [TimePickerComponent, TimePanelComponent],
})
export class TimePickerModule {}
