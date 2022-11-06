import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IOpenWeatherData } from 'src/app/models/interfaces/open-weather-data.interface';
import { WeatherDataService } from 'src/app/services/weather-data.service';

@Component({
  selector: 'app-city-weather',
  templateUrl: './city-weather.component.html',
  styleUrls: ['./city-weather.component.scss']
})
export class CityWeatherComponent implements OnInit {
  get weatherData(): Observable<IOpenWeatherData> {
    return this._weatherDataService.weatherData$;
  }

  constructor(private _weatherDataService: WeatherDataService) { }

  ngOnInit(): void {
  }

  iconUrl(wData: IOpenWeatherData): string {
    return `http://openweathermap.org/img/wn/${wData?.weather?.[0]?.icon}@2x.png`;
  }
}
