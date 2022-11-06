import { TestBed } from '@angular/core/testing';

import { OpenweatherGeoApiService } from './openweather-geo-api.service';

describe('OpenweatherGeoApiService', () => {
  let service: OpenweatherGeoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenweatherGeoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
