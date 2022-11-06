import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOpenWeatherData } from '../models/interfaces/open-weather-data.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenweatherApiService {
  baseUrl: string = 'http://api.openweathermap.org/data/2.5/';

  constructor(private _http: HttpClient, private _snackBar: MatSnackBar) { }

  getWeatherByCity(cityName: string): Observable<IOpenWeatherData> {
    const apiKey: string = environment.owApiKey;
    const url: string = this.baseUrl + `weather?q=${cityName}&units=metric&appid=${apiKey}`;
    return this._http.get<IOpenWeatherData>(url)
      .pipe(
        catchError((err: HttpErrorResponse): Observable<never> => {
          if (err.status === 404 && err.error?.message === 'city not found') {
            this._snackBar.open(`${cityName} - not found! Please, try another.`, '', { duration: 5000, horizontalPosition: 'right', verticalPosition: 'top' });
          }
          throw err;
        })
      );
  }
}
