import {
  ChangeDetectorRef,
  AfterViewInit,
  EventEmitter,
  ElementRef,
  Component,
  ViewChild,
  OnDestroy,
  Output,
  Input,
} from '@angular/core';

import { ClockType, InputType, TimeType } from '../../types';
import { ITime } from '../../interfaces';

const hours12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const hours24 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];
const sixties = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
];
const hours12ScrollTopBase = 396;
const hours24ScrollTopBase = 864;
const sixtiesScrollTopBase = 2160;
const elementHeight = 36;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'time-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class TimePanelComponent implements AfterViewInit, OnDestroy {
  private _setted = false;
  private _initValue: ITime = null;
  private _initSelectedValue: ITime = null;
  private _hoursScrollTop: number;
  private _minutesScrollTop: number;
  private _secondsScrollTop: number;

  hours: number[] = [];
  minutes: number[] = [];
  seconds: number[] = [];
  timeTypes: TimeType[] = [];
  selectedHour = -1;
  selectedMinute = -1;
  selectedSecond = -1;
  selectedType: TimeType = 'AM';
  hourOvered = -1;
  minuteOvered = -1;
  secondOvered = -1;
  typeOvered = '';
  documentMouseDown = this._documentMouseDown.bind(this);
  documentKeyDown = this._documentKeyDown.bind(this);

  @Input() showSeconds: boolean;
  @Input() clockType: ClockType;
  @Input() set show(value: ITime) {
    if (value && !this._setted) {
      this._initValue = value;
      this._selectValues(value);
      this._setHours();
      this._setMinutes();
      this._setSeconds();
      this._setted = true;
    }
  }
  @Input() type: InputType;
  @Output() hidePanel = new EventEmitter<null | 'onEnter'>();
  @Output() timeChange = new EventEmitter<ITime>();
  @ViewChild('panel') private _panel: ElementRef;
  @ViewChild('hoursContainer') private _hoursContainer: ElementRef;
  @ViewChild('minutesContainer') private _minutesContainer: ElementRef;
  @ViewChild('secondsContainer') private _secondsContainer: ElementRef;

  constructor(public cd: ChangeDetectorRef) {
    document.addEventListener('keydown', this.documentKeyDown);
  }

  ngAfterViewInit(): void {
    if (this.type === 'time') {
      document.addEventListener('mousedown', this.documentMouseDown);
      this._setPanelPosition();
    }

    this._setInitScrollTopPositions();
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.documentKeyDown);

    if (this.type === 'time') {
      document.removeEventListener('mousedown', this.documentMouseDown);
    }
  }

  setTime(): void {
    this.timeChange.emit({
      hour: this.selectedHour !== -1 ? this.selectedHour.pad() : '--',
      minute: this.selectedMinute !== -1 ? this.selectedMinute.pad() : '--',
      second: this.selectedSecond !== -1 ? this.selectedSecond.pad() : '--',
      type: this.selectedType,
    });
    this.cd.detectChanges();
  }

  clear(): void {
    this.timeChange.emit({
      hour: '--',
      minute: '--',
      second: '--',
      type: '--',
    });
  }

  private _setInitScrollTopPositions(): void {
    this._hoursScrollTop = this._hoursContainer.nativeElement.scrollTop;
    this._minutesScrollTop = this._minutesContainer.nativeElement.scrollTop;

    if (this._secondsContainer) {
      this._secondsScrollTop = this._secondsContainer.nativeElement.scrollTop;
    }
  }

  private _selectValues(value: ITime): void {
    const currentTime = new Date()
      .toLocaleTimeString([], {
        hour12: this.clockType === 12,
      })
      .split(':');

    this.selectedHour =
      value.hour !== '--' ? Number(value.hour) : Number(currentTime[0]);
    this.selectedMinute =
      value.minute !== '--' ? Number(value.minute) : Number(currentTime[1]);
    this.selectedSecond =
      value.second !== '--'
        ? Number(value.second)
        : Number(currentTime[2].substring(0, 2));
    this.selectedType =
      value.type !== '--'
        ? value.type
        : null || (currentTime[2].substring(3, 5) as TimeType);
    this._initSelectedValue = {
      hour: this.selectedHour.pad(),
      minute: this.selectedMinute.pad(),
      second: this.selectedSecond.pad(),
      type: this.selectedType,
    };
    this.timeTypes = this.selectedType === 'AM' ? ['AM', 'PM'] : ['PM', 'AM'];
  }

  private _setHours(): void {
    this.hours =
      this.clockType === 12
        ? [...hours12, ...hours12, ...hours12]
        : [...hours24, ...hours24, ...hours24];
    this.cd.detectChanges();
    this._hoursContainer.nativeElement.scrollTop =
      (this.clockType === 12 ? hours12ScrollTopBase : hours24ScrollTopBase) +
      this.selectedHour * elementHeight;
  }

  private _setMinutes(): void {
    this.minutes = [...sixties, ...sixties, ...sixties];
    this.cd.detectChanges();
    this._minutesContainer.nativeElement.scrollTop =
      sixtiesScrollTopBase + this.selectedMinute * elementHeight;
  }

  private _setSeconds(): void {
    if (!this.showSeconds) {
      return;
    }

    this.seconds = [...sixties, ...sixties, ...sixties];
    this.cd.detectChanges();
    this._secondsContainer.nativeElement.scrollTop =
      sixtiesScrollTopBase + this.selectedSecond * elementHeight;
  }

  private _documentMouseDown(event: MouseEvent): void {
    if (this._panel && !this._panel.nativeElement.contains(event.target)) {
      this.hidePanel.emit();
    }
  }

  private _documentKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.setTime();

      this.type === 'time'
        ? this.hidePanel.emit()
        : this.hidePanel.emit('onEnter');
    }

    if (event.key === 'Escape') {
      if (this.type === 'date-time') {
        this._restoreInitScrollTopPositions();
        this.hidePanel.emit();
        return;
      }

      const emptyValue = JSON.stringify({
        hour: '--',
        minute: '--',
        second: '--',
        type: '--',
      });
      const initValue = JSON.stringify(this._initValue);
      const initSelectedValue = JSON.stringify(this._initSelectedValue);
      const currentValue = JSON.stringify({
        hour: this.selectedHour.pad(),
        minute: this.selectedMinute.pad(),
        second: this.selectedSecond.pad(),
        type: this.selectedType,
      });

      if (initValue === emptyValue && initSelectedValue === currentValue) {
        this.hidePanel.emit();
      }

      if (initValue === emptyValue && initSelectedValue !== currentValue) {
        this._selectValues(this._initSelectedValue);
        this.timeChange.emit({
          hour: '--',
          minute: '--',
          second: '--',
          type: '--',
        });
      }

      if (initValue !== emptyValue && initSelectedValue !== currentValue) {
        this._selectValues(this._initSelectedValue);
        this.timeChange.emit(this._initSelectedValue);
      }

      if (initValue !== emptyValue && initSelectedValue === currentValue) {
        this.hidePanel.emit();
      }

      this._restoreInitScrollTopPositions();
    }
  }

  private _restoreInitScrollTopPositions(): void {
    this._hoursContainer.nativeElement.scrollTop = this._hoursScrollTop;
    this._minutesContainer.nativeElement.scrollTop = this._minutesScrollTop;

    if (this._secondsContainer) {
      this._secondsContainer.nativeElement.scrollTop = this._secondsScrollTop;
    }
  }

  private _setPanelPosition(): void {
    const rect: DOMRect = this._panel.nativeElement.getBoundingClientRect();
    const bootomPlace =
      document.documentElement.clientHeight - (rect.height + rect.y);
    const rightPlace =
      document.documentElement.clientWidth - (rect.width + rect.x);

    if (bootomPlace < 10) {
      this._panel.nativeElement.style.top = `${rect.top - 285}px`;
    }

    if (rightPlace < 10) {
      this._panel.nativeElement.style.left = `${
        rect.left - Math.abs(rightPlace) - 5
      }px`;
    }
  }
}
