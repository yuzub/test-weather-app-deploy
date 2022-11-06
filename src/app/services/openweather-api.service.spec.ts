import { TestBed } from '@angular/core/testing';

import { OpenweatherApiService } from './openweather-api.service';

describe('OpenweatherApiService', () => {
  let service: OpenweatherApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenweatherApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
