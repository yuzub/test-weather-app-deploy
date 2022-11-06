import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { IOpenWeatherData } from 'src/app/models/interfaces/open-weather-data.interface';
import { IReverseGeo } from 'src/app/models/interfaces/reverse-geo.interface';
import { OpenweatherApiService } from 'src/app/services/openweather-api.service';
import { OpenweatherGeoApiService } from 'src/app/services/openweather-geo-api.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';
import { MessageModalComponent } from '../message-modal/message-modal.component';

@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss']
})
export class CitiesListComponent implements OnInit {
  lsKey: string = 'wAppCities';
  storageCities: string[] = [];
  curCities: string[] = [];
  geolocationCity: string = '';
  selectedCity: string = '';
  newCityCtrl: FormControl = new FormControl('');
  formGroup: FormGroup = new FormGroup({
    newCity: this.newCityCtrl
  });
  curPage: number = 1;
  pageSize: number = 5;

  get maxPage(): number {
    return Math.ceil(this.storageCities.length / this.pageSize);
  }

  constructor(
    private _openweatherGeoApi: OpenweatherGeoApiService,
    private _openWeatherApi: OpenweatherApiService,
    private _weatherDataService: WeatherDataService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const storageCities = localStorage.getItem(this.lsKey);
    this.storageCities = storageCities ? JSON.parse(storageCities) : [];

    this._getGeolocation();
    this.curCities = this._getPage(this.curPage);
  }

  private _getGeolocation(): void {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(this._getCityName.bind(this), this._errClbk, options);
  }

  private _getCityName(position: GeolocationPosition): void {
    this._openweatherGeoApi.getReverseGeocoding(position.coords.latitude, position.coords.longitude, 1).subscribe((res: IReverseGeo[]): void => {
      if (res) {
        this.geolocationCity = res[0].name;
        this.selectedCity = this.geolocationCity;
        this._getSelectedCityWeather();
      }
    });
  }

  private _errClbk(err: GeolocationPositionError): void {
    console.error(err);
  }

  private _getSelectedCityWeather(): void {
    this._openWeatherApi.getWeatherByCity(this.selectedCity).subscribe((res: IOpenWeatherData): void => {
      this._weatherDataService.updateData(res);
    });
  }

  addCity(): void {
    const newCity: string = this.newCityCtrl.value?.trim();
    this.newCityCtrl.setValue('');

    if (!newCity || this.storageCities.includes(newCity)) {
      return;
    }

    this.storageCities.push(newCity);
    this._saveCities(this.storageCities);
    this.curPage = this.maxPage;
    this.curCities = this._getPage(this.curPage);
  }

  private _saveCities(items: string[]) {
    localStorage.setItem(this.lsKey, JSON.stringify(items));
  }

  private _getPage(pageNumber: number): string[] {
    return this.storageCities.slice((pageNumber - 1) * this.pageSize, pageNumber * this.pageSize);
  }

  selectCity(event: Event): void {
    if (!(event.target as HTMLElement)?.classList?.contains('List__city')) {
      return;
    };

    const newSelected: string = (event.target as HTMLDivElement).innerText;
    if (this.selectedCity !== newSelected) {
      this.selectedCity = newSelected;
      this._getSelectedCityWeather();
    }
  }

  deleteCity(event: Event, city: string): void {
    event.stopPropagation();
    this._dialog
      .open(MessageModalComponent)
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((): void => {
        this.storageCities = this.storageCities.filter((item: string): boolean => item !== city);
        this._saveCities(this.storageCities);
        this.curPage = 1;
        this.curCities = this._getPage(1);
      });
  }

  setCities(inc: number): void {
    this.curPage += inc;
    this.curCities = this._getPage(this.curPage);
  }
}
