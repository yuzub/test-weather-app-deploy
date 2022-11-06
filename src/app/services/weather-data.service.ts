import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IOpenWeatherData } from '../models/interfaces/open-weather-data.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  private _weatherData: Subject<IOpenWeatherData> = new Subject<IOpenWeatherData>();
  weatherData$: Observable<IOpenWeatherData> = this._weatherData.asObservable();

  updateData(wData: IOpenWeatherData): void {
    this._weatherData.next(wData);
  }
}
