import {
  ChangeDetectorRef,
  AfterViewInit,
  EventEmitter,
  ElementRef,
  Component,
  ViewChild,
  Output,
  Input,
} from '@angular/core';

import { ISettings, IYearMonth } from '../../interfaces';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'months',
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.css'],
})
export class MonthsComponent implements AfterViewInit {
  years: number[] = [];
  inputtedYear: number;
  monthOvered: number;

  @Input() settings: ISettings;
  @Input() selectedYear: number;
  @Input() selectedMonth: number;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() result = new EventEmitter<IYearMonth>();
  @ViewChild('yearsContainer') private _yearsContainer: ElementRef;

  constructor(public cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.inputtedYear = this.selectedYear;
    this.years = [...Array(44).keys()]
      .map((y) => this.selectedYear - 22 + y)
      .filter((y) => y >= 1000 && y <= 9999);
    this.cd.detectChanges();
    const selectedYear = document.getElementById(this.selectedYear.toString());
    selectedYear.scrollIntoView();
  }

  selectYear(y: number): void {
    this.selectedYear = y;
    this.cd.detectChanges();
  }

  selectMonth(month: string): void {
    this.result.emit({
      year: this.selectedYear,
      month: this.settings.translations.monthsShort.indexOf(month),
    });
  }

  onScroll(): void {
    const scrollTop = this._yearsContainer.nativeElement.scrollTop;
    const scrollHeight = this._yearsContainer.nativeElement.scrollHeight;
    const scrollBottom = scrollHeight - scrollTop - 231;

    if (scrollTop < 100) {
      this._addYearsOnTop();
    }

    if (scrollBottom < 100) {
      this._addYearsOnBottom();
    }
  }

  private _addYearsOnTop(): void {
    const startYear = this.years[0] - 22;
    const newYears = [...Array(22).keys()].map((y) => startYear + y);
    this.years = [...newYears, ...this.years].filter((y) => y >= 1000);
    this.cd.detectChanges();
  }

  private _addYearsOnBottom(): void {
    const startYear = this.years.slice(-1).pop() + 1;
    const newYears = [...Array(22).keys()].map((y) => startYear + y);
    this.years = [...this.years, ...newYears].filter((y) => y <= 9999);
    this.cd.detectChanges();
  }
}
