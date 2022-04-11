import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  initValue = '1970-03-21T05:20:03';

  showChanges(value: string): void {
    console.log('Changed value', value);
  }

  getDate(): Date {
    return new Date();
  }
}
