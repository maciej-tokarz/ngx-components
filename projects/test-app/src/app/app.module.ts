import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxDateTimePickerModule } from 'projects/ngx-date-time-picker/src/public-api';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxDateTimePickerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
