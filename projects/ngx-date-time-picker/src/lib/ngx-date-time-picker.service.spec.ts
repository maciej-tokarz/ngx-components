import { TestBed } from '@angular/core/testing';

import { NgxDateTimePickerService } from './ngx-date-time-picker.service';

describe('NgxDateTimePickerService', () => {
  let service: NgxDateTimePickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDateTimePickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
