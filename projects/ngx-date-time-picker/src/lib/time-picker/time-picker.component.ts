import {
  ChangeDetectorRef,
  EventEmitter,
  ElementRef,
  Component,
  ViewChild,
  Output,
  Input,
} from '@angular/core';

import { ClockType, InputType, TimeType } from '../types';
import { TimeComponent } from './time/time.component';
import { ITime } from '../interfaces';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css'],
})
export class TimePickerComponent {
  private _hour = '--';
  private _minute = '--';
  private _second = '--';
  private _timeType: TimeType = '--';
  private _lastEmmited: ITime;

  showPanel = false;

  set hour(value: string) {
    this._hour = value;
    this._emitValue();
  }
  get hour() {
    return this._hour;
  }

  set minute(value: string) {
    this._minute = value;
    this._emitValue();
  }
  get minute() {
    return this._minute;
  }

  set second(value: string) {
    this._second = value;
    this._emitValue();
  }
  get second() {
    return this._second;
  }

  set timeType(value: TimeType) {
    this._timeType = value;
    this._emitValue();
  }
  get timeType() {
    return this._timeType;
  }

  @Input() seconds: boolean;
  @Input() clockType: ClockType;
  @Input() set value(value: ITime) {
    if (value) {
      this.hour = value.hour;
      this.minute = value.minute;
      this.second = value.second;
      this.timeType = value.type;
      this._emitValue();
    }
  }
  get value() {
    return {
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      type: this.timeType,
    };
  }

  @Input() type: InputType;
  @Output() valueChange = new EventEmitter<ITime>();
  @ViewChild('secondInput') private _secondInput: TimeComponent;
  @ViewChild('timeInput') private _timeInput: TimeComponent;

  constructor(public cd: ChangeDetectorRef, private _element: ElementRef) {}

  isClear(): boolean {
    return (
      JSON.stringify(this.value) ===
      JSON.stringify({
        hour: '--',
        minute: '--',
        second: '--',
        type: '--',
      })
    );
  }

  focusOnPrevious(): void {
    if (this.type === 'date-time') {
      this._element.nativeElement.parentNode.children[0].children[0].children[0].children[4].children[0].focus();
    }
  }

  setFocusOnSecond(): void {
    if (this._secondInput) {
      this._secondInput.focus();
    }
  }

  setFocusOnTime(): void {
    if (this._timeInput) {
      this._timeInput.focus();
    }
  }

  private _emitValue(): void {
    const value = {
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      type: this.timeType,
    };

    if (JSON.stringify(this._lastEmmited) === JSON.stringify(value)) {
      return;
    }

    this.valueChange.emit(value);
    this._lastEmmited = value;
  }
}
