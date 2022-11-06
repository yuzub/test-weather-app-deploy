import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IOpenWeatherData } from './models/interfaces/open-weather-data.interface';
import { WeatherDataService } from './services/weather-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  bgImageUrl: string = 'url(/assets/img/day/default.jpg)';
  destroyed$: Subject<void> = new Subject<void>();
  owMainConditions: string[] = ['clear', 'clouds', 'rain', 'drizzle', 'snow', 'fog', 'mist', 'thunderstorm'];

  constructor(private _weatherDataService: WeatherDataService) { }

  ngOnInit(): void {
    this._weatherDataService.weatherData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: IOpenWeatherData | undefined) => {
        const weatherCondition: string | undefined = res?.weather?.[0]?.main?.toLowerCase();
        const bgImgName: string = weatherCondition && this.owMainConditions.includes(weatherCondition) ? weatherCondition : 'default';
        this.bgImageUrl = `url(/assets/img/day/${bgImgName}.jpg)`;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
